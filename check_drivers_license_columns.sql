-- Check if driver's license columns exist in personal_info table
-- Run this in your Supabase SQL Editor

-- 1. Check what columns exist in personal_info table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'personal_info' 
AND column_name LIKE '%license%' OR column_name LIKE '%drivers%'
ORDER BY column_name;

-- 2. Check if the columns exist (should show 3 columns)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'personal_info' 
AND column_name IN ('drivers_license', 'license_expiry', 'license_province');

-- 3. Check if there's any driver's license data in the table
SELECT user_id, drivers_license, license_expiry, license_province
FROM personal_info 
WHERE drivers_license IS NOT NULL 
   OR license_expiry IS NOT NULL 
   OR license_province IS NOT NULL;

-- 4. Check all personal_info data for your test user
SELECT * FROM personal_info 
WHERE user_id = '545b8493-8ee8-4523-84fd-8b809da12626'; 