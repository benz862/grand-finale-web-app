-- Fix Storage Bucket RLS Policies
-- The error is coming from the storage.objects table, not the database table

-- 1. Check current storage policies for legacy-files
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND qual LIKE '%legacy-files%';

-- 2. Drop existing storage policies for legacy-files
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for QR codes" ON storage.objects;

-- 3. Create new storage policies that allow uploads
CREATE POLICY "Allow authenticated uploads to legacy-files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'legacy-files' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated access to legacy-files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'legacy-files' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated updates to legacy-files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'legacy-files' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated deletes from legacy-files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'legacy-files' AND 
    auth.role() = 'authenticated'
  );

-- 4. Grant storage permissions
GRANT ALL ON storage.objects TO authenticated;

-- 5. Verify the fix
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND qual LIKE '%legacy-files%';

