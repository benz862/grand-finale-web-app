-- Quick Fix: Disable RLS temporarily to allow file uploads
-- This is a temporary solution - run the full fix_file_uploads_storage.sql later

-- Disable RLS on file_uploads_multimedia table
ALTER TABLE file_uploads_multimedia DISABLE ROW LEVEL SECURITY;

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'legacy-files',
  'legacy-files',
  true,
  104857600, -- 100MB limit
  ARRAY[
    'video/mp4', 'video/mov', 'video/avi', 'video/mkv',
    'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac',
    'application/pdf', 'image/jpeg', 'image/png', 'image/gif',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv', 'application/rtf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Grant permissions
GRANT ALL ON file_uploads_multimedia TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- Verify
SELECT 'Quick fix applied - RLS disabled' as status;
