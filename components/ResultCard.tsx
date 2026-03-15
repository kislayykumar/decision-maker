'use client';

interface ResultCardProps {
  result: {
    recommended_option: string;
    confidence_score: number;
    reason: string;
  };
  onFeedback: (rating: 'positive' | 'negative') => void;
  onNewDecision: () => void;
}

export default function ResultCard({ result, onFeedback, onNewDecision }: ResultCardProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Our Recommendation
          </h2>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-indigo-900 mb-4 text-center">
            {result.recommended_option}
          </h3>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600">
                {result.confidence_score}%
              </div>
              <div className="text-sm text-gray-600">Confidence Score</div>
            </div>
          </div>
          <p className="text-gray-700 text-center">{result.reason}</p>
        </div>

        <div className="mb-6">
          <p className="text-center text-gray-700 font-medium mb-4">
            Was this recommendation helpful?
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onFeedback('positive')}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              Yes, helpful
            </button>
            <button
              onClick={() => onFeedback('negative')}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                />
              </svg>
              Not helpful
            </button>
          </div>
        </div>

        <button
          onClick={onNewDecision}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Make Another Decision
        </button>
      </div>
    </div>
  );
}