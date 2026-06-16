-- ============================================================================
-- Migration 20: Create 'exam_media' storage bucket for question attachments
-- ============================================================================

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('exam_media', 'exam_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Policy: Public Access
-- Allow anyone (public) to view/read objects in the exam_media bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Exam Media'
    ) THEN
        CREATE POLICY "Public Access for Exam Media"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'exam_media');
    END IF;
END
$$;

-- 3. Policy: Authenticated Uploads
-- Allow authenticated users to upload and manage objects in the exam_media bucket
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can manage Exam Media'
    ) THEN
        CREATE POLICY "Authenticated users can manage Exam Media"
        ON storage.objects FOR ALL
        USING (bucket_id = 'exam_media' AND auth.role() = 'authenticated')
        WITH CHECK (bucket_id = 'exam_media' AND auth.role() = 'authenticated');
    END IF;
END
$$;
