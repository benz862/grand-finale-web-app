-- Check existing file upload tables schema
-- Run this in your Supabase SQL Editor

-- 1. Check file_uploads table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'file_uploads' 
ORDER BY ordinal_position;

-- 2. Check file_uploads_multimedia table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'file_uploads_multimedia' 
ORDER BY ordinal_position;

-- 3. Check if there's any existing data
SELECT 'file_uploads' as table_name, COUNT(*) as record_count FROM file_uploads
UNION ALL
SELECT 'file_uploads_multimedia' as table_name, COUNT(*) as record_count FROM file_uploads_multimedia;

-- 4. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('file_uploads', 'file_uploads_multimedia'); 