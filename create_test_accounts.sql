-- Create test accounts for token purchasing system
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. CREATE LITE TEST ACCOUNT
-- ========================================

-- Check if Lite test account already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'test.lite@epoxydogs.com') THEN
    -- Insert Lite test user into auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'test.lite@epoxydogs.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test Lite User"}',
  false,
  '',
  '',
  '',
  ''
);

-- ========================================
-- 2. CREATE STANDARD TEST ACCOUNT
-- ========================================

-- Insert Standard test user into auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  'test.standard@epoxydogs.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Test Standard User"}',
  false,
  '',
  '',
  '',
  ''
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

-- ========================================
-- 5. OPTIONAL: ADD SOME TEST DATA
-- ========================================

-- Add some test PDF exports to simulate usage
-- (Uncomment these lines if you want to test with pre-existing usage)

/*
-- Add 1 export for Lite user (hits their limit)
INSERT INTO pdf_exports (user_id, has_watermark, month_year)
SELECT 
  id,
  true, -- watermarked for Lite
  to_char(CURRENT_DATE, 'YYYY-MM')
FROM auth.users 
WHERE email = 'test.lite@epoxydogs.com';

-- Add 3 exports for Standard user (hits their limit)
INSERT INTO pdf_exports (user_id, has_watermark, month_year)
SELECT 
  id,
  false, -- no watermark for Standard
  to_char(CURRENT_DATE, 'YYYY-MM')
FROM auth.users 
WHERE email = 'test.standard@epoxydogs.com';

-- Add the same export 2 more times for Standard user
INSERT INTO pdf_exports (user_id, has_watermark, month_year)
SELECT 
  id,
  false,
  to_char(CURRENT_DATE, 'YYYY-MM')
FROM auth.users 
WHERE email = 'test.standard@epoxydogs.com';

INSERT INTO pdf_exports (user_id, has_watermark, month_year)
SELECT 
  id,
  false,
  to_char(CURRENT_DATE, 'YYYY-MM')
FROM auth.users 
WHERE email = 'test.standard@epoxydogs.com';
*/

-- ========================================
-- 6. VERIFY TEST DATA (if added)
-- ========================================

-- Check PDF export counts for test accounts
SELECT 
  u.email,
  COUNT(pe.id) as exports_this_month,
  CASE 
    WHEN u.email LIKE '%.lite.%' THEN 1
    WHEN u.email LIKE '%.standard.%' THEN 3
    ELSE 0
  END as monthly_limit,
  CASE 
    WHEN u.email LIKE '%.lite.%' THEN true
    WHEN u.email LIKE '%.standard.%' THEN false
    ELSE false
  END as has_watermark
FROM auth.users u
LEFT JOIN pdf_exports pe ON u.id = pe.user_id 
  AND pe.month_year = to_char(CURRENT_DATE, 'YYYY-MM')
WHERE u.email IN ('test.lite@epoxydogs.com', 'test.standard@epoxydogs.com')
GROUP BY u.id, u.email
ORDER BY u.email;
