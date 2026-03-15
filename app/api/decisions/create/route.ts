import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Decision from '@/models/Decision';
import Option from '@/models/Option';
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

    const { title, options } = await request.json();

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'Please provide a title and at least 2 options' },
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

    const decision = await Decision.create({
      userId: user._id,
      title,
    });

    const optionDocs = await Option.insertMany(
      options.map((opt: any) => ({
        decisionId: decision._id,
        optionName: opt.name,
        tags: opt.tags || [],
      }))
    );

    return NextResponse.json(
      {
        message: 'Decision created successfully',
        decision: {
          id: decision._id,
          title: decision.title,
          options: optionDocs,
        },
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