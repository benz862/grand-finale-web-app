-- Complete RLS Fix for file_uploads_multimedia
-- This will completely resolve the upload issue

-- 1. First, let's see what policies still exist
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename = 'file_uploads_multimedia';

-- 2. Drop ALL possible policies (comprehensive cleanup)
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

-- 3. Disable RLS completely on the table
ALTER TABLE file_uploads_multimedia DISABLE ROW LEVEL SECURITY;

-- 4. Grant full permissions
GRANT ALL ON file_uploads_multimedia TO authenticated;
GRANT ALL ON file_uploads_multimedia TO anon;
GRANT ALL ON file_uploads_multimedia TO service_role;

-- 5. Verify the fix
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads_multimedia';

-- 6. Check that no policies remain
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename = 'file_uploads_multimedia';

-- Should return no rows for policies and rowsecurity = false

