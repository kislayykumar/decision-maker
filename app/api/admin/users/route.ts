import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Decision from '@/models/Decision';
import Feedback from '@/models/Feedback';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all'; // all, active, suspended

    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (status === 'suspended') {
      query.isSuspended = true;
    } else if (status === 'active') {
      query.isSuspended = { $ne: true };
    }

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Get decision and feedback counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [decisionCount, feedbackCount] = await Promise.all([
          Decision.countDocuments({ userId: user._id }),
          Feedback.countDocuments({ userId: user._id }),
        ]);

        return {
          ...user,
          decisionCount,
          feedbackCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}