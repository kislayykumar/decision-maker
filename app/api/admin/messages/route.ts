import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import SuspendedUserMessage from '@/models/SuspendedUserMessage';

// Get all messages from suspended users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const messages = await SuspendedUserMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error: any) {
    console.error('Error fetching suspended user messages:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}