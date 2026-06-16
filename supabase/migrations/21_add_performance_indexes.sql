-- ============================================================================
-- Migration 21: Add Performance Indexes to Questions Table
-- ============================================================================

-- Add indexes to frequently filtered, grouped, and sorted columns
CREATE INDEX IF NOT EXISTS idx_questions_matakuliah ON public.questions(matakuliah);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_level ON public.questions(level);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
