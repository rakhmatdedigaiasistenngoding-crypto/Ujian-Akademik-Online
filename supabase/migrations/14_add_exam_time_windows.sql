-- ============================================================================
-- Migration 14: Add Exam Time Windows
-- ============================================================================
-- Adds available_from and available_until to exam_configs to restrict
-- when students can take exams.

ALTER TABLE public.exam_configs
ADD COLUMN IF NOT EXISTS available_from TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS available_until TIMESTAMPTZ;
