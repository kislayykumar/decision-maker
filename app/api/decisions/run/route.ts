import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Option from '@/models/Option';
import { runDecisionEngine } from '@/lib/decisionEngine';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { decisionId, answers } = await request.json();

    if (!decisionId || !answers) {
      return NextResponse.json(
        { error: 'Please provide decisionId and answers' },
        { status: 400 }
      );
    }

    await connectDB();

    const options = await Option.find({ decisionId }).lean();

    if (options.length === 0) {
      return NextResponse.json(
        { error: 'No options found for this decision' },
        { status: 404 }
      );
    }

    const result = runDecisionEngine(
      options.map(opt => ({
        _id: (opt._id as any).toString(),
        optionName: opt.optionName,
        tags: opt.tags,
      })),
      answers
    );

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}