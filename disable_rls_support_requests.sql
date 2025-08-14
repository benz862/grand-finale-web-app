-- Temporarily disable RLS on support_requests table for testing
-- This will allow all operations without authentication requirements

-- Disable RLS
ALTER TABLE support_requests DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'support_requests';

-- Test that we can insert data
-- (This is just for verification - the actual insert will be done by the app)

-- To re-enable RLS later, use:
-- ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY; 