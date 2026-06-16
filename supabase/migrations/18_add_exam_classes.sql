-- ============================================================================
-- Migration 18: Exam Classes Many-to-Many Relationship
-- ============================================================================

-- Drop exam_id from classes
ALTER TABLE public.classes DROP COLUMN IF EXISTS exam_id;

-- Create exam_classes junction table
CREATE TABLE IF NOT EXISTS public.exam_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id TEXT NOT NULL REFERENCES public.exam_configs(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(exam_id, class_id)
);

-- Enable RLS
ALTER TABLE public.exam_classes ENABLE ROW LEVEL SECURITY;

-- Create policies for exam_classes
CREATE POLICY "Allow all access to exam_classes for authenticated users"
ON public.exam_classes
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to exam_classes for anon"
ON public.exam_classes
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
