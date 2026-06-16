-- ============================================================================
-- Migration 12: Refactor to Exam Packages (Variants) Architecture
-- ============================================================================
-- Decouples questions from exam_configs, creating a Question Bank.
-- Introduces exam_packages to pre-generate question combinations.

-- 1. Create exam_packages table
CREATE TABLE IF NOT EXISTS public.exam_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id TEXT REFERENCES public.exam_configs(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  generation_version INTEGER DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_packages_exam_id ON public.exam_packages(exam_id);

-- 2. Create exam_package_questions table
CREATE TABLE IF NOT EXISTS public.exam_package_questions (
  package_id UUID REFERENCES public.exam_packages(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES public.questions(id) ON DELETE CASCADE,
  PRIMARY KEY (package_id, question_id)
);

-- 3. Modify exam_sessions table
ALTER TABLE public.exam_sessions 
ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES public.exam_packages(id) ON DELETE SET NULL;

-- 4. Unlink questions from exam_configs (Bank Soal)
-- We drop the foreign key constraint and the column entirely.
ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_exam_id_fkey;
ALTER TABLE public.questions DROP COLUMN IF EXISTS exam_id;

-- 5. RPC to generate exam packages (for Lecturer/Admin)
DROP FUNCTION IF EXISTS public.generate_exam_packages(UUID, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS public.generate_exam_packages(TEXT, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION public.generate_exam_packages(
  p_exam_id TEXT,
  p_num_packages INTEGER,
  p_version INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  v_distribution JSONB;
  v_easy_count INTEGER;
  v_medium_count INTEGER;
  v_hard_count INTEGER;
  v_pkg_id UUID;
  i INTEGER;
BEGIN
  -- Dapatkan aturan distribusi dari exam_config
  SELECT distribution INTO v_distribution
  FROM public.exam_configs
  WHERE id = p_exam_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Exam % not found', p_exam_id;
  END IF;

  v_easy_count := COALESCE((v_distribution->>'easy')::INTEGER, 0);
  v_medium_count := COALESCE((v_distribution->>'medium')::INTEGER, 0);
  v_hard_count := COALESCE((v_distribution->>'hard')::INTEGER, 0);

  FOR i IN 1..p_num_packages LOOP
    -- Buat paket baru
    INSERT INTO public.exam_packages (exam_id, package_name, generation_version, usage_count)
    VALUES (p_exam_id, 'Paket ' || i, p_version, 0)
    RETURNING id INTO v_pkg_id;

    -- Ambil soal easy acak
    IF v_easy_count > 0 THEN
      INSERT INTO public.exam_package_questions (package_id, question_id)
      SELECT v_pkg_id, id FROM public.questions 
      WHERE level = 'easy' 
      ORDER BY random() LIMIT v_easy_count;
    END IF;

    -- Ambil soal medium acak
    IF v_medium_count > 0 THEN
      INSERT INTO public.exam_package_questions (package_id, question_id)
      SELECT v_pkg_id, id FROM public.questions 
      WHERE level = 'medium' 
      ORDER BY random() LIMIT v_medium_count;
    END IF;

    -- Ambil soal hard acak
    IF v_hard_count > 0 THEN
      INSERT INTO public.exam_package_questions (package_id, question_id)
      SELECT v_pkg_id, id FROM public.questions 
      WHERE level = 'hard' 
      ORDER BY random() LIMIT v_hard_count;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC to assign a package and create a session
DROP FUNCTION IF EXISTS public.assign_exam_package(UUID, UUID, TEXT);
DROP FUNCTION IF EXISTS public.assign_exam_package(TEXT, UUID, TEXT);

CREATE OR REPLACE FUNCTION public.assign_exam_package(
  p_exam_id TEXT,
  p_student_id UUID,
  p_device_id TEXT
)
RETURNS TABLE (
  session_id UUID,
  package_id UUID,
  attempt_number INTEGER,
  is_new_session BOOLEAN
) AS $$
DECLARE
  v_session_id UUID;
  v_package_id UUID;
  v_attempt_number INTEGER;
BEGIN
  -- A. Periksa apakah sudah ada sesi yang aktif
  SELECT s.id, ep.id, s.attempt_number 
  INTO v_session_id, v_package_id, v_attempt_number
  FROM public.exam_sessions s
  JOIN public.exam_packages ep ON s.package_id = ep.id
  WHERE s.exam_id = p_exam_id 
    AND s.student_id = p_student_id 
    AND s.status = 'active';

  IF FOUND THEN
    RETURN QUERY SELECT v_session_id, v_package_id, v_attempt_number, FALSE;
    RETURN;
  END IF;

  -- B. Tentukan attempt_number baru
  SELECT COALESCE(MAX(es.attempt_number), 0) + 1 INTO v_attempt_number
  FROM public.exam_sessions es
  WHERE es.exam_id = p_exam_id AND es.student_id = p_student_id;

  -- C. Cari paket yang usage_count < 5 dan belum pernah dikerjakan siswa ini di attempt sebelumnya
  SELECT ep.id INTO v_package_id
  FROM public.exam_packages ep
  WHERE ep.exam_id = p_exam_id
    AND ep.usage_count < 5
    AND ep.id NOT IN (
      SELECT es.package_id FROM public.exam_sessions es 
      WHERE es.student_id = p_student_id AND es.exam_id = p_exam_id AND es.package_id IS NOT NULL
    )
  ORDER BY random() 
  LIMIT 1;

  -- Fallback: Jika tidak ada paket yang tersisa (semua max 5, atau semua sudah pernah dikerjakan)
  -- kita ambil saja paket yang paling jarang digunakan (mengabaikan aturan max 5 demi kelancaran ujian)
  IF v_package_id IS NULL THEN
    SELECT ep.id INTO v_package_id
    FROM public.exam_packages ep
    WHERE ep.exam_id = p_exam_id
    ORDER BY ep.usage_count ASC, random()
    LIMIT 1;
  END IF;

  IF v_package_id IS NULL THEN
    RAISE EXCEPTION 'Tidak ada paket soal yang tersedia untuk ujian ini.';
  END IF;

  -- D. Tambah usage_count
  UPDATE public.exam_packages SET usage_count = usage_count + 1 WHERE id = v_package_id;

  -- E. Buat sesi (pertama kali, question_mapping null dulu)
  INSERT INTO public.exam_sessions (
    exam_id, student_id, device_id, status, package_id, attempt_number, started_at
  ) VALUES (
    p_exam_id, p_student_id, p_device_id, 'active', v_package_id, v_attempt_number, NOW()
  ) RETURNING id INTO v_session_id;

  RETURN QUERY SELECT v_session_id, v_package_id, v_attempt_number, TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Replace get_randomized_questions to use package_id
CREATE OR REPLACE FUNCTION public.get_package_questions(
  p_package_id UUID,
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
      q.level,
      q.weight,
      q.topic,
      ROW_NUMBER() OVER (ORDER BY md5(q.id || p_student_id::TEXT)) as question_order,
      q.options
    FROM public.questions q
    JOIN public.exam_package_questions epq ON q.id = epq.question_id
    WHERE epq.package_id = p_package_id
  ),
  unnested_options AS (
    SELECT
      rq.id,
      opt,
      idx - 1 as original_index,
      md5(rq.id || p_student_id::TEXT || idx::TEXT) as option_hash
    FROM randomized_questions rq,
    LATERAL jsonb_array_elements_text(rq.options) WITH ORDINALITY AS opts(opt, idx)
  ),
  ranked_options AS (
    SELECT
      uo.id,
      uo.opt,
      uo.original_index,
      ROW_NUMBER() OVER (PARTITION BY uo.id ORDER BY uo.option_hash) - 1 as new_index
    FROM unnested_options uo
  )
  SELECT
    rq.id,
    rq.text,
    (
      SELECT jsonb_agg(ro.opt ORDER BY ro.new_index)
      FROM ranked_options ro
      WHERE ro.id = rq.id
    ) as options,
    rq.level,
    rq.weight,
    rq.topic,
    rq.question_order::INTEGER,
    (
      SELECT jsonb_object_agg(ro.new_index::TEXT, ro.original_index::TEXT)
      FROM ranked_options ro
      WHERE ro.id = rq.id
    ) as option_mapping
  FROM randomized_questions rq
  ORDER BY rq.question_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
