'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  preferences: {
    defaultEnergyLevel?: string;
    defaultGoal?: string;
    defaultTimeAvailable?: string;
    interests?: string[];
    lifestyle?: string;
    workSchedule?: string;
  };
}

const INTERESTS = [
  'Technology', 'Sports', 'Arts', 'Music', 'Reading', 'Travel',
  'Cooking', 'Fitness', 'Gaming', 'Photography', 'Writing', 'Learning'
];

const LIFESTYLE_OPTIONS = ['Active', 'Balanced', 'Relaxed', 'Busy Professional'];
const WORK_SCHEDULE_OPTIONS = ['9-5 Traditional', 'Flexible', 'Remote', 'Shift Work', 'Freelance'];

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile data
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  
  // Preferences
  const [defaultEnergyLevel, setDefaultEnergyLevel] = useState('');
  const [defaultGoal, setDefaultGoal] = useState('');
  const [defaultTimeAvailable, setDefaultTimeAvailable] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState('');
  const [workSchedule, setWorkSchedule] = useState('');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (session?.user) {
      fetchUserProfile();
    }
  }, [status, session, router]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.success) {
        setName(data.user.name || '');
        setBio(data.user.bio || '');
        setDefaultEnergyLevel(data.user.preferences?.defaultEnergyLevel || '');
        setDefaultGoal(data.user.preferences?.defaultGoal || '');
        setDefaultTimeAvailable(data.user.preferences?.defaultTimeAvailable || '');
        setInterests(data.user.preferences?.interests || []);
        setLifestyle(data.user.preferences?.lifestyle || '');
        setWorkSchedule(data.user.preferences?.workSchedule || '');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Profile updated successfully!');
        await update({ name }); // Update session
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            defaultEnergyLevel,
            defaultGoal,
            defaultTimeAvailable,
            interests,
            lifestyle,
            workSchedule,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Preferences updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update preferences');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Profile Settings
            </span>
          </motion.h1>
          <p className="text-xl text-gray-300">
            Manage your account and preferences 🎯
          </p>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-200 rounded-xl"
            >
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-2 mb-8">
          <div className="flex gap-2">
            {[
              { id: 'profile', label: 'Profile', icon: '👤' },
              { id: 'preferences', label: 'Preferences', icon: '⚙️' },
              { id: 'security', label: 'Security', icon: '🔒' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={session?.user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-2">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 font-semibold"
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">Decision Preferences</h2>
                <p className="text-gray-400 mb-6">
                  These preferences help AI provide better recommendations
                </p>

                <div className="space-y-6">
                  {/* Default Energy Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Default Energy Level
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Low', 'Medium', 'High'].map((level) => (
                        <motion.button
                          key={level}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDefaultEnergyLevel(level)}
                          className={`py-3 px-4 rounded-xl font-medium transition-all ${
                            defaultEnergyLevel === level
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {level}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Default Goal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Default Goal
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Relax', 'Be productive', 'Learn something'].map((goal) => (
                        <motion.button
                          key={goal}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDefaultGoal(goal)}
                          className={`py-3 px-4 rounded-xl font-medium transition-all ${
                            defaultGoal === goal
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {goal}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Default Time Available */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Default Time Available
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['10 minutes', '30 minutes', '1 hour'].map((time) => (
                        <motion.button
                          key={time}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDefaultTimeAvailable(time)}
                          className={`py-3 px-4 rounded-xl font-medium transition-all ${
                            defaultTimeAvailable === time
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Interests (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {INTERESTS.map((interest) => (
                        <motion.button
                          key={interest}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleInterest(interest)}
                          className={`py-3 px-4 rounded-xl font-medium transition-all ${
                            interests.includes(interest)
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {interest}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Lifestyle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Lifestyle
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {LIFESTYLE_OPTIONS.map((option) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setLifestyle(option)}
                          className={`py-3 px-4 rounded-xl font-medium transition-all ${
                            lifestyle === option
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Work Schedule */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Work Schedule
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {WORK_SCHEDULE_OPTIONS.map((option) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setWorkSchedule(option)}
                          className={`py-3 px-4 rounded-xl font-medium transition-all ${
                            workSchedule === option
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdatePreferences}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 font-semibold"
                  >
                    {loading ? 'Saving...' : 'Save Preferences'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <p className="text-yellow-200 text-sm">
                      ⚠️ Password must be at least 6 characters long
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdatePassword}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 font-semibold"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}