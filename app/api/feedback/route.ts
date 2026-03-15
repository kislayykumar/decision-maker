import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { decisionId, optionChosen, rating } = await request.json();

    if (!decisionId || !optionChosen || !rating) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (rating !== 'positive' && rating !== 'negative') {
      return NextResponse.json(
        { error: 'Rating must be either positive or negative' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const feedback = await Feedback.create({
      userId: user._id,
      decisionId,
      optionChosen,
      rating,
    });

    return NextResponse.json(
      {
        message: 'Feedback submitted successfully',
        feedback,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}