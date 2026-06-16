import { useEffect, useCallback } from 'react';
import { useExamStore } from '../stores/examStore';

export function useCountdown() {
  const { session, timeRemaining, tickTime, submitExam } = useExamStore();
  const isActive = session?.status === 'active';

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      tickTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining, tickTime]);

  const forceSubmit = useCallback(() => {
    submitExam();
  }, [submitExam]);

  return {
    timeRemaining,
    isActive,
    isWarning: timeRemaining > 0 && timeRemaining <= 300, // 5 minutes warning
    forceSubmit
  };
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
