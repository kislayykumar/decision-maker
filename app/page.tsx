'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.3), transparent 50%)`,
          }}
        />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="text-center">
            <motion.div variants={itemVariants} className="mb-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="inline-block"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                  <span className="text-4xl">🧠</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Smart Decisions,
              </span>
              <br />
              <span className="text-white">Made Simple</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              Let AI guide your daily choices with intelligent recommendations based on your{' '}
              <span className="text-indigo-400 font-semibold">time</span>,{' '}
              <span className="text-purple-400 font-semibold">energy</span>, and{' '}
              <span className="text-pink-400 font-semibold">goals</span>
            </motion.p>

            <motion.div variants={itemVariants} className="flex justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(99, 102, 241, 0.3)',
                    '0 0 60px rgba(99, 102, 241, 0.6)',
                    '0 0 20px rgba(99, 102, 241, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
              >
                <Link
                  href="/auth/signup"
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Making Better Decisions
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signin"
                  className="px-8 py-4 backdrop-blur-md bg-white/10 text-white text-lg font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 mt-32"
          >
            {[
              {
                icon: '⚡',
                title: 'Lightning Fast',
                description: 'Get instant recommendations in seconds',
                color: 'from-yellow-400 to-orange-500',
              },
              {
                icon: '🎯',
                title: 'Personalized',
                description: 'Tailored to your energy and goals',
                color: 'from-indigo-400 to-purple-500',
              },
              {
                icon: '🚀',
                title: 'Smart Engine',
                description: 'AI-powered decision algorithm',
                color: 'from-pink-400 to-red-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            {[
              { number: '10K+', label: 'Decisions Made' },
              { number: '95%', label: 'Satisfaction Rate' },
              { number: '<3s', label: 'Response Time' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2, type: 'spring' }}
                  className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}