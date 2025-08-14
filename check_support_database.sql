-- Check Support Database Status
-- Run this in your Supabase SQL Editor to see the current state

-- Check if the table exists
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  CASE 
    WHEN tablename = 'support_requests' THEN '✅ Table exists'
    ELSE '❌ Table does not exist'
  END as status
FROM pg_tables 
WHERE tablename = 'support_requests';

-- Check table structure (if table exists)
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'support_requests'
ORDER BY ordinal_position;

-- Check RLS policies (if table exists)
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'support_requests';

-- Check if there are any records (if table exists)
SELECT 
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status = 'open' THEN 1 END) as open_requests,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_requests
FROM support_requests;

-- Show recent requests (if any exist)
SELECT 
  id,
  name,
  email,
  subject,
  category,
  status,
  created_at
FROM support_requests 
ORDER BY created_at DESC 
LIMIT 5; 