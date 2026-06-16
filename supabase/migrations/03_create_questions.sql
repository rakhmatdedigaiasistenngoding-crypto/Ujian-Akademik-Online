-- ============================================================================
-- Migration 03: Create Questions Table
-- ============================================================================
-- This table stores exam questions with support for randomization
-- Options are stored as array (no A/B/C/D labels)
-- correct_answer is stored as index (0-4)

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  exam_id TEXT REFERENCES public.exam_configs(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of option texts: ["Option 1", "Option 2", ...]
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 4),
  level TEXT NOT NULL CHECK (level IN ('easy', 'medium', 'hard')),
  weight INTEGER NOT NULL DEFAULT 1,
  topic TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_questions_exam_id ON public.questions(exam_id);
CREATE INDEX idx_questions_level ON public.questions(level);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Students can view questions but NOT correct_answer
-- We'll handle this in the application layer by selecting only needed columns
CREATE POLICY "Students can view questions"
  ON public.questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'student'
    )
  );

-- RLS Policy: Lecturers can view all questions including correct_answer
CREATE POLICY "Lecturers can view all questions"
  ON public.questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- RLS Policy: Only lecturers can create questions
CREATE POLICY "Only lecturers can create questions"
  ON public.questions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- RLS Policy: Only lecturers can update questions
CREATE POLICY "Only lecturers can update questions"
  ON public.questions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- RLS Policy: Only lecturers can delete questions
CREATE POLICY "Only lecturers can delete questions"
  ON public.questions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'lecturer'
    )
  );

-- Function to get randomized questions for a student
-- This function randomizes both question order and option order
CREATE OR REPLACE FUNCTION public.get_randomized_questions(
  p_exam_id TEXT,
  p_student_id UUID
)
RETURNS TABLE (
  id TEXT,
  text TEXT,
  options JSONB,
  level TEXT,
  weight INTEGER,
  topic TEXT,
  question_order INTEGER,
  option_mapping JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH randomized_questions AS (
    SELECT 
      q.id,
      q.text,
      q.options,
      q.level,
      q.weight,
      q.topic,
      ROW_NUMBER() OVER (ORDER BY md5(q.id || p_student_id::TEXT)) as question_order
    FROM public.questions q
    WHERE q.exam_id = p_exam_id
  ),
  randomized_options AS (
    SELECT
      rq.id,
      rq.text,
      rq.options,
      rq.level,
      rq.weight,
      rq.topic,
      rq.question_order,
      -- Create randomized option mapping
      jsonb_agg(
        jsonb_build_object(
          'original_index', idx - 1,
          'text', opt
        ) ORDER BY md5(rq.id || p_student_id::TEXT || idx::TEXT)
      ) as randomized_opts,
      -- Create mapping from randomized index to original index
      jsonb_object_agg(
        (ROW_NUMBER() OVER (ORDER BY md5(rq.id || p_student_id::TEXT || idx::TEXT)) - 1)::TEXT,
        (idx - 1)::TEXT
      ) as option_mapping
    FROM randomized_questions rq,
    LATERAL jsonb_array_elements_text(rq.options) WITH ORDINALITY AS opts(opt, idx)
    GROUP BY rq.id, rq.text, rq.options, rq.level, rq.weight, rq.topic, rq.question_order
  )
  SELECT
    ro.id,
    ro.text,
    (SELECT jsonb_agg(opt->'text') FROM jsonb_array_elements(ro.randomized_opts) opt) as options,
    ro.level,
    ro.weight,
    ro.topic,
    ro.question_order::INTEGER,
    ro.option_mapping
  FROM randomized_options ro
  ORDER BY ro.question_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
