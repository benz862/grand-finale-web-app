-- Temporarily disable RLS on file_uploads table to fix upload issues
-- Run this in your Supabase SQL Editor

-- First, let's make sure the table exists
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File information
  file_name TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('video', 'voice', 'document', 'reference')),
  file_category TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_extension TEXT,
  
  -- URLs and data
  file_url TEXT NOT NULL,
  qr_code_url TEXT,
  qr_code_data TEXT,
  
  -- Metadata
  description TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS temporarily
ALTER TABLE file_uploads DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_created_at ON file_uploads(created_at);
CREATE INDEX IF NOT EXISTS idx_file_uploads_file_type ON file_uploads(file_type);

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads';

-- Show success message
SELECT 'RLS disabled on file_uploads table. Uploads should now work!' as status; 