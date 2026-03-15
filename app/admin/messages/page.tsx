'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNavbar from '@/components/AdminNavbar';

interface Message {
  _id: string;
  userEmail: string;
  userName: string;
  message: string;
  suspensionReason: string;
  createdAt: string;
  status: string;
}

interface GroupedMessages {
  userEmail: string;
  userName: string;
  messages: Message[];
  latestMessageDate: Date;
  isSuspended: boolean;
  userId?: string;
}

export default function AdminMessages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<GroupedMessages | null>(null);
  const [activatingUsers, setActivatingUsers] = useState<Set<string>>(new Set());
  const [deletingMessage, setDeletingMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && !(session?.user as any)?.isAdmin) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMessages();
    }
  }, [status]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const [messagesRes, usersRes] = await Promise.all([
        fetch('/api/admin/messages'),
        fetch('/api/admin/users'),
      ]);

      const messagesData = await messagesRes.json();
      const usersData = await usersRes.json();

      if (messagesData.success && usersData.success) {
        const messages: Message[] = messagesData.messages || [];
        const users = usersData.users || [];

        const grouped = messages.reduce((acc: { [key: string]: GroupedMessages }, message) => {
          if (!acc[message.userEmail]) {
            const user = users.find((u: any) => u.email === message.userEmail);
            acc[message.userEmail] = {
              userEmail: message.userEmail,
              userName: message.userName,
              messages: [],
              latestMessageDate: new Date(message.createdAt),
              isSuspended: user?.isSuspended || false,
              userId: user?._id,
            };
          }
          acc[message.userEmail].messages.push(message);
          
          const messageDate = new Date(message.createdAt);
          if (messageDate > acc[message.userEmail].latestMessageDate) {
            acc[message.userEmail].latestMessageDate = messageDate;
          }
          
          return acc;
        }, {});

        const groupedArray = Object.values(grouped).sort(
          (a, b) => b.latestMessageDate.getTime() - a.latestMessageDate.getTime()
        );

        groupedArray.forEach(group => {
          group.messages.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setGroupedMessages(groupedArray);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string, userEmail: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      setDeletingMessage(messageId);
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGroupedMessages(prev =>
          prev.map(group => {
            if (group.userEmail === userEmail) {
              const updatedMessages = group.messages.filter(m => m._id !== messageId);
              if (updatedMessages.length === 0) {
                return null;
              }
              return {
                ...group,
                messages: updatedMessages,
              };
            }
            return group;
          }).filter(Boolean) as GroupedMessages[]
        );

        // Update selected user if modal is open
        if (selectedUser && selectedUser.userEmail === userEmail) {
          const updatedMessages = selectedUser.messages.filter(m => m._id !== messageId);
          if (updatedMessages.length === 0) {
            setSelectedUser(null);
          } else {
            setSelectedUser({ ...selectedUser, messages: updatedMessages });
          }
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } finally {
      setDeletingMessage(null);
    }
  };

  const handleActivateUsers = async (userIds: (string | undefined)[]) => {
    const validUserIds = userIds.filter((id): id is string => !!id);
    if (validUserIds.length === 0) {
      alert('No users to activate');
      return;
    }

    const count = validUserIds.length;
    if (!confirm(`Are you sure you want to activate ${count} user${count > 1 ? 's' : ''}?`)) return;

    try {
      setActivatingUsers(new Set(validUserIds));
      
      const results = await Promise.all(
        validUserIds.map(userId =>
          fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'unsuspend' }),
          })
        )
      );

      const allSuccessful = results.every(r => r.ok);
      
      if (allSuccessful) {
        setGroupedMessages(prev =>
          prev.map(group => {
            if (group.userId && validUserIds.includes(group.userId)) {
              return { ...group, isSuspended: false };
            }
            return group;
          })
        );
        alert(`Successfully activated ${count} user${count > 1 ? 's' : ''}!`);
      } else {
        alert('Some users could not be activated');
      }
    } catch (error) {
      console.error('Error activating users:', error);
      alert('Failed to activate users');
    } finally {
      setActivatingUsers(new Set());
    }
  };

  const suspendedUsers = groupedMessages.filter(g => g.isSuspended);

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
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </motion.div>
              
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Message Center
                </h1>
                <div className="flex items-center space-x-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  <p className="text-gray-400 font-medium">
                    {groupedMessages.length} Conversation{groupedMessages.length !== 1 ? 's' : ''}
                  </p>
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                </div>
              </div>
            </div>

            {/* Bulk Activate Button */}
            {suspendedUsers.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActivateUsers(suspendedUsers.map(u => u.userId))}
                disabled={activatingUsers.size > 0}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 border-2 border-emerald-400/30 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                {activatingUsers.size > 0 ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Activating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Activate All ({suspendedUsers.length})</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>

        {groupedMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
            <div className="relative backdrop-blur-2xl bg-slate-900/30 border border-white/10 rounded-3xl p-16 text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">No Messages Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto">Your message center is empty. New messages from suspended users will appear here.</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {groupedMessages.map((group, index) => (
                <motion.div
                  key={group.userEmail}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
                  onClick={() => setSelectedUser(group)}
                  className="relative group cursor-pointer"
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
                              {group.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">
                            {group.userName}
                          </h3>
                          <p className="text-cyan-400 text-sm truncate font-medium mb-2">{group.userEmail}</p>
                          
                          {group.isSuspended && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="inline-block px-2 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/30"
                            >
                              🔒 SUSPENDED
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-xl border border-white/5">
                          <span className="text-xs text-gray-400">Messages</span>
                          <span className="text-sm font-bold text-cyan-400">{group.messages.length}</span>
                        </div>
                        
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/50 rounded-xl border border-white/5">
                          <span className="text-xs text-gray-400">Latest</span>
                          <span className="text-xs text-gray-500 font-mono">
                            {new Date(group.latestMessageDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="mt-4 flex items-center justify-end space-x-2 text-cyan-400 text-sm font-medium"
                      >
                        <span>View Messages</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
              
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-lg opacity-75" />
                        <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                          <span className="text-white text-2xl font-black">
                            {selectedUser.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-3xl font-black text-white mb-1">{selectedUser.userName}</h2>
                        <p className="text-cyan-400 font-medium">{selectedUser.userEmail}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-sm text-gray-400">{selectedUser.messages.length} messages</span>
                          {selectedUser.isSuspended && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="text-xs text-red-400 font-bold">SUSPENDED</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedUser(null)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                    >
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Messages List */}
                <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto">
                  {selectedUser.messages.map((message, index) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="relative group/message"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl blur-lg opacity-0 group-hover/message:opacity-100 transition-opacity" />
                      
                      <div className="relative backdrop-blur-xl bg-slate-800/30 rounded-2xl p-6 border border-white/10 group-hover/message:border-white/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                              <span className="text-xs font-bold text-orange-400 flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Reason</span>
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 font-mono">
                              {new Date(message.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-5 leading-relaxed pl-4 border-l-2 border-orange-500/30">
                          {message.suspensionReason}
                        </p>

                        <div className="mb-5">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 rounded-lg flex items-center justify-center backdrop-blur-xl border border-cyan-500/30">
                              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                            </div>
                            <span className="text-sm font-bold text-cyan-400">User Response</span>
                          </div>
                          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-4 border border-white/5">
                            <p className="text-white leading-relaxed">{message.message}</p>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-white/5">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteMessage(message._id, selectedUser.userEmail)}
                            disabled={deletingMessage === message._id}
                            className="px-4 py-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 text-red-400 text-sm font-bold rounded-lg transition-all flex items-center space-x-2 border border-red-500/30 disabled:opacity-50"
                          >
                            {deletingMessage === message._id ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full"
                              />
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}