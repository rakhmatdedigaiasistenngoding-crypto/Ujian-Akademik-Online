-- ============================================================================
-- Migration 04: Create Exam Sessions Table
-- ============================================================================
-- This table stores active exam sessions for students

-- Create exam_sessions table
CREATE TABLE IF NOT EXISTS public.exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id TEXT REFERENCES public.exam_configs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'submitted', 'expired')),
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  score NUMERIC,
  question_mapping JSONB, -- Stores randomized question order and option mappings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id) -- One session per student per exam
);

-- Create indexes for faster queries
CREATE INDEX idx_exam_sessions_student_id ON public.exam_sessions(student_id);
CREATE INDEX idx_exam_sessions_exam_id ON public.exam_sessions(exam_id);
CREATE INDEX idx_exam_sessions_status ON public.exam_sessions(status);

-- Enable Row Level Security
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Students can view their own sessions
CREATE POLICY "Students can view their own sessions"
  ON public.exam_sessions
  FOR SELECT
  USING (auth.uid() = student_id);

-- RLS Policy: Students can create their own sessions
CREATE POLICY "Students can create their own sessions"
  ON public.exam_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- RLS Policy: Students can update their own active sessions
CREATE POLICY "Students can update their own active sessions"
  ON public.exam_sessions
  FOR UPDATE
  USING (auth.uid() = student_id AND status = 'active');

-- RLS Policy: Lecturers can view all sessions
CREATE POLICY "Lecturers can view all sessions"
  ON public.exam_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- RLS Policy: Lecturers can update any session (for manual grading)
CREATE POLICY "Lecturers can update any session"
  ON public.exam_sessions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_exam_sessions_updated_at
  BEFORE UPDATE ON public.exam_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Function to check if session is expired
CREATE OR REPLACE FUNCTION public.check_session_expiry()
RETURNS TRIGGER AS $$
DECLARE
  exam_duration INTEGER;
BEGIN
  -- Get exam duration
  SELECT duration INTO exam_duration
  FROM public.exam_configs
  WHERE id = NEW.exam_id;
  
  -- Check if session has expired
  IF NEW.status = 'active' AND 
     NOW() > (NEW.started_at + (exam_duration || ' minutes')::INTERVAL) THEN
    NEW.status = 'expired';
    NEW.finished_at = NEW.started_at + (exam_duration || ' minutes')::INTERVAL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check expiry on update
CREATE TRIGGER check_exam_session_expiry
  BEFORE UPDATE ON public.exam_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.check_session_expiry();
