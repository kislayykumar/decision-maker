import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Update user (suspend/unsuspend, delete, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    console.log('=== PATCH Request Started ===');
    console.log('Params:', params);
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session?.user);

    if (!session || !(session.user as any).isAdmin) {
      console.log('Unauthorized access attempt');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    console.log('Database connected');

    const { userId } = params;
    const body = await request.json();
    const { action, suspendedReason } = body;
    
    console.log('Request body:', { userId, action, suspendedReason });

    // Verify user exists
    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User found:', user.email);
    console.log('Current suspension status:', user.isSuspended);

    if (action === 'suspend') {
      console.log('Suspending user...');
      
      // Use native MongoDB update for reliability
      const updateResult = await mongoose.connection.db.collection('users').updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          $set: {
            isSuspended: true,
            suspendedReason: suspendedReason || 'Violation of terms of service',
            suspendedAt: new Date(),
          }
        }
      );
      
      console.log('Update result:', updateResult);

      // Verify the update
      const updatedUser = await User.findById(userId);
      console.log('After update:', {
        isSuspended: updatedUser?.isSuspended,
        suspendedReason: updatedUser?.suspendedReason,
        suspendedAt: updatedUser?.suspendedAt
      });

      if (!updatedUser?.isSuspended) {
        console.error('WARNING: Update did not persist to database!');
      }

      return NextResponse.json({
        success: true,
        message: 'User suspended successfully',
        user: {
          _id: updatedUser?._id,
          name: updatedUser?.name,
          email: updatedUser?.email,
          isSuspended: updatedUser?.isSuspended,
          suspendedReason: updatedUser?.suspendedReason,
          suspendedAt: updatedUser?.suspendedAt,
        },
      });
    } else if (action === 'unsuspend') {
      console.log('Unsuspending user...');
      
      // Use native MongoDB update and reset message count
      const updateResult = await mongoose.connection.db.collection('users').updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          $set: {
            isSuspended: false,
            suspensionMessageCount: 0,
          },
          $unset: {
            suspendedReason: '',
            suspendedAt: ''
          }
        }
      );
      
      console.log('Unsuspend result:', updateResult);

      const updatedUser = await User.findById(userId);
      console.log('After unsuspend:', {
        isSuspended: updatedUser?.isSuspended
      });

      return NextResponse.json({
        success: true,
        message: 'User unsuspended successfully',
        user: {
          _id: updatedUser?._id,
          name: updatedUser?.name,
          email: updatedUser?.email,
          isSuspended: updatedUser?.isSuspended,
        },
      });
    } else if (action === 'makeAdmin') {
      await mongoose.connection.db.collection('users').updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { isAdmin: true } }
      );

      const updatedUser = await User.findById(userId);

      return NextResponse.json({
        success: true,
        message: 'User is now an admin',
        user: updatedUser,
      });
    } else if (action === 'removeAdmin') {
      await mongoose.connection.db.collection('users').updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { isAdmin: false } }
      );

      const updatedUser = await User.findById(userId);

      return NextResponse.json({
        success: true,
        message: 'Admin privileges removed',
        user: updatedUser,
      });
    }

    console.log('Invalid action:', action);
    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in PATCH /api/admin/users/[userId]:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}