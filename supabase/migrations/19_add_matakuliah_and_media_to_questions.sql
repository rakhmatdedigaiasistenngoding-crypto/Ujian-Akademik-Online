-- ============================================================================
-- Migration 19: Add Matakuliah and Media to Questions, and update exam_configs
-- ============================================================================

-- 1. Add matakuliah, image_url, video_url, link_url to questions
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS matakuliah TEXT NOT NULL DEFAULT 'Pemrograman Berorientasi Objek';
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS link_url TEXT;

-- 2. Update existing data just in case they were generated without the default
UPDATE public.questions SET matakuliah = 'Pemrograman Berorientasi Objek' WHERE matakuliah IS NULL OR matakuliah = '';

-- 3. Add matakuliah to exam_configs
ALTER TABLE public.exam_configs ADD COLUMN IF NOT EXISTS matakuliah TEXT NOT NULL DEFAULT 'Pemrograman Berorientasi Objek';
UPDATE public.exam_configs SET matakuliah = 'Pemrograman Berorientasi Objek' WHERE matakuliah IS NULL OR matakuliah = '';

-- 4. Drop the old generate_exam_packages function
DROP FUNCTION IF EXISTS public.generate_exam_packages(TEXT, INTEGER, INTEGER, TEXT);

-- 5. Create updated generate_exam_packages function supporting multiple topics (TEXT[])
CREATE OR REPLACE FUNCTION public.generate_exam_packages(
  p_exam_id TEXT,
  p_num_packages INTEGER,
  p_version INTEGER,
  p_topics TEXT[] DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_distribution JSONB;
  v_easy_count INTEGER;
  v_medium_count INTEGER;
  v_hard_count INTEGER;
  v_pkg_id UUID;
  v_matakuliah TEXT;
  i INTEGER;
BEGIN
  -- Dapatkan aturan distribusi dan matakuliah dari exam_config
  SELECT distribution, matakuliah INTO v_distribution, v_matakuliah
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
        AND matakuliah = v_matakuliah
        AND (p_topics IS NULL OR cardinality(p_topics) = 0 OR topic = ANY(p_topics))
      ORDER BY random() LIMIT v_easy_count;
    END IF;

    -- Ambil soal medium acak
    IF v_medium_count > 0 THEN
      INSERT INTO public.exam_package_questions (package_id, question_id)
      SELECT v_pkg_id, id FROM public.questions 
      WHERE level = 'medium' 
        AND matakuliah = v_matakuliah
        AND (p_topics IS NULL OR cardinality(p_topics) = 0 OR topic = ANY(p_topics))
      ORDER BY random() LIMIT v_medium_count;
    END IF;

    -- Ambil soal hard acak
    IF v_hard_count > 0 THEN
      INSERT INTO public.exam_package_questions (package_id, question_id)
      SELECT v_pkg_id, id FROM public.questions 
      WHERE level = 'hard' 
        AND matakuliah = v_matakuliah
        AND (p_topics IS NULL OR cardinality(p_topics) = 0 OR topic = ANY(p_topics))
      ORDER BY random() LIMIT v_hard_count;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update get_package_questions to return new fields
DROP FUNCTION IF EXISTS public.get_package_questions(UUID, UUID);

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
  option_mapping JSONB,
  matakuliah TEXT,
  image_url TEXT,
  video_url TEXT,
  link_url TEXT
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
      q.options,
      q.matakuliah,
      q.image_url,
      q.video_url,
      q.link_url
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
    ) as option_mapping,
    rq.matakuliah,
    rq.image_url,
    rq.video_url,
    rq.link_url
  FROM randomized_questions rq
  ORDER BY rq.question_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
