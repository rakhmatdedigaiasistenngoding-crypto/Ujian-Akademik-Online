-- ============================================================================
-- Migration 02: Create Exam Configs Table
-- ============================================================================
-- This table stores exam configurations (duration, question distribution, etc.)

-- Create exam_configs table
CREATE TABLE IF NOT EXISTS public.exam_configs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  duration INTEGER NOT NULL, -- dalam menit
  total_questions INTEGER NOT NULL,
  distribution JSONB NOT NULL, -- {easy: 10, medium: 10, hard: 10}
  score_release TEXT NOT NULL CHECK (score_release IN ('immediate', 'manual')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_exam_configs_created_by ON public.exam_configs(created_by);

-- Enable Row Level Security
ALTER TABLE public.exam_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone authenticated can view exam configs
CREATE POLICY "Anyone authenticated can view exam configs"
  ON public.exam_configs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policy: Only lecturers can create exam configs
CREATE POLICY "Only lecturers can create exam configs"
  ON public.exam_configs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- RLS Policy: Only lecturers can update exam configs
CREATE POLICY "Only lecturers can update exam configs"
  ON public.exam_configs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- RLS Policy: Only lecturers can delete exam configs
CREATE POLICY "Only lecturers can delete exam configs"
  ON public.exam_configs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_exam_configs_updated_at
  BEFORE UPDATE ON public.exam_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
