import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Decision from '@/models/Decision';
import Option from '@/models/Option';
import Feedback from '@/models/Feedback';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const decisions = await Decision.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const decisionsWithDetails = await Promise.all(
      decisions.map(async (decision) => {
        const options = await Option.find({ decisionId: decision._id }).lean();
        const feedback = await Feedback.findOne({ decisionId: decision._id }).lean();
        
        return {
          ...decision,
          options,
          feedback,
        };
      })
    );

    return NextResponse.json({ decisions: decisionsWithDetails });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}