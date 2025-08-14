-- Confirm email for test user account
-- Run this in your Supabase SQL editor

-- First, let's see what users exist
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email LIKE '%testuser%' OR email LIKE '%grandfinale%';

-- Then confirm the email for the test user
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'testuser@grandfinale.com';

-- Verify the update worked
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'testuser@grandfinale.com'; 