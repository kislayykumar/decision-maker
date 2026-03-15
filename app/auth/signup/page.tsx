'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const result = await signIn('credentials', {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push('/dashboard');
          router.refresh();
        }
      } else {
        setError(data.message || 'Failed to create account');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden flex items-center justify-center py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="max-w-md w-full mx-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/50"
          >
            <span className="text-4xl">✨</span>
          </motion.div>

          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Create Account
          </h1>
          <p className="text-gray-400 font-medium">Start making smarter decisions today</p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 relative group"
            >
              <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl" />
              <div className="relative backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign Up Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-all"
                    placeholder="John Doe"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-2 flex items-center space-x-2">
                  <span className="text-cyan-400">📧</span>
                  <span>Email Address</span>
                </label>
                <div className="relative group/input">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                    placeholder="your@email.com"
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
                </label>
                <div className="relative group/input">
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all"
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
                </label>
                <div className="relative group/input">
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-all"
                    placeholder="Re-enter your password"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>

              {/* Sign Up Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all relative overflow-hidden group/button"
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">✨</span>
                      <span>Create Account</span>
                    </>
                  )}
                </span>
              </motion.button>

              {/* Divider */}
              <div className="relative flex items-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Google Sign In */}
              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-slate-900/50 border border-white/10 text-white font-bold rounded-xl hover:bg-slate-800/50 hover:border-white/20 transition-all relative overflow-hidden group/google"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover/google:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </span>
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Sign In Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-center"
        >
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors inline-flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}