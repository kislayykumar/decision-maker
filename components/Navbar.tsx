'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (!session) {
    return (
      <nav className="bg-slate-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">SD</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Smart Decision
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-300 hover:text-indigo-400 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/decision/create', label: 'New Decision', icon: '✨' },
    { href: '/history', label: 'History', icon: '📜' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">SD</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">
              Smart Decision
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {session.user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-gray-200 font-medium">{session.user?.name}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl border border-white/10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{session.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                  </div>
                  
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile Settings
                  </Link>

                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-white/10 pt-2 mt-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-4 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile Settings
                </Link>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center w-full px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}