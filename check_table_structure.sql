-- Check and fix file_uploads_multimedia table structure

-- 1. Check current table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'file_uploads_multimedia'
ORDER BY ordinal_position;

-- 2. Check if user_id column exists
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.columns 
  WHERE table_name = 'file_uploads_multimedia' 
  AND column_name = 'user_id'
) as user_id_exists;

-- 3. If user_id doesn't exist, add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'file_uploads_multimedia' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE file_uploads_multimedia ADD COLUMN user_id UUID;
    RAISE NOTICE 'Added user_id column to file_uploads_multimedia';
  ELSE
    RAISE NOTICE 'user_id column already exists';
  END IF;
END $$;

-- 4. Check if id column exists and is primary key
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'file_uploads_multimedia' 
AND column_name = 'id';

-- 5. Check primary key constraint
SELECT 
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'file_uploads_multimedia'
AND tc.constraint_type = 'PRIMARY KEY';

