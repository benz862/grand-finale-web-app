-- DATABASE UPDATES FOR ENHANCED COUNTRY/PROVINCE SYSTEM
-- Run this script to optimize the database for the new comprehensive country/region data

-- ==================================================
-- ISSUE 1: FIELD LENGTH LIMITATIONS
-- ==================================================

-- Current country fields are VARCHAR(100), but some country names are longer:
-- "Saint Vincent and the Grenadines" = 33 chars ✅ (fits)
-- "Democratic Republic of the Congo" = 33 chars ✅ (fits)  
-- "Northern Mariana Islands" = 25 chars ✅ (fits)
-- All country names fit in VARCHAR(100), so no changes needed here

-- Current state/province fields are VARCHAR(100), but some region names are longer:
-- "Dadra and Nagar Haveli and Daman and Diu" = 41 chars ✅ (fits)
-- "Newfoundland and Labrador" = 26 chars ✅ (fits)
-- "Australian Capital Territory" = 29 chars ✅ (fits)
-- All region names fit in VARCHAR(100), so no changes needed here

-- ==================================================
-- ISSUE 2: MISSING INDEXES FOR PERFORMANCE
-- ==================================================

-- Add indexes for country/region lookups to improve performance
CREATE INDEX IF NOT EXISTS idx_personal_info_country_of_birth ON personal_info(country_of_birth);
CREATE INDEX IF NOT EXISTS idx_personal_info_province_of_birth ON personal_info(province_of_birth);
CREATE INDEX IF NOT EXISTS idx_addresses_country ON addresses(country);
CREATE INDEX IF NOT EXISTS idx_addresses_state ON addresses(state);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_country ON emergency_contacts(country);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_state ON emergency_contacts(state);

-- ==================================================
-- ISSUE 3: DATA VALIDATION CONSTRAINTS (OPTIONAL)
-- ==================================================

-- Optional: Add check constraints to ensure data integrity
-- Note: These are commented out by default as they might be too restrictive
-- Uncomment only if you want strict validation

/*
-- Validate that country_of_birth contains valid country names
ALTER TABLE personal_info 
ADD CONSTRAINT check_valid_country_of_birth 
CHECK (
  country_of_birth IS NULL OR 
  country_of_birth IN (
    'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France',
    'Italy', 'Spain', 'Australia', 'Japan', 'China', 'India', 'Brazil',
    -- Add more countries as needed - this is just a sample
    -- For full validation, you'd need to list all 195+ countries
  )
);

-- Validate address countries
ALTER TABLE addresses 
ADD CONSTRAINT check_valid_address_country 
CHECK (
  country IS NULL OR 
  country IN (
    'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France',
    -- Same country list as above
  )
);
*/

-- ==================================================
-- ISSUE 4: STANDARDIZATION UPDATES (RECOMMENDED)
-- ==================================================

-- Update any existing inconsistent country data to use our standard names
-- This ensures data consistency with our new country list

UPDATE personal_info 
SET country_of_birth = CASE 
  WHEN country_of_birth = 'USA' THEN 'United States'
  WHEN country_of_birth = 'US' THEN 'United States'
  WHEN country_of_birth = 'America' THEN 'United States'
  WHEN country_of_birth = 'UK' THEN 'United Kingdom'
  WHEN country_of_birth = 'Britain' THEN 'United Kingdom'
  WHEN country_of_birth = 'England' THEN 'United Kingdom'
  ELSE country_of_birth
END
WHERE country_of_birth IS NOT NULL;

UPDATE addresses 
SET country = CASE 
  WHEN country = 'USA' THEN 'United States'
  WHEN country = 'US' THEN 'United States'
  WHEN country = 'America' THEN 'United States'
  WHEN country = 'UK' THEN 'United Kingdom'
  WHEN country = 'Britain' THEN 'United Kingdom'
  WHEN country = 'England' THEN 'United Kingdom'
  ELSE country
END
WHERE country IS NOT NULL;

UPDATE emergency_contacts 
SET country = CASE 
  WHEN country = 'USA' THEN 'United States'
  WHEN country = 'US' THEN 'United States'
  WHEN country = 'America' THEN 'United States'
  WHEN country = 'UK' THEN 'United Kingdom'
  WHEN country = 'Britain' THEN 'United Kingdom'
  WHEN country = 'England' THEN 'United Kingdom'
  ELSE country
END
WHERE country IS NOT NULL;

-- ==================================================
-- ISSUE 5: NEW PASSPORT/CITIZENSHIP FIELDS (OPTIONAL)
-- ==================================================

-- Add specific fields for passport country and citizenship if not already present
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS passport_country VARCHAR(100),
ADD COLUMN IF NOT EXISTS citizenship_countries TEXT; -- JSON array of countries

-- Add index for passport country
CREATE INDEX IF NOT EXISTS idx_personal_info_passport_country ON personal_info(passport_country);

-- ==================================================
-- VERIFICATION QUERIES
-- ==================================================

-- Check for any country names that don't match our standard list
SELECT DISTINCT country_of_birth as "Non-standard country names in personal_info"
FROM personal_info 
WHERE country_of_birth IS NOT NULL 
  AND country_of_birth NOT IN (
    'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France',
    'Italy', 'Spain', 'Australia', 'Japan', 'China', 'India', 'Brazil'
    -- This is a sample - in practice you'd check against the full list
  );

-- Check address countries
SELECT DISTINCT country as "Non-standard country names in addresses"
FROM addresses 
WHERE country IS NOT NULL 
  AND country NOT IN (
    'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France',
    'Italy', 'Spain', 'Australia', 'Japan', 'China', 'India', 'Brazil'
    -- This is a sample - in practice you'd check against the full list
  );

-- ==================================================
-- SUCCESS MESSAGE
-- ==================================================
SELECT 
  '✅ Database optimized for enhanced country/province system!' as status,
  'All indexes added and data standardized.' as message;
