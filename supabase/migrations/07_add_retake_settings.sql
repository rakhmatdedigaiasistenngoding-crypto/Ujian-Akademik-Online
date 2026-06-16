-- ============================================================================
-- Migration 07: Add Retake Settings
-- ============================================================================

-- 1. Tambahkan pengaturan retake pada exam_configs
ALTER TABLE public.exam_configs
ADD COLUMN max_retakes INTEGER NOT NULL DEFAULT 1,
ADD COLUMN retake_condition TEXT NOT NULL DEFAULT 'immediate' CHECK (retake_condition IN ('immediate', 'wait_time', 'wait_all')),
ADD COLUMN retake_wait_minutes INTEGER;

-- 2. Hapus unique constraint lama pada exam_sessions (yang mencegah retake)
ALTER TABLE public.exam_sessions
DROP CONSTRAINT exam_sessions_exam_id_student_id_key;

-- 3. Tambahkan kolom attempt_number pada exam_sessions
ALTER TABLE public.exam_sessions
ADD COLUMN attempt_number INTEGER NOT NULL DEFAULT 1;

-- 4. Tambahkan kembali unique constraint dengan menyertakan attempt_number
-- (Sehingga mahasiswa tidak bisa memiliki attempt ke-1 ganda pada ujian yang sama)
ALTER TABLE public.exam_sessions
ADD CONSTRAINT exam_sessions_exam_id_student_id_attempt_number_key UNIQUE(exam_id, student_id, attempt_number);
