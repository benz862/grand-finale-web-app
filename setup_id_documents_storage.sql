-- Setup Storage Bucket and Policies for ID Documents
-- This script should be run with admin privileges in Supabase

-- Create storage bucket for ID documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'id-documents', 
    'id-documents', 
    false, -- Private bucket for security
    10485760, -- 10MB file size limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies for id-documents bucket

-- Policy: Users can upload their own documents
-- Files are stored in folders named after user IDs for security
CREATE POLICY "Users can upload own id documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'id-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can view their own documents
CREATE POLICY "Users can view own id documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'id-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can update their own documents
CREATE POLICY "Users can update own id documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'id-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own id documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'id-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Verify bucket creation
SELECT 
    id, 
    name, 
    public, 
    file_size_limit, 
    allowed_mime_types,
    created_at
FROM storage.buckets 
WHERE id = 'id-documents';

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%id documents%';
