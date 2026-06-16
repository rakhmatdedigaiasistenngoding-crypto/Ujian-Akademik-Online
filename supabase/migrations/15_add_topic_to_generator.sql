-- Update RPC generate_exam_packages to accept p_topic
DROP FUNCTION IF EXISTS public.generate_exam_packages(TEXT, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION public.generate_exam_packages(
  p_exam_id TEXT,
  p_num_packages INTEGER,
  p_version INTEGER,
  p_topic TEXT DEFAULT NULL
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
      WHERE level = 'easy' AND (p_topic IS NULL OR p_topic = '' OR topic = p_topic)
      ORDER BY random() LIMIT v_easy_count;
    END IF;

    -- Ambil soal medium acak
    IF v_medium_count > 0 THEN
      INSERT INTO public.exam_package_questions (package_id, question_id)
      SELECT v_pkg_id, id FROM public.questions 
      WHERE level = 'medium' AND (p_topic IS NULL OR p_topic = '' OR topic = p_topic)
      ORDER BY random() LIMIT v_medium_count;
    END IF;

    -- Ambil soal hard acak
    IF v_hard_count > 0 THEN
      INSERT INTO public.exam_package_questions (package_id, question_id)
      SELECT v_pkg_id, id FROM public.questions 
      WHERE level = 'hard' AND (p_topic IS NULL OR p_topic = '' OR topic = p_topic)
      ORDER BY random() LIMIT v_hard_count;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
