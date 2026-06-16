import { Question, DifficultyLevel } from '../types/exam';

export interface ScoreResult {
  rawScore: number;
  maxRawScore: number;
  finalScore: number;
  breakdown: Record<DifficultyLevel, { correct: number; total: number; score: number }>;
}

/**
 * Validates and calculates the final normalized score for an exam session.
 */
export function calculateScore(
  questions: Question[],
  answers: (string | null)[]
): ScoreResult {
  // NOTE: This is a DUMMY implementation for frontend testing only.
  // In production, grading MUST be done on the backend where correctAnswer is stored securely.
  // The frontend should never have access to correct answers.
  
  let maxRawScore = 0;
  
  const breakdown: Record<DifficultyLevel, { correct: number; total: number; score: number }> = {
    easy: { correct: 0, total: 0, score: 0 },
    medium: { correct: 0, total: 0, score: 0 },
    hard: { correct: 0, total: 0, score: 0 },
  };

  questions.forEach((q) => {
    // Calculate maximum possible score
    maxRawScore += q.weight;
    breakdown[q.level].total += 1;
  });

  // DUMMY: Return 0 score for now since we don't have correctAnswer on frontend
  // In production, this function should call a backend API endpoint
  const rawScore = 0;
  const finalScore = 0;

  return {
    rawScore,
    maxRawScore,
    finalScore,
    breakdown,
  };
}
