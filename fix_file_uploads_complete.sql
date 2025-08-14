-- Complete fix for file uploads - Storage bucket + Database table
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. CREATE/UPDATE STORAGE BUCKET
-- ========================================

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

-- ========================================
-- 2. CREATE/UPDATE STORAGE POLICIES
-- ========================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload files to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for QR codes" ON storage.objects;

-- Create storage RLS policies
CREATE POLICY "Users can upload files to their own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'legacy-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'legacy-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'legacy-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'legacy-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Public read access for QR code functionality
CREATE POLICY "Public read access for QR codes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'legacy-files'
);

-- ========================================
-- 3. CREATE/UPDATE DATABASE TABLE
-- ========================================

-- Drop existing table if it exists (to recreate with correct schema)
DROP TABLE IF EXISTS file_uploads CASCADE;

-- Create file_uploads table with all necessary columns
CREATE TABLE file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File information
  file_name TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('video', 'voice', 'document', 'reference')),
  file_category TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_extension TEXT,
  
  -- URLs and data
  file_url TEXT NOT NULL,
  qr_code_url TEXT,
  qr_code_data TEXT,
  
  -- Metadata
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);
CREATE INDEX idx_file_uploads_file_type ON file_uploads(file_type);

-- Enable Row Level Security (RLS)
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. CREATE DATABASE RLS POLICIES
-- ========================================

-- Drop existing database policies if they exist
DROP POLICY IF EXISTS "Users can view their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can insert their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can update their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can delete their own file uploads" ON file_uploads;

-- Create database RLS policies
CREATE POLICY "Users can view their own file uploads" ON file_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file uploads" ON file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file uploads" ON file_uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file uploads" ON file_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 5. CREATE TRIGGERS
-- ========================================

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_file_uploads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_file_uploads_updated_at
  BEFORE UPDATE ON file_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_file_uploads_updated_at();

-- ========================================
-- 6. VERIFICATION QUERIES
-- ========================================

-- Verify the storage bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at,
  updated_at
FROM storage.buckets 
WHERE id = 'legacy-files';

-- Show storage policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND qual LIKE '%legacy-files%'
ORDER BY policyname;

-- Verify the database table structure
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'file_uploads' 
ORDER BY ordinal_position;

-- Show database policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'file_uploads'
ORDER BY policyname;

-- Show success message
SELECT 'File uploads system completely fixed! Storage bucket and database table are ready.' as status; 