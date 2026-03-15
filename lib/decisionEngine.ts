export interface Answer {
  question: string;
  answer: string;
}

export interface Option {
  _id: string;
  optionName: string;
  tags: string[];
}

export interface RecommendationResult {
  recommended_option: string;
  confidence_score: number;
  reason: string;
  scores: { [key: string]: number };
}

export function runDecisionEngine(
  options: Option[],
  answers: Answer[]
): RecommendationResult {
  // Initialize scores for each option
  const scores: { [key: string]: number } = {};
  options.forEach(option => {
    scores[option.optionName] = 0;
  });

  // Extract answers
  const timeAnswer = answers.find(a => a.question === 'time')?.answer || '';
  const energyAnswer = answers.find(a => a.question === 'energy')?.answer || '';
  const goalAnswer = answers.find(a => a.question === 'goal')?.answer || '';

  // Score based on time available
  options.forEach(option => {
    const tags = option.tags.map(t => t.toLowerCase());
    
    // Time scoring
    if (timeAnswer === '10 minutes') {
      if (tags.includes('quick') || tags.includes('short')) scores[option.optionName] += 3;
      if (tags.includes('long')) scores[option.optionName] -= 2;
    } else if (timeAnswer === '30 minutes') {
      if (tags.includes('medium')) scores[option.optionName] += 2;
      if (tags.includes('quick')) scores[option.optionName] += 1;
    } else if (timeAnswer === '1 hour') {
      if (tags.includes('long') || tags.includes('detailed')) scores[option.optionName] += 3;
    }

    // Energy level scoring
    if (energyAnswer === 'Low') {
      if (tags.includes('relaxing') || tags.includes('easy') || tags.includes('passive')) {
        scores[option.optionName] += 3;
      }
      if (tags.includes('intense') || tags.includes('demanding')) {
        scores[option.optionName] -= 2;
      }
    } else if (energyAnswer === 'Medium') {
      if (tags.includes('moderate')) scores[option.optionName] += 2;
    } else if (energyAnswer === 'High') {
      if (tags.includes('active') || tags.includes('intense') || tags.includes('challenging')) {
        scores[option.optionName] += 3;
      }
      if (tags.includes('passive')) scores[option.optionName] -= 1;
    }

    // Goal alignment scoring
    if (goalAnswer === 'Relax') {
      if (tags.includes('relaxing') || tags.includes('calm') || tags.includes('leisure')) {
        scores[option.optionName] += 3;
      }
      if (tags.includes('productive') || tags.includes('work')) {
        scores[option.optionName] -= 2;
      }
    } else if (goalAnswer === 'Be productive') {
      if (tags.includes('productive') || tags.includes('work') || tags.includes('efficient')) {
        scores[option.optionName] += 3;
      }
      if (tags.includes('leisure') || tags.includes('entertainment')) {
        scores[option.optionName] -= 1;
      }
    } else if (goalAnswer === 'Learn something') {
      if (tags.includes('educational') || tags.includes('learning') || tags.includes('skill')) {
        scores[option.optionName] += 3;
      }
    }

    // Add small random variation to break ties
    scores[option.optionName] += Math.random() * 0.5;
  });

  // Find the highest scoring option
  let maxScore = -Infinity;
  let recommendedOption = '';
  
  for (const [optionName, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      recommendedOption = optionName;
    }
  }

  // Calculate confidence score (0-100)
  const scoreValues = Object.values(scores);
  const maxPossibleScore = 9; // 3 points per category
  const confidenceScore = Math.min(100, Math.max(0, (maxScore / maxPossibleScore) * 100));

  // Generate reason
  let reason = `Based on your inputs (${timeAnswer} available, ${energyAnswer.toLowerCase()} energy, goal: ${goalAnswer.toLowerCase()}), `;
  reason += `this option best matches your current situation.`;

  return {
    recommended_option: recommendedOption,
    confidence_score: Math.round(confidenceScore),
    reason,
    scores,
  };
}