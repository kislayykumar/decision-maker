'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Decision {
  _id: string;
  title: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, thisMonth: 0 });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      // Fetch stats from the stats API
      const statsRes = await fetch('/api/user/stats');
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStats({
          total: statsData.stats.totalDecisions,
          thisWeek: statsData.stats.decisionsThisWeek,
          thisMonth: statsData.stats.decisionsThisMonth,
        });
        
        // Set only the latest 3 decisions from recent decisions
        if (statsData.stats.recentDecisions) {
          const recentDecisions = statsData.stats.recentDecisions.slice(0, 3).map((d: any) => ({
            _id: d.id,
            title: d.title,
            createdAt: d.createdAt,
          }));
          setDecisions(recentDecisions);
        }
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
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };

  const statCards = [
    {
      label: 'Total Decisions',
      value: stats.total,
      icon: '📊',
      color: 'from-blue-500 to-cyan-500',
      delay: 0,
    },
    {
      label: 'This Week',
      value: stats.thisWeek,
      icon: '📅',
      color: 'from-purple-500 to-pink-500',
      delay: 0.1,
    },
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: '📈',
      color: 'from-orange-500 to-red-500',
      delay: 0.2,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome back,
            </span>
            <br />
            <span className="text-white">{session?.user?.name || 'Friend'}! 👋</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300"
          >
            Ready to make your next smart decision?
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-all duration-300`} />
              <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: stat.delay,
                    }}
                    className="text-4xl"
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 200,
                      delay: stat.delay + 0.2,
                    }}
                    className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </motion.div>
                </div>
                <p className="text-gray-300 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/decision/create')}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-all" />
              <div className="relative backdrop-blur-md bg-gradient-to-r from-indigo-500/80 to-purple-600/80 border border-white/20 rounded-2xl p-8 hover:border-white/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-4xl"
                  >
                    ✨
                  </motion.div>
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-3xl"
                  >
                    →
                  </motion.span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">New Decision</h3>
                <p className="text-white/80">Create a new decision and get AI-powered recommendations</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/history')}
              className="group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-all" />
              <div className="relative backdrop-blur-md bg-gradient-to-r from-pink-500/80 to-orange-500/80 border border-white/20 rounded-2xl p-8 hover:border-white/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-4xl"
                  >
                    📜
                  </motion.div>
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-3xl"
                  >
                    →
                  </motion.span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">View History</h3>
                <p className="text-white/80">Review your past decisions and their outcomes</p>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Decisions */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Recent Decisions</h2>
            {decisions.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/history')}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2"
              >
                View All
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {decisions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="text-6xl mb-4"
                >
                  🎯
                </motion.div>
                <p className="text-2xl text-gray-300 mb-4">No decisions yet</p>
                <p className="text-gray-400 mb-6">Start making smarter choices today!</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/decision/create')}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                >
                  Create Your First Decision
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {decisions.map((decision, index) => (
                  <motion.div
                    key={decision._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative cursor-pointer"
                    onClick={() => router.push(`/decision/result?id=${decision._id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-300" />
                    <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                          💡
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(decision.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold mb-2 line-clamp-2">
                        {decision.title}
                      </h3>
                      <motion.div
                        className="text-indigo-400 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View Details
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}