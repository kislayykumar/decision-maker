'use client';

import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuestionFormProps {
  onSubmit: (answers: Array<{ question: string; answer: string }>) => void;
}

const questions: Question[] = [
  {
    id: 'time',
    question: 'How much time do you have?',
    options: ['10 minutes', '30 minutes', '1 hour'],
  },
  {
    id: 'energy',
    question: 'What is your energy level?',
    options: ['Low', 'Medium', 'High'],
  },
  {
    id: 'goal',
    question: 'What is your goal?',
    options: ['Relax', 'Be productive', 'Learn something'],
  },
];

export default function QuestionForm({ onSubmit }: QuestionFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswer = (answer: string) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer,
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const formattedAnswers = Object.entries(newAnswers).map(([question, answer]) => ({
        question,
        answer,
      }));
      onSubmit(formattedAnswers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {questions[currentQuestion].question}
        </h2>

        <div className="space-y-4">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full bg-indigo-50 hover:bg-indigo-100 text-gray-800 font-medium py-4 px-6 rounded-lg transition-colors text-left border-2 border-transparent hover:border-indigo-600"
            >
              {option}
            </button>
          ))}
        </div>

        {currentQuestion > 0 && (
          <button
            onClick={handleBack}
            className="mt-6 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}