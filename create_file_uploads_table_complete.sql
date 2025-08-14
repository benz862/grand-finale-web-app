-- Create file_uploads table with correct schema
-- Run this in your Supabase SQL Editor

-- Drop existing table if it exists (to recreate with correct schema)
DROP TABLE IF EXISTS file_uploads CASCADE;

-- Create file_uploads table with all necessary columns
CREATE TABLE file_uploads (
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

-- Create indexes for better performance
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);
CREATE INDEX idx_file_uploads_file_type ON file_uploads(file_type);

-- Enable Row Level Security (RLS)
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own file uploads" ON file_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own file uploads" ON file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file uploads" ON file_uploads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file uploads" ON file_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_file_uploads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_file_uploads_updated_at
  BEFORE UPDATE ON file_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_file_uploads_updated_at();

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'file_uploads' 
ORDER BY ordinal_position;

-- Show the policies
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
SELECT 'File uploads table created successfully with correct schema!' as status; 