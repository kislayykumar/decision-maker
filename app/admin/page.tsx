'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '@/components/AdminNavbar';

interface Stats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    suspendedUsers: number;
    totalDecisions: number;
    totalFeedback: number;
    positiveFeedback: number;
    negativeFeedback: number;
    satisfactionRate: number;
    newUsersThisWeek: number;
    newDecisionsThisWeek: number;
  };
  userGrowth: Array<{ _id: string; count: number }>;
  decisionActivity: Array<{ _id: string; count: number }>;
  topUsers: Array<{
    _id: string;
    decisionCount: number;
    user: { name: string; email: string };
  }>;
}

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isSuspended?: boolean;
  suspendedReason?: string;
  decisionCount: number;
  feedbackCount: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [userStatus, setUserStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && !(session?.user as any)?.isAdmin) {
      router.push('/dashboard');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch(`/api/admin/users?search=${searchQuery}&status=${userStatus}`),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    try {
      setActionLoading(userId);
      
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: action !== 'delete' ? JSON.stringify({ action, suspendedReason: reason }) : undefined,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `User ${action}ed successfully` });
        await fetchData();
        setSelectedUser(null);
        setSuspendReason('');
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Action failed' });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setActionLoading(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000" />
        </div>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full relative z-10"
          style={{ boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
          
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.div>
            
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <div className="flex items-center space-x-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <p className="text-gray-400 font-medium">System Management & Analytics</p>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Message Alert */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`mb-6 relative group`}
            >
              <div className={`absolute inset-0 ${
                message.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
              } rounded-2xl blur-xl`} />
              
              <div className={`relative backdrop-blur-xl border rounded-2xl p-5 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center space-x-3">
                  {message.type === 'success' ? (
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <p className={`font-medium ${message.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {message.text}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-4 rounded-2xl font-bold transition-all relative overflow-hidden group ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/50'
                  : 'backdrop-blur-xl bg-slate-800/50 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              <span className="relative flex items-center space-x-2">
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </motion.button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats.overview.totalUsers, icon: '👥', color: 'from-cyan-500 to-blue-600', glow: 'cyan' },
                { label: 'Active Users', value: stats.overview.activeUsers, icon: '✅', color: 'from-emerald-500 to-green-600', glow: 'emerald' },
                { label: 'Total Decisions', value: stats.overview.totalDecisions, icon: '🎯', color: 'from-purple-500 to-pink-600', glow: 'purple' },
                { label: 'Satisfaction Rate', value: `${stats.overview.satisfactionRate}%`, icon: '😊', color: 'from-yellow-500 to-orange-600', glow: 'yellow' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 rounded-3xl blur-xl group-hover:opacity-30 transition-opacity`} />
                  
                  <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 border border-white/10 rounded-3xl p-6 group-hover:border-white/20 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <motion.span 
                          className="text-5xl"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {stat.icon}
                        </motion.span>
                        <div className={`px-4 py-2 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                          <span className="text-2xl font-black text-white">{stat.value}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 font-medium">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span className="text-2xl">📈</span>
                    <span>Recent Activity</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5">
                      <span className="text-gray-400">New Users This Week</span>
                      <span className="text-cyan-400 font-bold text-lg">{stats.overview.newUsersThisWeek}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5">
                      <span className="text-gray-400">New Decisions This Week</span>
                      <span className="text-purple-400 font-bold text-lg">{stats.overview.newDecisionsThisWeek}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-3xl blur-xl" />
                
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <span className="text-2xl">💬</span>
                    <span>Feedback Statistics</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5">
                      <span className="text-gray-400">Positive Feedback</span>
                      <span className="text-emerald-400 font-bold text-lg">{stats.overview.positiveFeedback}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5">
                      <span className="text-gray-400">Negative Feedback</span>
                      <span className="text-red-400 font-bold text-lg">{stats.overview.negativeFeedback}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Top Users */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-xl" />
              
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 border border-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center space-x-3">
                  <span className="text-3xl">🏆</span>
                  <span>Top Users</span>
                </h3>
                <div className="space-y-4">
                  {stats.topUsers.slice(0, 5).map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="relative group/item"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      
                      <div className="relative flex items-center justify-between p-4 bg-slate-900/30 rounded-xl border border-white/5 group-hover/item:border-white/10 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                            index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                            'bg-slate-700/50 text-gray-400'
                          }`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="text-white font-bold">{user.user.name}</p>
                            <p className="text-cyan-400 text-sm">{user.user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {user.decisionCount}
                          </p>
                          <p className="text-xs text-gray-500">decisions</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur-xl" />
              
              <div className="relative backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-2xl p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                    />
                  </div>
                  <select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                    className="px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="active">✅ Active</option>
                    <option value="suspended">🚫 Suspended</option>
                  </select>
                  <motion.button
                    onClick={fetchData}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all"
                  >
                    Search
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Users Grid */}
            {users.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
                <div className="relative backdrop-blur-2xl bg-slate-900/30 border border-white/10 rounded-3xl p-16 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-block mb-6"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                      <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Users Found</h3>
                  <p className="text-gray-400">Try adjusting your search filters</p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {users.map((user, index) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl group-hover:border-white/20 transition-all h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        
                        <div className="p-6 relative z-10">
                          <div className="flex items-start space-x-4 mb-4">
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: 5 }}
                              className="relative flex-shrink-0"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-md opacity-75" />
                              <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                                <span className="text-white text-xl font-black">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white mb-1 truncate">
                                {user.name}
                              </h3>
                              <p className="text-cyan-400 text-sm truncate font-medium mb-2">{user.email}</p>
                              
                              {user.isSuspended ? (
                                <div>
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="inline-block px-2 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/30 mb-2"
                                  >
                                    🔒 SUSPENDED
                                  </motion.span>
                                  {user.suspendedReason && (
                                    <p className="text-xs text-gray-500 line-clamp-2">{user.suspendedReason}</p>
                                  )}
                                </div>
                              ) : (
                                <span className="inline-block px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/30">
                                  ✅ ACTIVE
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3 mt-4">
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-xl border border-white/5">
                              <span className="text-xs text-gray-400">Decisions</span>
                              <span className="text-sm font-bold text-cyan-400">{user.decisionCount}</span>
                            </div>
                            
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-xl border border-white/5">
                              <span className="text-xs text-gray-400">Feedback</span>
                              <span className="text-sm font-bold text-purple-400">{user.feedbackCount}</span>
                            </div>
                            
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-xl border border-white/5">
                              <span className="text-xs text-gray-400">Joined</span>
                              <span className="text-xs text-gray-500 font-mono">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                            {!user.isSuspended ? (
                              <motion.button
                                onClick={() => setSelectedUser(user)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={actionLoading === user._id}
                                className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-400 rounded-xl text-sm font-bold transition-all border border-red-500/30 disabled:opacity-50"
                              >
                                Suspend
                              </motion.button>
                            ) : (
                              <motion.button
                                onClick={() => handleUserAction(user._id, 'unsuspend')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={actionLoading === user._id}
                                className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 text-emerald-400 rounded-xl text-sm font-bold transition-all border border-emerald-500/30 disabled:opacity-50"
                              >
                                {actionLoading === user._id ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto"
                                  />
                                ) : (
                                  'Activate'
                                )}
                              </motion.button>
                            )}
                            <motion.button
                              onClick={() => {
                                if (confirm(`Delete ${user.name}? This cannot be undone.`)) {
                                  handleUserAction(user._id, 'delete');
                                }
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={actionLoading === user._id}
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:shadow-xl hover:shadow-red-500/50 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                            >
                              {actionLoading === user._id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"
                                />
                              ) : (
                                'Delete'
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Suspend User Modal */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedUser(null);
                setSuspendReason('');
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-pink-500/30 to-orange-500/30 rounded-3xl blur-2xl" />
                
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-red-500/30 rounded-3xl shadow-2xl p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-2">Suspend User</h3>
                      <p className="text-gray-400">
                        Suspending <span className="text-white font-bold">{selectedUser.name}</span>
                      </p>
                    </div>
                  </div>
                  
                  <textarea
                    placeholder="Provide a reason for suspension..."
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-all mb-6 resize-none"
                    rows={4}
                  />
                  
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => handleUserAction(selectedUser._id, 'suspend', suspendReason)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!suspendReason || actionLoading === selectedUser._id}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === selectedUser._id ? 'Suspending...' : 'Confirm Suspend'}
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setSelectedUser(null);
                        setSuspendReason('');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-6 py-3 bg-slate-700/50 text-white font-bold rounded-xl hover:bg-slate-600/50 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}