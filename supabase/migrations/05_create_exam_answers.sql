-- ============================================================================
-- Migration 05: Create Exam Answers Table
-- ============================================================================
-- This table stores student answers for each question in a session

-- Create exam_answers table
CREATE TABLE IF NOT EXISTS public.exam_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.exam_sessions(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  answer INTEGER, -- Index of selected option (0-4), NULL if not answered
  is_correct BOOLEAN, -- Calculated during grading
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id) -- One answer per question per session
);

-- Create indexes for faster queries
CREATE INDEX idx_exam_answers_session_id ON public.exam_answers(session_id);
CREATE INDEX idx_exam_answers_question_id ON public.exam_answers(question_id);

-- Enable Row Level Security
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Students can view their own answers
CREATE POLICY "Students can view their own answers"
  ON public.exam_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exam_sessions
      WHERE id = session_id AND student_id = auth.uid()
    )
  );

-- RLS Policy: Students can insert their own answers
CREATE POLICY "Students can insert their own answers"
  ON public.exam_answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exam_sessions
      WHERE id = session_id AND student_id = auth.uid() AND status = 'active'
    )
  );

-- RLS Policy: Students can update their own answers (only for active sessions)
CREATE POLICY "Students can update their own answers"
  ON public.exam_answers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.exam_sessions
      WHERE id = session_id AND student_id = auth.uid() AND status = 'active'
    )
  );

-- RLS Policy: Lecturers can view all answers
CREATE POLICY "Lecturers can view all answers"
  ON public.exam_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- RLS Policy: Lecturers can update any answer (for manual grading)
CREATE POLICY "Lecturers can update any answer"
  ON public.exam_answers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_exam_answers_updated_at
  BEFORE UPDATE ON public.exam_answers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
