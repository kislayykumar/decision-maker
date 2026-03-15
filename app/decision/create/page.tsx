'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Preset decision templates
const DECISION_TEMPLATES = [
  {
    title: 'What should I do this evening?',
    options: [
      { name: 'Watch a movie', tags: ['relaxing', 'quick', 'entertainment'] },
      { name: 'Read a book', tags: ['relaxing', 'educational', 'quiet'] },
      { name: 'Go for a walk', tags: ['healthy', 'quick', 'energizing'] },
      { name: 'Work on a project', tags: ['productive', 'challenging', 'goal-oriented'] },
    ],
  },
  {
    title: 'What should I eat for lunch?',
    options: [
      { name: 'Cook at home', tags: ['healthy', 'economical', 'time-consuming'] },
      { name: 'Order delivery', tags: ['quick', 'convenient', 'expensive'] },
      { name: 'Go to a restaurant', tags: ['social', 'treat', 'time-consuming'] },
      { name: 'Meal prep leftovers', tags: ['quick', 'healthy', 'economical'] },
    ],
  },
  {
    title: 'How should I spend my weekend?',
    options: [
      { name: 'Travel somewhere', tags: ['adventure', 'expensive', 'memorable'] },
      { name: 'Stay home and relax', tags: ['relaxing', 'economical', 'comfortable'] },
      { name: 'Meet friends', tags: ['social', 'fun', 'energizing'] },
      { name: 'Learn something new', tags: ['educational', 'productive', 'goal-oriented'] },
    ],
  },
  {
    title: 'What exercise should I do?',
    options: [
      { name: 'Go to the gym', tags: ['energizing', 'challenging', 'social'] },
      { name: 'Yoga at home', tags: ['relaxing', 'flexible', 'quiet'] },
      { name: 'Go for a run', tags: ['energizing', 'outdoor', 'quick'] },
      { name: 'Swimming', tags: ['full-body', 'refreshing', 'social'] },
    ],
  },
];

// Preset option suggestions by category
const OPTION_SUGGESTIONS = {
  'Evening Activities': [
    'Watch a movie',
    'Read a book',
    'Play video games',
    'Work on hobby',
    'Exercise',
    'Cook dinner',
    'Call a friend',
    'Take online course',
  ],
  'Food & Dining': [
    'Cook at home',
    'Order delivery',
    'Go to restaurant',
    'Fast food',
    'Meal prep',
    'Healthy salad',
    'Try new recipe',
    'Grab takeout',
  ],
  'Exercise': [
    'Go to gym',
    'Run outside',
    'Yoga',
    'Swimming',
    'Cycling',
    'Home workout',
    'Sports game',
    'Walking',
  ],
  'Productivity': [
    'Work on project',
    'Study',
    'Learn new skill',
    'Organize space',
    'Plan goals',
    'Write journal',
    'Side hustle',
    'Read book',
  ],
};

// Common tags for quick selection
const COMMON_TAGS = [
  'quick',
  'relaxing',
  'productive',
  'educational',
  'energizing',
  'social',
  'creative',
  'healthy',
  'expensive',
  'economical',
  'challenging',
  'fun',
  'outdoor',
  'indoor',
  'quiet',
  'goal-oriented',
];

export default function CreateDecision() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([
    { name: '', tags: [] as string[] },
    { name: '', tags: [] as string[] },
  ]);
  const [currentTag, setCurrentTag] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState<number | null>(null);
  const [showTagSuggestions, setShowTagSuggestions] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const loadTemplate = (template: typeof DECISION_TEMPLATES[0]) => {
    setTitle(template.title);
    setOptions(template.options);
    setShowTemplates(false);
  };

  const addOption = () => {
    setOptions([...options, { name: '', tags: [] }]);
    setCurrentTag([...currentTag, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      const newCurrentTag = currentTag.filter((_, i) => i !== index);
      setOptions(newOptions);
      setCurrentTag(newCurrentTag);
    }
  };

  const updateOptionName = (index: number, name: string) => {
    const newOptions = [...options];
    newOptions[index].name = name;
    setOptions(newOptions);
  };

  const selectSuggestedOption = (index: number, optionName: string) => {
    updateOptionName(index, optionName);
    setShowSuggestions(null);
  };

  const addTag = (index: number, tag?: string) => {
    const tagToAdd = tag || currentTag[index]?.trim();
    if (tagToAdd && !options[index].tags.includes(tagToAdd)) {
      const newOptions = [...options];
      newOptions[index].tags = [...newOptions[index].tags, tagToAdd];
      setOptions(newOptions);

      if (!tag) {
        const newCurrentTag = [...currentTag];
        newCurrentTag[index] = '';
        setCurrentTag(newCurrentTag);
      }
    }
  };

  const removeTag = (optionIndex: number, tagIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].tags = newOptions[optionIndex].tags.filter(
      (_, i) => i !== tagIndex
    );
    setOptions(newOptions);
  };

  const updateCurrentTag = (index: number, value: string) => {
    const newCurrentTag = [...currentTag];
    newCurrentTag[index] = value;
    setCurrentTag(newCurrentTag);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a decision title');
      return;
    }

    const validOptions = options.filter((opt) => opt.name.trim());
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/decisions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, options: validOptions }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push(`/decision/questions?id=${data.decision.id}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Create Decision
            </span>
          </motion.h1>
          <p className="text-xl text-gray-300">
            Add your options and let AI help you choose wisely ✨
          </p>
        </div>

        {/* Templates Section */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span>🚀</span> Quick Start Templates
                  </h3>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DECISION_TEMPLATES.map((template, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => loadTemplate(template)}
                      className="text-left p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 rounded-xl transition-all"
                    >
                      <div className="text-white font-medium mb-2">{template.title}</div>
                      <div className="text-sm text-gray-400">
                        {template.options.length} options included
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decision Title */}
          <div className="mb-8">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-3">
              Decision Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., What should I do this evening?"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Options */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Options <span className="text-red-400">* (minimum 2)</span>
            </label>

            <div className="space-y-4">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-6 bg-white/5 border border-white/10 rounded-xl"
                >
                  {/* Option Name */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => updateOptionName(index, e.target.value)}
                        onFocus={() => setShowSuggestions(index)}
                        placeholder={`Enter option ${index + 1}`}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                      />

                      {/* Option Suggestions */}
                      <AnimatePresence>
                        {showSuggestions === index && !option.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-3 p-4 bg-white/10 border border-white/20 rounded-lg"
                          >
                            <div className="text-xs text-gray-400 mb-3 flex items-center justify-between">
                              <span>💡 Quick suggestions:</span>
                              <button
                                type="button"
                                onClick={() => setShowSuggestions(null)}
                                className="hover:text-white"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(OPTION_SUGGESTIONS).slice(0, 2).map(([category, suggestions]) => (
                                <div key={category}>
                                  <div className="text-xs text-indigo-400 mb-2 font-medium">{category}</div>
                                  {suggestions.slice(0, 4).map((suggestion, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => selectSuggestedOption(index, suggestion)}
                                      className="block w-full text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded transition-all mb-1"
                                    >
                                      {suggestion}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {options.length > 2 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => removeOption(index)}
                        className="flex-shrink-0 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      >
                        ×
                      </motion.button>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      🏷️ Tags (help AI understand this option better)
                    </label>

                    {/* Current Tags */}
                    {option.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {option.tags.map((tag, tagIndex) => (
                          <motion.span
                            key={tagIndex}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index, tagIndex)}
                              className="hover:text-red-400 transition-colors"
                            >
                              ×
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Tag Input */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={currentTag[index] || ''}
                        onChange={(e) => updateCurrentTag(index, e.target.value)}
                        onFocus={() => setShowTagSuggestions(index)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(index);
                          }
                        }}
                        placeholder="Add custom tag"
                        className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => addTag(index)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                      >
                        Add
                      </motion.button>
                    </div>

                    {/* Common Tag Suggestions */}
                    <AnimatePresence>
                      {showTagSuggestions === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-400">Common tags:</div>
                            <button
                              type="button"
                              onClick={() => setShowTagSuggestions(null)}
                              className="text-xs text-gray-400 hover:text-white"
                            >
                              Hide
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {COMMON_TAGS.filter(tag => !option.tags.includes(tag)).map((tag, idx) => (
                              <motion.button
                                key={idx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.02 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => addTag(index, tag)}
                                className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-400/50 text-gray-300 hover:text-white rounded-full transition-all"
                              >
                                {tag}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={addOption}
              className="w-full mt-4 py-4 border-2 border-dashed border-white/20 hover:border-indigo-400/50 rounded-xl text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <span className="text-2xl">+</span>
              <span>Add Another Option</span>
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 py-4 px-6 bg-white/5 border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Creating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Continue to Questions
                  <span>→</span>
                </span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}