-- Check file_uploads table schema
-- Run this in your Supabase SQL Editor

-- Check if the table exists and its structure
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'file_uploads' 
ORDER BY ordinal_position;

-- Check if there's any data in the table
SELECT COUNT(*) as record_count FROM file_uploads;

-- Show a sample record if any exist
SELECT * FROM file_uploads LIMIT 1; 