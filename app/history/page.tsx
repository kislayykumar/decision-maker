'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DecisionCard from '@/components/DecisionCard';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [decisions, setDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchDecisions();
    }
  }, [status, router]);

  const fetchDecisions = async () => {
    try {
      const response = await fetch('/api/decisions/user');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch decisions');
        setLoading(false);
        return;
      }

      setDecisions(data.decisions);
      setLoading(false);
    } catch (err) {
      setError('An error occurred while fetching decisions');
      setLoading(false);
    }
  };

  const handleSelectDecision = (decisionId: string) => {
    // Could navigate to a detail view or restart the decision
    console.log('Selected decision:', decisionId);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Decision History
            </span>
          </h1>
          <p className="text-gray-300">
            Review your past decisions and their outcomes
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {decisions.length === 0 ? (
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
              <svg
                className="w-16 h-16 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No decisions yet
            </h2>
            <p className="text-gray-300 mb-6">
              Start by creating your first decision!
            </p>
            <button
              onClick={() => router.push('/decision/create')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/50 text-white font-medium py-3 px-8 rounded-xl transition-all"
            >
              Create Decision
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decisions.map((decision) => (
              <DecisionCard
                key={decision._id}
                decision={decision}
                onSelect={handleSelectDecision}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}