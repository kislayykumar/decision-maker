import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { preferences } = await req.json();

    await connectDB();
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          preferences,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences,
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}