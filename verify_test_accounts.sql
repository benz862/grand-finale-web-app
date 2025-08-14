-- Verify test accounts exist in Supabase
-- Run this in your Supabase SQL Editor

-- ========================================
-- CHECK IF TEST ACCOUNTS EXIST
-- ========================================

SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
    ELSE '❌ Email Not Confirmed'
  END as status
FROM auth.users 
WHERE email IN ('test.lite@epoxydogs.com', 'test.standard@epoxydogs.com')
ORDER BY email;

-- ========================================
-- CHECK PDF EXPORT TABLES EXIST
-- ========================================

-- Check if pdf_exports table exists
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ Table Exists'
    ELSE '❌ Table Missing'
  END as status
FROM information_schema.tables 
WHERE table_name = 'pdf_exports' 
  AND table_schema = 'public';

-- Check if token_purchases table exists
SELECT 
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ Table Exists'
    ELSE '❌ Table Missing'
  END as status
FROM information_schema.tables 
WHERE table_name = 'token_purchases' 
  AND table_schema = 'public';

-- ========================================
-- CHECK CURRENT PDF EXPORT USAGE
-- ========================================

SELECT 
  u.email,
  COALESCE(COUNT(pe.id), 0) as exports_this_month,
  CASE 
    WHEN u.email LIKE '%.lite.%' THEN 1
    WHEN u.email LIKE '%.standard.%' THEN 3
    ELSE 0
  END as monthly_limit,
  CASE 
    WHEN u.email LIKE '%.lite.%' THEN 'Watermarked'
    WHEN u.email LIKE '%.standard.%' THEN 'Clean'
    ELSE 'Unknown'
  END as watermark_type
FROM auth.users u
LEFT JOIN pdf_exports pe ON u.id = pe.user_id 
  AND pe.month_year = to_char(CURRENT_DATE, 'YYYY-MM')
WHERE u.email IN ('test.lite@epoxydogs.com', 'test.standard@epoxydogs.com')
GROUP BY u.id, u.email
ORDER BY u.email;
