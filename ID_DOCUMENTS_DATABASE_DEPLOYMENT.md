# ID Documents Database Deployment Guide

## Overview
This guide covers the database schema changes needed to support ID document uploads with Supabase Storage integration.

## Required Changes

### 1. Database Table Creation
Run the `create_id_documents_table.sql` script to create the main table:

```sql
-- Execute this in Supabase SQL Editor
\i create_id_documents_table.sql
```

### 2. Storage Bucket Setup
Run the `setup_id_documents_storage.sql` script to create the storage bucket and policies:

```sql
-- Execute this in Supabase SQL Editor (requires admin privileges)
\i setup_id_documents_storage.sql
```

## Manual Steps (if scripts fail)

### Create Table Manually
```sql
CREATE TABLE IF NOT EXISTS id_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('nationalId', 'passport', 'driverLicense', 'greenCard', 'immigrationDoc')),
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_url TEXT,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Enable RLS and Create Policies
```sql
-- Enable RLS
ALTER TABLE id_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own id documents" ON id_documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own id documents" ON id_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own id documents" ON id_documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own id documents" ON id_documents
    FOR DELETE USING (auth.uid() = user_id);
```

### Create Storage Bucket
```sql
-- Create bucket (requires admin privileges)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'id-documents', 
    'id-documents', 
    false,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
);
```

### Create Storage Policies
```sql
-- Storage policies
CREATE POLICY "Users can upload own id documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'id-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own id documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'id-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own id documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'id-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own id documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'id-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
```

## Verification Steps

### 1. Check Table Creation
```sql
-- Verify table exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'id_documents';

-- Check table structure
\d id_documents
```

### 2. Check RLS Policies
```sql
-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'id_documents';

-- Check policies
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'id_documents';
```

### 3. Check Storage Bucket
```sql
-- Verify bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets 
WHERE id = 'id-documents';

-- Check storage policies
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%id documents%';
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure you're running with admin privileges for storage bucket creation
2. **Sequence Error**: The table uses UUID, so no sequence is needed
3. **Policy Conflicts**: Drop existing policies before creating new ones
4. **Storage Bucket Already Exists**: Use `ON CONFLICT` in the INSERT statement

### Error Resolution

#### If table creation fails:
```sql
-- Drop table if it exists and recreate
DROP TABLE IF EXISTS id_documents CASCADE;
-- Then run the create table script again
```

#### If storage policies conflict:
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can upload own id documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own id documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own id documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own id documents" ON storage.objects;
-- Then create new policies
```

#### If bucket already exists:
```sql
-- Update existing bucket
UPDATE storage.buckets 
SET public = false, 
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
WHERE id = 'id-documents';
```

## Security Considerations

1. **Private Bucket**: The storage bucket is set to private for security
2. **User Isolation**: Files are stored in user-specific folders
3. **RLS Policies**: All database operations are restricted to user's own data
4. **File Type Validation**: Only specific file types are allowed
5. **Size Limits**: 10MB file size limit per document

## Testing

After deployment, test the following:

1. **Upload Test**: Try uploading a document through the UI
2. **Access Test**: Verify the document can be accessed via the generated URL
3. **Delete Test**: Test document deletion functionality
4. **PDF Generation**: Verify QR codes work in generated PDFs
5. **Cross-User Isolation**: Ensure users can't access other users' documents

## Rollback Plan

If issues occur, you can rollback by:

```sql
-- Drop storage policies
DROP POLICY IF EXISTS "Users can upload own id documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own id documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own id documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own id documents" ON storage.objects;

-- Drop table
DROP TABLE IF EXISTS id_documents CASCADE;

-- Remove bucket (be careful - this deletes all files)
DELETE FROM storage.buckets WHERE id = 'id-documents';
```

