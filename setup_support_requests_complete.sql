-- Complete Setup for Support Requests Table
-- This script creates the table and sets up proper RLS policies

-- Step 1: Create the support_requests table
CREATE TABLE IF NOT EXISTS support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_notes TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Step 2: Enable Row Level Security
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop any existing policies (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own support requests" ON support_requests;
DROP POLICY IF EXISTS "Users can insert own support requests" ON support_requests;
DROP POLICY IF EXISTS "Users can update own support requests" ON support_requests;
DROP POLICY IF EXISTS "Allow support request submissions" ON support_requests;

-- Step 4: Create new policies that allow both authenticated and unauthenticated users

-- Policy for INSERT: Allow anyone to submit support requests
CREATE POLICY "Allow support request submissions" ON support_requests
FOR INSERT 
WITH CHECK (true); -- Allow all inserts

-- Policy for SELECT: Users can view their own requests, or if they're admin
CREATE POLICY "Users can view own support requests" ON support_requests
FOR SELECT 
USING (
  user_id IS NULL OR -- Allow viewing requests with no user_id (unauthenticated)
  user_id = auth.uid() OR -- Allow viewing own requests
  auth.uid() IN ( -- Allow admin users to view all (replace with your email)
    SELECT id FROM users WHERE email = 'glenn.donnelly@icloud.com'
  )
);

-- Policy for UPDATE: Users can update their own requests, or if they're admin
CREATE POLICY "Users can update own support requests" ON support_requests
FOR UPDATE 
USING (
  user_id = auth.uid() OR -- Allow updating own requests
  auth.uid() IN ( -- Allow admin users to update all (replace with your email)
    SELECT id FROM users WHERE email = 'glenn.donnelly@icloud.com'
  )
);

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_requests_user_id ON support_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at ON support_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_support_requests_email ON support_requests(email);

-- Step 6: Create updated_at trigger (if the function doesn't exist, create it)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_requests_updated_at 
    BEFORE UPDATE ON support_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Insert a sample record for testing
INSERT INTO support_requests (name, email, subject, category, message, status, priority) VALUES
('Test User', 'test@example.com', 'Test Support Request', 'general', 'This is a test support request to verify the table is working correctly.', 'open', 'medium')
ON CONFLICT DO NOTHING;

-- Step 8: Verify the setup
SELECT 'Table created successfully' as status, COUNT(*) as record_count FROM support_requests;

-- Step 9: Show the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'support_requests';

-- Step 10: Show table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'support_requests'
ORDER BY ordinal_position; 