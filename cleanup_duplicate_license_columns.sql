-- Clean up duplicate driver's license columns
-- Remove the older column names since we're using the newer ones

-- First, verify we have data in the newer columns
SELECT 
    user_id,
    drivers_license_number,
    drivers_license_expiry,
    drivers_license_province
FROM personal_info 
WHERE drivers_license_number IS NOT NULL 
   OR drivers_license_expiry IS NOT NULL 
   OR drivers_license_province IS NOT NULL;

-- Remove the old duplicate columns
ALTER TABLE personal_info 
DROP COLUMN IF EXISTS drivers_license,
DROP COLUMN IF EXISTS license_expiry,
DROP COLUMN IF EXISTS license_province;

-- Verify the cleanup worked
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'personal_info' 
AND (column_name LIKE '%license%' OR column_name LIKE '%drivers%')
ORDER BY column_name; 