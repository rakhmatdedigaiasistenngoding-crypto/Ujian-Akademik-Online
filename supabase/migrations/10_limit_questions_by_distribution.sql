-- Migration 10: Limit randomized questions based on exam_configs distribution

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
DECLARE
  v_easy_limit INTEGER;
  v_medium_limit INTEGER;
  v_hard_limit INTEGER;
  v_total_limit INTEGER;
BEGIN
  -- Ambil limit distribusi dari konfigurasi ujian
  SELECT 
    COALESCE((distribution->>'easy')::INTEGER, 0),
    COALESCE((distribution->>'medium')::INTEGER, 0),
    COALESCE((distribution->>'hard')::INTEGER, 0),
    total_questions
  INTO v_easy_limit, v_medium_limit, v_hard_limit, v_total_limit
  FROM public.exam_configs
  WHERE public.exam_configs.id = p_exam_id;

  -- Jika distribusi kosong/0 tapi total_questions ada nilainya (fallback keamanan)
  IF (v_easy_limit + v_medium_limit + v_hard_limit) = 0 THEN
    v_medium_limit := v_total_limit;
  END IF;

  RETURN QUERY
  WITH selected_questions AS (
    (SELECT * FROM public.questions q WHERE q.exam_id = p_exam_id AND q.level = 'easy' ORDER BY md5(q.id || p_student_id::TEXT) LIMIT v_easy_limit)
    UNION ALL
    (SELECT * FROM public.questions q WHERE q.exam_id = p_exam_id AND q.level = 'medium' ORDER BY md5(q.id || p_student_id::TEXT) LIMIT v_medium_limit)
    UNION ALL
    (SELECT * FROM public.questions q WHERE q.exam_id = p_exam_id AND q.level = 'hard' ORDER BY md5(q.id || p_student_id::TEXT) LIMIT v_hard_limit)
  ),
  randomized_questions AS (
    SELECT 
      sq.id,
      sq.text,
      sq.level,
      sq.weight,
      sq.topic,
      ROW_NUMBER() OVER (ORDER BY md5(sq.id || p_student_id::TEXT)) as question_order,
      sq.options
    FROM selected_questions sq
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
