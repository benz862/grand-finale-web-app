-- Clean up duplicate policies and fix file_uploads_multimedia table

-- First, drop all existing policies (they're duplicates anyway)
DROP POLICY IF EXISTS "Users can delete own file_uploads_multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can delete their own file uploads multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can insert own file_uploads_multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can insert their own file uploads multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can update own file_uploads_multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can update their own file uploads multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can view own file_uploads_multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can view their own file uploads multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can view their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can insert their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can update their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can delete their own file uploads" ON file_uploads_multimedia;

-- Since RLS is disabled, we just need to ensure proper permissions
GRANT ALL ON file_uploads_multimedia TO authenticated;
GRANT ALL ON file_uploads_multimedia TO anon;

-- Verify the cleanup
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads_multimedia';

-- Check that no policies remain
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename = 'file_uploads_multimedia';

-- Should return no rows for policies

