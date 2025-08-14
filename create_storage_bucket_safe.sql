-- Create Supabase Storage bucket for file uploads (Safe Version)
-- Run this in your Supabase SQL Editor
-- This script handles existing policies gracefully

-- Create the storage bucket (will not fail if it exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'legacy-files',
  'legacy-files',
  true, -- Make bucket public so files can be accessed via QR codes
  52428800, -- 50MB file size limit
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/rtf',
    'text/plain',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'audio/mpeg',
    'audio/wav',
    'audio/mp4',
    'audio/aac'
  ]
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload files to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for QR codes" ON storage.objects;

-- Create RLS policies for the bucket
-- Policy 1: Users can upload files to their own folder
CREATE POLICY "Users can upload files to their own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'legacy-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Users can view their own files
CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'legacy-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Users can update their own files
CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'legacy-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Users can delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'legacy-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 5: Public read access for QR code functionality
CREATE POLICY "Public read access for QR codes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'legacy-files'
);

-- Verify the bucket was created/updated
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at,
  updated_at
FROM storage.buckets 
WHERE id = 'legacy-files';

-- Show the policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND qual LIKE '%legacy-files%';

-- Show success message
SELECT 'Storage bucket "legacy-files" created/updated successfully with RTF support!' as status; 