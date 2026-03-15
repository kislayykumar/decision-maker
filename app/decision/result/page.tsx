'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultCard from '@/components/ResultCard';

export default function ResultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [decisionId, setDecisionId] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    const storedData = sessionStorage.getItem('decisionResult');
    if (storedData) {
      const data = JSON.parse(storedData);
      setResult(data.result);
      setDecisionId(data.decisionId);
    } else {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleFeedback = async (rating: 'positive' | 'negative') => {
    if (!result || !decisionId) return;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionId,
          optionChosen: result.recommended_option,
          rating,
        }),
      });

      if (response.ok) {
        setFeedbackSubmitted(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  const handleNewDecision = () => {
    sessionStorage.removeItem('decisionResult');
    router.push('/decision/create');
  };

  if (status === 'loading' || !result) {
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
        {feedbackSubmitted && (
          <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
            Thank you for your feedback! Redirecting to dashboard...
          </div>
        )}

        <ResultCard
          result={result}
          onFeedback={handleFeedback}
          onNewDecision={handleNewDecision}
        />
      </div>
    </div>
  );
}