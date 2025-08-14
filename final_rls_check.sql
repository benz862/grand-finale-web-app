-- Final RLS Check and Fix
-- Let's see exactly what's happening

-- 1. Check current RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'file_uploads_multimedia';

-- 2. Check ALL policies on this table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'file_uploads_multimedia';

-- 3. Check if there are any triggers that might be causing issues
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'file_uploads_multimedia';

-- 4. Check table permissions
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'file_uploads_multimedia';

-- 5. If there are still policies, drop them ALL
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'file_uploads_multimedia'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON file_uploads_multimedia', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- 6. Ensure RLS is disabled
ALTER TABLE file_uploads_multimedia DISABLE ROW LEVEL SECURITY;

-- 7. Grant all permissions
GRANT ALL ON file_uploads_multimedia TO authenticated;
GRANT ALL ON file_uploads_multimedia TO anon;
GRANT ALL ON file_uploads_multimedia TO service_role;

-- 8. Final verification
SELECT 'RLS Status:' as info, rowsecurity::text as value FROM pg_tables WHERE tablename = 'file_uploads_multimedia'
UNION ALL
SELECT 'Policy Count:' as info, COUNT(*)::text as value FROM pg_policies WHERE tablename = 'file_uploads_multimedia';
