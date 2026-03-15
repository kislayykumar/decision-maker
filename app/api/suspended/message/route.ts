import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SuspendedUserMessage from '@/models/SuspendedUserMessage';
import User from '@/models/User';

// Send a message from suspended user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userEmail, userName, message, suspensionReason } = body;

    if (!userEmail || !userName || !message || !suspensionReason) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check user's current message count
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has exceeded message limit (2 messages)
    const messageCount = user.suspensionMessageCount || 0;
    if (messageCount >= 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'MESSAGE_LIMIT_REACHED',
          message: 'You have reached the maximum limit of 2 messages. Please wait for admin response.',
          attemptsLeft: 0,
          messageCount: 2
        },
        { status: 429 }
      );
    }

    // Create new message
    const newMessage = await SuspendedUserMessage.create({
      userEmail,
      userName,
      message,
      suspensionReason,
      isRead: false,
    });

    // Increment user's suspension message count
    await User.findOneAndUpdate(
      { email: userEmail },
      { $inc: { suspensionMessageCount: 1 } }
    );

    const attemptsLeft = 2 - (messageCount + 1);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully to admin',
      data: newMessage,
      attemptsLeft,
      messageCount: messageCount + 1,
    });
  } catch (error: any) {
    console.error('Error sending suspended user message:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}