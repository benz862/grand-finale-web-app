-- Fix only the file_uploads_multimedia table RLS policies
-- The storage bucket is already working correctly

-- First, check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads_multimedia';

-- Drop any existing policies on file_uploads_multimedia
DROP POLICY IF EXISTS "Users can view their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can insert their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can update their own file uploads" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can delete their own file uploads" ON file_uploads_multimedia;

-- Create new policies for file_uploads_multimedia table
CREATE POLICY "Users can view their own file uploads" ON file_uploads_multimedia
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file uploads" ON file_uploads_multimedia
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file uploads" ON file_uploads_multimedia
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file uploads" ON file_uploads_multimedia
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON file_uploads_multimedia TO authenticated;

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE tablename = 'file_uploads_multimedia';

