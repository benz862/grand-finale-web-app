-- Fix File Uploads Storage Bucket and RLS Policies
-- This script creates the storage bucket and sets up proper RLS policies

-- 1. Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'legacy-files',
  'legacy-files',
  true,
  104857600, -- 100MB limit
  ARRAY[
    'video/mp4', 'video/mov', 'video/avi', 'video/mkv',
    'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac',
    'application/pdf', 'image/jpeg', 'image/png', 'image/gif',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv', 'application/rtf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create RLS policy for file uploads table
-- First, enable RLS on the table if not already enabled
ALTER TABLE file_uploads_multimedia ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can insert their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can update their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can delete their own file uploads" ON file_uploads_multimedia;

-- Create new policies
CREATE POLICY "Users can view their own file uploads" ON file_uploads_multimedia
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file uploads" ON file_uploads_multimedia
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file uploads" ON file_uploads_multimedia
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file uploads" ON file_uploads_multimedia
  FOR DELETE USING (auth.uid() = user_id);

-- 3. Create RLS policy for storage bucket
-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Create storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'legacy-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'legacy-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'legacy-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'legacy-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Grant necessary permissions
GRANT ALL ON file_uploads_multimedia TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- 5. Verify the setup
SELECT 'Storage bucket created successfully' as status
WHERE EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'legacy-files'
);

SELECT 'RLS policies created successfully' as status
WHERE EXISTS (
  SELECT 1 FROM pg_policies 
  WHERE tablename = 'file_uploads_multimedia' 
  AND schemaname = 'public'
);
