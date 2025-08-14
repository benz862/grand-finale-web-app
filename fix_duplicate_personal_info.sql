-- Fix duplicate personal_info records and add unique constraint
-- This script will clean up existing duplicates and prevent future ones

-- Step 1: Identify duplicate records
SELECT 
  user_id,
  COUNT(*) as record_count,
  array_agg(id) as record_ids,
  array_agg(created_at) as created_dates
FROM personal_info 
GROUP BY user_id 
HAVING COUNT(*) > 1
ORDER BY user_id;

-- Step 2: Keep only the most recent record for each user (or the first one if same timestamp)
-- Delete duplicate records, keeping the one with the latest updated_at or created_at
DELETE FROM personal_info 
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY user_id 
             ORDER BY 
               COALESCE(updated_at, created_at) DESC,
               created_at DESC
           ) as rn
    FROM personal_info
  ) ranked
  WHERE rn > 1
);

-- Step 3: Add unique constraint on user_id to prevent future duplicates
-- First, drop any existing constraint if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'personal_info_user_id_unique' 
    AND table_name = 'personal_info'
  ) THEN
    ALTER TABLE personal_info DROP CONSTRAINT personal_info_user_id_unique;
  END IF;
END $$;

-- Add the unique constraint
ALTER TABLE personal_info 
ADD CONSTRAINT personal_info_user_id_unique 
UNIQUE (user_id);

-- Step 4: Verify the fix
SELECT 
  user_id,
  COUNT(*) as record_count
FROM personal_info 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- If this returns no rows, the fix was successful!

-- Step 5: Show final state
SELECT 
  id,
  user_id,
  legal_first_name,
  legal_last_name,
  created_at,
  updated_at
FROM personal_info 
ORDER BY user_id, created_at; 