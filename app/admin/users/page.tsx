'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminNavbar from '@/components/AdminNavbar';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;
  isSuspended?: boolean;
  suspendedReason?: string;
  decisionCount: number;
  feedbackCount: number;
}

export default function UsersManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userStatus, setUserStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'decisions' | 'date'>('date');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && !(session?.user as any)?.isAdmin) {
      router.push('/dashboard');
    } else if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?search=${searchQuery}&status=${userStatus}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: action !== 'delete' ? JSON.stringify({ action, suspendedReason: reason }) : undefined,
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `User ${action}ed successfully` });
        fetchUsers();
        setSelectedUser(null);
        setSuspendReason('');
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'email':
        return a.email.localeCompare(b.email);
      case 'decisions':
        return b.decisionCount - a.decisionCount;
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AdminNavbar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
                User Management
              </h1>
              <p className="text-gray-400">Manage all users in the system</p>
            </div>
            <Link href="/admin/create-user">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium shadow-lg"
              >
                ➕ Create New User
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-slate-800/80 border border-white/10 rounded-2xl p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-2 px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500"
            />
            <select
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="admin">Admins</option>
            </select>
            <button
              onClick={fetchUsers}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:shadow-lg font-medium"
            >
              🔍 Search
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-gray-400 text-sm">Sort by:</span>
            {[
              { value: 'date', label: 'Date' },
              { value: 'name', label: 'Name' },
              { value: 'email', label: 'Email' },
              { value: 'decisions', label: 'Activity' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as any)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  sortBy === option.value
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-700/50 text-gray-400 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Users', value: users.length, icon: '👥', color: 'blue' },
            { label: 'Active', value: users.filter((u) => !u.isSuspended).length, icon: '✅', color: 'green' },
            { label: 'Suspended', value: users.filter((u) => u.isSuspended).length, icon: '🚫', color: 'red' },
            { label: 'Admins', value: users.filter((u) => u.isAdmin).length, icon: '🔐', color: 'purple' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-xl bg-slate-800/80 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {sortedUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="backdrop-blur-xl bg-slate-800/80 border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{user.name}</h3>
                    {user.isAdmin && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30">
                        👑 Admin
                      </span>
                    )}
                    {user.isSuspended && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30">
                        🚫 Suspended
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">📧 {user.email}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>🎯 {user.decisionCount} decisions</span>
                    <span>💭 {user.feedbackCount} feedback</span>
                    <span>📅 Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  {user.isSuspended && user.suspendedReason && (
                    <p className="text-red-400 text-sm mt-2 p-2 bg-red-500/10 rounded-lg">
                      Reason: {user.suspendedReason}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!user.isSuspended ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedUser(user)}
                      className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 border border-yellow-500/30"
                    >
                      🚫 Suspend
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUserAction(user._id, 'unsuspend')}
                      className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 border border-green-500/30"
                    >
                      ✅ Unsuspend
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
                        handleUserAction(user._id, 'delete');
                      }
                    }}
                    className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 border border-red-500/30"
                  >
                    🗑️ Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {sortedUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-xl">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Suspend User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="backdrop-blur-xl bg-slate-800/95 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-4">⚠️ Suspend User</h3>
            <p className="text-gray-400 mb-4">
              You are about to suspend <strong className="text-white">{selectedUser.name}</strong>. This will prevent them from accessing the system.
            </p>
            <textarea
              placeholder="Reason for suspension (required)..."
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 mb-4"
              rows={4}
              required
            />
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!suspendReason.trim()) {
                    setMessage({ type: 'error', text: 'Please provide a reason for suspension' });
                    return;
                  }
                  handleUserAction(selectedUser._id, 'suspend', suspendReason);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:shadow-lg font-medium"
              >
                Suspend User
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedUser(null);
                  setSuspendReason('');
                }}
                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 font-medium"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}