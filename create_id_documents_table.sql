-- Create ID Documents table for storing uploaded identification documents
-- This table will store metadata about uploaded ID documents with references to Supabase Storage

CREATE TABLE IF NOT EXISTS id_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('nationalId', 'passport', 'driverLicense', 'greenCard', 'immigrationDoc')),
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    storage_path VARCHAR(500) NOT NULL, -- Path in Supabase Storage
    file_url TEXT, -- Direct URL to the file
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by user and document type
CREATE INDEX IF NOT EXISTS idx_id_documents_user_type ON id_documents(user_id, document_type);
CREATE INDEX IF NOT EXISTS idx_id_documents_upload_date ON id_documents(upload_date);

-- Add RLS (Row Level Security) policies
ALTER TABLE id_documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own documents
CREATE POLICY "Users can view own id documents" ON id_documents
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert own id documents" ON id_documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update own id documents" ON id_documents
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete own id documents" ON id_documents
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_id_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_id_documents_updated_at
    BEFORE UPDATE ON id_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_id_documents_updated_at();

-- Create storage bucket for ID documents if it doesn't exist
-- Note: This requires admin privileges in Supabase
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('id-documents', 'id-documents', false)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies for id-documents bucket
-- These should be run after creating the bucket

-- Policy: Users can upload their own documents
-- CREATE POLICY "Users can upload own id documents" ON storage.objects
--     FOR INSERT WITH CHECK (
--         bucket_id = 'id-documents' AND 
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- Policy: Users can view their own documents
-- CREATE POLICY "Users can view own id documents" ON storage.objects
--     FOR SELECT USING (
--         bucket_id = 'id-documents' AND 
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- Policy: Users can update their own documents
-- CREATE POLICY "Users can update own id documents" ON storage.objects
--     FOR UPDATE USING (
--         bucket_id = 'id-documents' AND 
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- Policy: Users can delete their own documents
-- CREATE POLICY "Users can delete own id documents" ON storage.objects
--     FOR DELETE USING (
--         bucket_id = 'id-documents' AND 
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- Grant necessary permissions
GRANT ALL ON id_documents TO authenticated;

-- Add comment to table
COMMENT ON TABLE id_documents IS 'Stores metadata for uploaded identification documents with references to Supabase Storage';
COMMENT ON COLUMN id_documents.document_type IS 'Type of ID document: nationalId, passport, driverLicense, greenCard, immigrationDoc';
COMMENT ON COLUMN id_documents.storage_path IS 'Path to file in Supabase Storage bucket';
COMMENT ON COLUMN id_documents.file_url IS 'Direct URL to access the file (generated after upload)';
