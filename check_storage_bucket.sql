-- Check Storage Bucket and RLS Status

-- Check if legacy-files bucket exists
SELECT 
  id,
  name,
  public,
  file_size_limit,
  created_at
FROM storage.buckets 
WHERE id = 'legacy-files';

-- Check RLS status on file_uploads_multimedia table
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads_multimedia';

-- Check existing RLS policies
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
WHERE tablename = 'file_uploads_multimedia';

-- Check storage policies
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
WHERE tablename = 'objects' AND schemaname = 'storage'; 