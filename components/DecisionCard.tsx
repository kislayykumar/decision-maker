'use client';

interface DecisionCardProps {
  decision: {
    _id: string;
    title: string;
    createdAt: string;
    options: Array<{
      optionName: string;
      tags: string[];
    }>;
    feedback?: {
      optionChosen: string;
      rating: string;
    } | null;
  };
  onSelect: (decisionId: string) => void;
}

export default function DecisionCard({ decision, onSelect }: DecisionCardProps) {
  const formattedDate = new Date(decision.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {decision.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{formattedDate}</p>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Options ({decision.options.length}):
        </p>
        <div className="flex flex-wrap gap-2">
          {decision.options.map((option, idx) => (
            <span
              key={idx}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
            >
              {option.optionName}
            </span>
          ))}
        </div>
      </div>

      {decision.feedback && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Chosen:</span> {decision.feedback.optionChosen}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Rating:</span>{' '}
            <span
              className={
                decision.feedback.rating === 'positive'
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {decision.feedback.rating}
            </span>
          </p>
        </div>
      )}

      <button
        onClick={() => onSelect(decision._id)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        View Details
      </button>
    </div>
  );
}