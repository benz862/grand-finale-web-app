-- Create test accounts for token purchasing system
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. CREATE LITE TEST ACCOUNT
-- ========================================

-- First, check if the user already exists
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'test.lite@epoxydogs.com') INTO user_exists;
  
  -- Only create if user doesn't exist
  IF NOT user_exists THEN
    -- Insert the user
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
    
    RAISE NOTICE 'Lite test account created successfully';
  ELSE
    RAISE NOTICE 'Lite test account already exists';
  END IF;
END $$;

-- ========================================
-- 2. CREATE STANDARD TEST ACCOUNT
-- ========================================

-- Check if the user already exists
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Check if user exists
  SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'test.standard@epoxydogs.com') INTO user_exists;
  
  -- Only create if user doesn't exist
  IF NOT user_exists THEN
    -- Insert the user
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
    
    RAISE NOTICE 'Standard test account created successfully';
  ELSE
    RAISE NOTICE 'Standard test account already exists';
  END IF;
END $$;

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


