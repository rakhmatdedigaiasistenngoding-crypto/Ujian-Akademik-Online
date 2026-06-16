-- ============================================================================
-- Migration 17: Add Classes and Class Students
-- ============================================================================

-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  schedule TEXT,
  exam_id TEXT REFERENCES public.exam_configs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create class_students table
CREATE TABLE IF NOT EXISTS public.class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  npm TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(class_id, email)
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

-- Create policies for classes
CREATE POLICY "Allow all access to classes for authenticated users"
ON public.classes
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to classes for anon"
ON public.classes
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Create policies for class_students
CREATE POLICY "Allow all access to class_students for authenticated users"
ON public.class_students
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to class_students for anon"
ON public.class_students
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Reload PostgREST schema cache so the new tables are immediately accessible via API
NOTIFY pgrst, 'reload schema';
