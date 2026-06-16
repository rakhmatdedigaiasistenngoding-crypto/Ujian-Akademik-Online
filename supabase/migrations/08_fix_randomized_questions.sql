-- Fix get_randomized_questions aggregate function error

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
      q.level,
      q.weight,
      q.topic,
      ROW_NUMBER() OVER (ORDER BY md5(q.id || p_student_id::TEXT)) as question_order,
      q.options
    FROM public.questions q
    WHERE q.exam_id = p_exam_id
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
