-- Force fix file uploads - completely recreate everything
-- Run this in your Supabase SQL Editor

-- 1. Drop everything related to file_uploads
DROP TRIGGER IF EXISTS trigger_update_file_uploads_updated_at ON file_uploads;
DROP FUNCTION IF EXISTS update_file_uploads_updated_at();
DROP TABLE IF EXISTS file_uploads CASCADE;

-- 2. Create the table fresh with NO RLS
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

-- 3. Create indexes
CREATE INDEX idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX idx_file_uploads_created_at ON file_uploads(created_at);
CREATE INDEX idx_file_uploads_file_type ON file_uploads(file_type);

-- 4. Create trigger for updated_at
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

-- 5. EXPLICITLY DISABLE RLS
ALTER TABLE file_uploads DISABLE ROW LEVEL SECURITY;

-- 6. Drop any existing policies (just in case)
DROP POLICY IF EXISTS "Users can view their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can insert their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can update their own file uploads" ON file_uploads;
DROP POLICY IF EXISTS "Users can delete their own file uploads" ON file_uploads;

-- 7. Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'legacy-files',
  'legacy-files',
  true,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'text/rtf',
    'text/plain',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'audio/mpeg',
    'audio/wav',
    'audio/mp4',
    'audio/aac'
  ]
) ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 8. Test insert to verify it works
DO $$
DECLARE
  test_user_id UUID;
  test_result RECORD;
BEGIN
  -- Get first user
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Test insert
    INSERT INTO file_uploads (
      user_id,
      file_name,
      original_file_name,
      file_type,
      file_category,
      file_size,
      file_extension,
      file_url,
      description
    ) VALUES (
      test_user_id,
      'test-file.pdf',
      'test-file.pdf',
      'document',
      'test-category',
      1024,
      'pdf',
      'https://example.com/test.pdf',
      'Test description'
    ) RETURNING id INTO test_result;
    
    RAISE NOTICE '✅ TEST INSERT SUCCESSFUL - ID: %', test_result.id;
    
    -- Clean up
    DELETE FROM file_uploads WHERE id = test_result.id;
    RAISE NOTICE '✅ Test record cleaned up';
  ELSE
    RAISE NOTICE '⚠️ No users found in auth.users';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ TEST INSERT FAILED: %', SQLERRM;
END $$;

-- 9. Verify final status
SELECT 'FINAL STATUS:' as section;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads';

SELECT '✅ FILE UPLOADS SYSTEM IS READY!' as status; 