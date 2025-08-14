-- Fix file_uploads table RLS policies
-- Run this in your Supabase SQL Editor

-- First, let's check if the file_uploads table exists and its structure
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'file_uploads' 
ORDER BY ordinal_position;

-- Check if RLS is enabled on the table
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads';

-- Check existing RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'file_uploads';

-- Enable RLS if not already enabled
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can insert their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can update their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can delete their own file uploads" ON file_uploads;

-- Create RLS policies for file_uploads table
CREATE POLICY "Users can view their own file uploads" ON file_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file uploads" ON file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file uploads" ON file_uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file uploads" ON file_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- Verify the policies were created
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
SELECT 'File uploads table RLS policies fixed successfully!' as status; 