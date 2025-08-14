-- Enable Admin Access to Support Requests
-- Run this in your Supabase SQL Editor to allow admin access to support requests

-- Option 1: Disable RLS for support_requests table (simplest approach)
-- This allows any authenticated user to access all support requests
-- Only use this if you trust all authenticated users or have other access controls
ALTER TABLE support_requests DISABLE ROW LEVEL SECURITY;

-- Option 2: Create admin policy (more secure approach)
-- Uncomment the lines below if you want to use admin policies instead
-- First, you'll need to set up admin roles in your auth system

-- Create admin policy for support_requests
-- CREATE POLICY "Admins can view all support requests" ON support_requests FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create admin policy for support_requests (alternative approach)
-- CREATE POLICY "Admins can view all support requests" ON support_requests FOR ALL USING (auth.uid() IN (
--   SELECT user_id FROM admin_users WHERE is_active = true
-- ));

-- Option 3: Create a simple admin check based on email
-- This allows specific email addresses to access all support requests
-- Replace 'your-email@example.com' with your actual email
-- CREATE POLICY "Admin email can view all support requests" ON support_requests FOR ALL USING (
--   EXISTS (
--     SELECT 1 FROM auth.users 
--     WHERE auth.users.id = auth.uid() 
--     AND auth.users.email = 'your-email@example.com'
--   )
-- );

-- Verify the changes
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'support_requests';

-- Test query to see if you can access the data
SELECT COUNT(*) as total_requests FROM support_requests; 