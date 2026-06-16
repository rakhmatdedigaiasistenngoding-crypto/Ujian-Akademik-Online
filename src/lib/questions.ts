import { Question, DifficultyLevel } from '../types/exam';

/**
 * Randomizes an array in-place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selects a proportional distribution of questions based on difficulty levels.
 */
export function generateExamQuestions(
  bank: Question[],
  distribution: Record<DifficultyLevel, number>
): Question[] {
  // Separate questions by difficulty
  const easyQuestions = bank.filter(q => q.level === 'easy');
  const mediumQuestions = bank.filter(q => q.level === 'medium');
  const hardQuestions = bank.filter(q => q.level === 'hard');

  // Shuffle and pick required amounts
  const selectedEasy = shuffleArray(easyQuestions).slice(0, distribution.easy);
  const selectedMedium = shuffleArray(mediumQuestions).slice(0, distribution.medium);
  const selectedHard = shuffleArray(hardQuestions).slice(0, distribution.hard);

  // Combine and shuffle the final exam set so difficulties are mixed
  return shuffleArray([...selectedEasy, ...selectedMedium, ...selectedHard]);
}

/**
 * Helper to ensure options A-E are properly formatted from raw text
 */
export function parseOptions(rawOptions: string[]): { key: string; text: string }[] {
  const keys = ['A', 'B', 'C', 'D', 'E'];
  return rawOptions.map((text, i) => ({
    key: keys[i] || '?',
    text: text.trim()
  }));
}
