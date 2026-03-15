'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import QuestionForm from '@/components/QuestionForm';

export default function QuestionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const decisionId = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (!decisionId) {
      router.push('/dashboard');
    }
  }, [status, decisionId, router]);

  const handleSubmit = async (answers: Array<{ question: string; answer: string }>) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/decisions/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId, answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      // Store the result and navigate to results page
      sessionStorage.setItem('decisionResult', JSON.stringify({
        result: data.result,
        decisionId,
      }));
      router.push('/decision/result');
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading' || !decisionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Answer a Few Questions
          </h1>
          <p className="text-gray-600">
            This helps us recommend the best option for your situation
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Analyzing your answers...</p>
            </div>
          </div>
        ) : (
          <QuestionForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}