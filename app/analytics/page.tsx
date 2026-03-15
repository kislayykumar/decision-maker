'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Stats {
  totalDecisions: number;
  decisionsThisWeek: number;
  decisionsThisMonth: number;
  totalFeedback: number;
  positiveFeedback: number;
  negativeFeedback: number;
  satisfactionRate: number;
  recentDecisions: Array<{
    id: string;
    title: string;
    createdAt: string;
  }>;
  memberSince: string;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/user/stats');
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-gray-300">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </h1>
            <p className="text-gray-300">Track your decision-making patterns and insights</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Decisions */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Decisions</p>
                  <p className="text-3xl font-bold text-purple-400 mt-2">{stats.totalDecisions}</p>
                </div>
                <div className="bg-purple-500/20 rounded-full p-3">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* This Week */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">This Week</p>
                  <p className="text-3xl font-bold text-blue-400 mt-2">{stats.decisionsThisWeek}</p>
                </div>
                <div className="bg-blue-500/20 rounded-full p-3">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* This Month */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold text-green-400 mt-2">{stats.decisionsThisMonth}</p>
                </div>
                <div className="bg-green-500/20 rounded-full p-3">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Satisfaction Rate */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Satisfaction</p>
                  <p className="text-3xl font-bold text-yellow-400 mt-2">{stats.satisfactionRate}%</p>
                </div>
                <div className="bg-yellow-500/20 rounded-full p-3">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Feedback Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Feedback</span>
                  <span className="font-semibold text-white">{stats.totalFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400">👍 Positive</span>
                  <span className="font-semibold text-green-400">{stats.positiveFeedback}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-400">👎 Negative</span>
                  <span className="font-semibold text-red-400">{stats.negativeFeedback}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Positive Rate</span>
                    <span className="text-sm font-semibold text-white">{stats.satisfactionRate}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stats.satisfactionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Decisions</h2>
              {stats.recentDecisions.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentDecisions.map((decision) => (
                    <div key={decision.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-white">{decision.title}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(decision.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No recent decisions</p>
              )}
            </div>
          </div>

          {/* Member Info */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
            <div className="flex items-center space-x-2 text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Member since {new Date(stats.memberSince).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
  );
}