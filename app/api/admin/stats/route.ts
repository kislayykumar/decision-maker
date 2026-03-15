import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Decision from '@/models/Decision';
import Feedback from '@/models/Feedback';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get overall statistics
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalDecisions,
      totalFeedback,
      positiveFeedback,
      negativeFeedback,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isSuspended: { $ne: true } }),
      User.countDocuments({ isSuspended: true }),
      Decision.countDocuments(),
      Feedback.countDocuments(),
      Feedback.countDocuments({ rating: 'positive' }),
      Feedback.countDocuments({ rating: 'negative' }),
    ]);

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get recent decisions (last 7 days)
    const newDecisionsThisWeek = await Decision.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get user growth data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get decision activity data (last 30 days)
    const decisionActivity = await Decision.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get top users by decision count
    const topUsers = await Decision.aggregate([
      {
        $group: {
          _id: '$userId',
          decisionCount: { $sum: 1 },
        },
      },
      {
        $sort: { decisionCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          decisionCount: 1,
          'user.name': 1,
          'user.email': 1,
        },
      },
    ]);

    // Calculate satisfaction rate
    const satisfactionRate =
      totalFeedback > 0
        ? Math.round((positiveFeedback / totalFeedback) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      stats: {
        overview: {
          totalUsers,
          activeUsers,
          suspendedUsers,
          totalDecisions,
          totalFeedback,
          positiveFeedback,
          negativeFeedback,
          satisfactionRate,
          newUsersThisWeek,
          newDecisionsThisWeek,
        },
        userGrowth,
        decisionActivity,
        topUsers,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}