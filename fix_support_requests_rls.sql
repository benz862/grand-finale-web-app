-- Fix RLS policies for support_requests table to allow both authenticated and unauthenticated users

-- First, let's check the current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'support_requests';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own support requests" ON support_requests;
DROP POLICY IF EXISTS "Users can view own support requests" ON support_requests;
DROP POLICY IF EXISTS "Users can update own support requests" ON support_requests;

-- Create new policies that allow both authenticated and unauthenticated users

-- Policy for INSERT: Allow anyone to insert support requests
CREATE POLICY "Allow support request submissions" ON support_requests
FOR INSERT 
WITH CHECK (true); -- Allow all inserts

-- Policy for SELECT: Users can view their own requests, or if they're admin
CREATE POLICY "Users can view own support requests" ON support_requests
FOR SELECT 
USING (
  user_id IS NULL OR -- Allow viewing requests with no user_id (unauthenticated)
  user_id = auth.uid() OR -- Allow viewing own requests
  auth.uid() IN ( -- Allow admin users to view all
    SELECT id FROM users WHERE email = 'glenn.donnelly@icloud.com' -- Replace with your admin email
  )
);

-- Policy for UPDATE: Users can update their own requests, or if they're admin
CREATE POLICY "Users can update own support requests" ON support_requests
FOR UPDATE 
USING (
  user_id = auth.uid() OR -- Allow updating own requests
  auth.uid() IN ( -- Allow admin users to update all
    SELECT id FROM users WHERE email = 'glenn.donnelly@icloud.com' -- Replace with your admin email
  )
);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'support_requests';

-- Test the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'support_requests'
ORDER BY ordinal_position;

-- Check if there are any existing support requests
SELECT COUNT(*) as total_requests FROM support_requests; 