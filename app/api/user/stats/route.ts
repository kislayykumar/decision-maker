import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Decision from '@/models/Decision';
import Feedback from '@/models/Feedback';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get total decisions
    const totalDecisions = await Decision.countDocuments({ userId: user._id });

    // Get decisions this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const decisionsThisWeek = await Decision.countDocuments({
      userId: user._id,
      createdAt: { $gte: oneWeekAgo },
    });

    // Get decisions this month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const decisionsThisMonth = await Decision.countDocuments({
      userId: user._id,
      createdAt: { $gte: oneMonthAgo },
    });

    // Get feedback stats
    const totalFeedback = await Feedback.countDocuments({ userId: user._id });
    const positiveFeedback = await Feedback.countDocuments({
      userId: user._id,
      rating: 'positive',
    });
    const negativeFeedback = await Feedback.countDocuments({
      userId: user._id,
      rating: 'negative',
    });

    // Get recent decisions
    const recentDecisions = await Decision.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Calculate satisfaction rate
    const satisfactionRate = totalFeedback > 0 
      ? Math.round((positiveFeedback / totalFeedback) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalDecisions,
        decisionsThisWeek,
        decisionsThisMonth,
        totalFeedback,
        positiveFeedback,
        negativeFeedback,
        satisfactionRate,
        recentDecisions: recentDecisions.map(d => ({
          id: d._id,
          title: d.title,
          createdAt: d.createdAt,
        })),
        memberSince: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}