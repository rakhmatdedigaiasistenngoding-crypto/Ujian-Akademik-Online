-- ============================================================================
-- Migration 16: Fix RLS for Exam Packages
-- ============================================================================
-- Adds RLS policies for exam_packages and exam_package_questions 
-- so that authenticated users (Lecturers) can insert and view them.

-- Enable RLS just in case it wasn't enabled
ALTER TABLE public.exam_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_package_questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow all access to exam_packages for authenticated users" ON public.exam_packages;
DROP POLICY IF EXISTS "Allow all access to exam_package_questions for authenticated users" ON public.exam_package_questions;

-- Create full access policy for authenticated users
CREATE POLICY "Allow all access to exam_packages for authenticated users"
ON public.exam_packages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to exam_package_questions for authenticated users"
ON public.exam_package_questions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Also add policy for anon just in case (for demo mode)
DROP POLICY IF EXISTS "Allow all access to exam_packages for anon" ON public.exam_packages;
DROP POLICY IF EXISTS "Allow all access to exam_package_questions for anon" ON public.exam_package_questions;

CREATE POLICY "Allow all access to exam_packages for anon"
ON public.exam_packages
FOR ALL
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all access to exam_package_questions for anon"
ON public.exam_package_questions
FOR ALL
TO anon
USING (true)
WITH CHECK (true);
