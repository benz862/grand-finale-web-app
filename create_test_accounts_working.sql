-- Create test accounts for token purchasing system
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. CREATE LITE TEST ACCOUNT
-- ========================================

-- Create Lite test user using Supabase's user management
SELECT auth.sign_up(
  'test.lite@epoxydogs.com',
  'testpassword123',
  '{"name": "Test Lite User"}'
);

-- ========================================
-- 2. CREATE STANDARD TEST ACCOUNT
-- ========================================

-- Create Standard test user using Supabase's user management
SELECT auth.sign_up(
  'test.standard@epoxydogs.com',
  'testpassword123',
  '{"name": "Test Standard User"}'
);

-- ========================================
-- 3. VERIFY ACCOUNTS CREATED
-- ========================================

-- Check if accounts were created successfully
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email IN ('test.lite@epoxydogs.com', 'test.standard@epoxydogs.com')
ORDER BY email;

-- ========================================
-- 4. TEST ACCOUNT CREDENTIALS
-- ========================================

/*
LITE TEST ACCOUNT:
Email: test.lite@epoxydogs.com
Password: testpassword123
Plan: Lite (1 PDF export/month, watermarked)

STANDARD TEST ACCOUNT:
Email: test.standard@epoxydogs.com
Password: testpassword123
Plan: Standard (3 PDF exports/month, no watermark)
*/


