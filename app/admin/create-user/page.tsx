'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '@/components/AdminNavbar';

export default function CreateUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && !(session?.user as any)?.isAdmin) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isAdmin: formData.isAdmin,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'User created successfully!' });
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          isAdmin: false,
        });
        
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create user' });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'An error occurred' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 blur-3xl -z-10" />
          
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </motion.div>
            
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Create New User
              </h1>
              <div className="flex items-center space-x-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                <p className="text-gray-400 font-medium">Add a new user to the system</p>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
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
              className="mb-6 relative group"
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

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:opacity-80 transition-opacity" />
          
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-white mb-2 flex items-center space-x-2">
                  <span className="text-emerald-400">👤</span>
                  <span>Full Name</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                    placeholder="Enter user's full name"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-2 flex items-center space-x-2">
                  <span className="text-cyan-400">📧</span>
                  <span>Email Address</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group/input">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                    placeholder="user@example.com"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-white mb-2 flex items-center space-x-2">
                  <span className="text-purple-400">🔒</span>
                  <span>Password</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group/input">
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-2 flex items-center space-x-2">
                  <span className="text-pink-400">🔐</span>
                  <span>Confirm Password</span>
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative group/input">
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                    placeholder="Re-enter password"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* Admin Checkbox */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative group/checkbox"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-xl blur opacity-0 group-hover/checkbox:opacity-100 transition-opacity" />
                
                <div className="relative flex items-center space-x-4 p-5 bg-slate-900/30 rounded-xl border border-white/10 group-hover/checkbox:border-white/20 transition-all">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                    className="w-6 h-6 rounded-lg border-white/20 bg-slate-700 text-yellow-500 focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                  />
                  <label htmlFor="isAdmin" className="text-white font-bold cursor-pointer flex items-center space-x-2">
                    <span className="text-xl">⚡</span>
                    <span>Grant Administrator Privileges</span>
                  </label>
                </div>
              </motion.div>

              {/* Admin Warning */}
              <AnimatePresence>
                {formData.isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="relative group/warning"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl" />
                    
                    <div className="relative p-5 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">⚠️</span>
                        </div>
                        <div>
                          <p className="text-red-400 font-bold mb-1">Security Warning</p>
                          <p className="text-gray-300 text-sm">
                            This user will have full administrative access including the ability to manage users, view all data, and change system settings. Grant this privilege carefully.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group/button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover/button:translate-x-[200%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center space-x-2">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Creating User...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">✓</span>
                        <span>Create User</span>
                      </>
                    )}
                  </span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => router.push('/admin')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-slate-700/50 text-white font-bold rounded-xl hover:bg-slate-600/50 transition-all border border-white/10"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl" />
          
          <div className="relative backdrop-blur-xl bg-slate-900/30 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📋</span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-3 text-lg">User Creation Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start space-x-2">
                    <span className="text-cyan-400 text-lg">•</span>
                    <p className="text-gray-400 text-sm">User receives credentials via platform</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-400 text-lg">•</span>
                    <p className="text-gray-400 text-sm">Password changeable after first login</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-purple-400 text-lg">•</span>
                    <p className="text-gray-400 text-sm">Email must be unique in system</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-pink-400 text-lg">•</span>
                    <p className="text-gray-400 text-sm">Admins have full system access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}