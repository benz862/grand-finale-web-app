-- Check current status of file uploads system
-- Run this in your Supabase SQL Editor

-- 1. Check if file_uploads table exists and its RLS status
SELECT 'FILE UPLOADS TABLE STATUS:' as section;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads';

-- 2. Check table structure
SELECT 'TABLE STRUCTURE:' as section;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'file_uploads' 
ORDER BY ordinal_position;

-- 3. Check if there are any RLS policies on file_uploads
SELECT 'RLS POLICIES ON FILE_UPLOADS:' as section;
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'file_uploads';

-- 4. Check storage bucket status
SELECT 'STORAGE BUCKET STATUS:' as section;
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'legacy-files';

-- 5. Check storage policies
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

-- 6. Check current user authentication
SELECT 'CURRENT USER:' as section;
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- 7. Try to insert a test record to see what happens
SELECT 'TESTING INSERT:' as section;
DO $$
DECLARE
  test_user_id UUID;
  insert_result RECORD;
BEGIN
  -- Get a test user ID (first user in auth.users)
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Try to insert a test record
    INSERT INTO file_uploads (
      user_id,
      file_name,
      original_file_name,
      file_type,
      file_category,
      file_size,
      file_extension,
      file_url,
      description
    ) VALUES (
      test_user_id,
      'test-file.pdf',
      'test-file.pdf',
      'document',
      'test-category',
      1024,
      'pdf',
      'https://example.com/test.pdf',
      'Test description'
    ) RETURNING id INTO insert_result;
    
    RAISE NOTICE 'Test insert SUCCESSFUL - ID: %', insert_result.id;
    
    -- Clean up the test record
    DELETE FROM file_uploads WHERE id = insert_result.id;
    RAISE NOTICE 'Test record cleaned up';
  ELSE
    RAISE NOTICE 'No users found in auth.users table';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Test insert FAILED: %', SQLERRM;
END $$; 