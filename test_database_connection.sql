-- Test script to verify medical_info table setup
-- Run this in Supabase SQL Editor

-- Check if table exists
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'medical_info'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'medical_info';

-- Check if policies exist
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'medical_info';

-- Test insert (this should work if everything is set up correctly)
-- Note: Replace 'your-user-id-here' with an actual user ID from auth.users
-- SELECT gen_random_uuid() as test_user_id; 