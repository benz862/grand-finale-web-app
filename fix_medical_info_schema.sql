-- Fix medical_info table schema by adding missing columns
-- Run this in Supabase SQL Editor

-- Add missing columns to medical_info table
ALTER TABLE medical_info 
ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- Verify the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'medical_info'
ORDER BY ordinal_position;

-- Test the table structure
SELECT * FROM medical_info LIMIT 1; 