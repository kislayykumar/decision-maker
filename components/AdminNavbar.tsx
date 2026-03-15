'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/users', label: 'User Management', icon: '👥' },
    { href: '/admin/messages', label: 'Messages', icon: '💬' },
  ];

  return (
    <nav className="border-b border-white/10 backdrop-blur-xl bg-slate-900/80 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            </motion.div>
          </Link>

          {/* Admin Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Admin Profile & Sign Out */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-red-400">Administrator</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 border border-red-500/30 font-medium transition-all"
            >
              Sign Out
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 flex flex-wrap gap-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white'
                      : 'text-gray-300 bg-slate-800/50'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}