-- Diagnostic script to check file uploads system
-- Run this in your Supabase SQL Editor

-- 1. Check if storage bucket exists
SELECT 'STORAGE BUCKET CHECK:' as section;
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'legacy-files';

-- 2. Check storage policies
SELECT 'STORAGE POLICIES:' as section;
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

-- 3. Check if file_uploads table exists
SELECT 'DATABASE TABLE CHECK:' as section;
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'file_uploads' 
ORDER BY ordinal_position;

-- 4. Check database RLS policies
SELECT 'DATABASE RLS POLICIES:' as section;
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'file_uploads'
ORDER BY policyname;

-- 5. Check if RLS is enabled on file_uploads
SELECT 'RLS STATUS:' as section;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads';

-- 6. Check current user authentication
SELECT 'CURRENT USER:' as section;
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role; 