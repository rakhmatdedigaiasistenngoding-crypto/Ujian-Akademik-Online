export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  level: DifficultyLevel;
  weight: number;
  topic: string;
  image_url?: string;
  video_url?: string;
  link_url?: string;
}

export interface ExamSession {
  id: string;
  studentId: string;
  examId: string;
  questions: Question[];
  answers: (string | null)[];
  startedAt: string;
  finishedAt: string | null;
  deviceId: string;
  score: number | null;
  status: 'idle' | 'active' | 'paused' | 'submitted';
}

export interface ExamConfig {
  id: string;
  title: string;
  matakuliah: string;
  duration: number; // in minutes
  totalQuestions: number;
  distribution: Record<DifficultyLevel, number>;
  scoreRelease: 'immediate' | 'after_all' | 'scheduled';
  scoreReleaseAt?: Date;
  maxRetakes?: number;
  retakeCondition?: 'immediate' | 'wait_time' | 'wait_all';
  retakeWaitMinutes?: number;
  availableFrom?: string;
  availableUntil?: string;
  attemptsUsed?: number;
}
