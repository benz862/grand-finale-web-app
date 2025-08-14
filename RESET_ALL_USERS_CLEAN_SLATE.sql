-- COMPLETE DATABASE RESET SCRIPT
-- ⚠️  WARNING: This will DELETE ALL USER DATA ⚠️
-- This script removes ALL users and associated data to start completely fresh
-- Use with EXTREME caution - this action is IRREVERSIBLE

-- ==================================================
-- SAFETY CHECK - Uncomment the line below to proceed
-- ==================================================
-- SET confirmation = 'I_UNDERSTAND_THIS_WILL_DELETE_ALL_DATA';

-- Verify confirmation (comment out to bypass safety)
DO $$
BEGIN
    IF current_setting('confirmation', true) != 'I_UNDERSTAND_THIS_WILL_DELETE_ALL_DATA' THEN
        RAISE EXCEPTION 'Safety check failed. Please read the warning and set confirmation variable.';
    END IF;
END $$;

-- ==================================================
-- STEP 1: DISABLE ROW LEVEL SECURITY TEMPORARILY
-- ==================================================
ALTER TABLE personal_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE phones DISABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE children DISABLE ROW LEVEL SECURITY;
ALTER TABLE name_change_requests DISABLE ROW LEVEL SECURITY;

-- ==================================================
-- STEP 2: DELETE ALL USER-RELATED DATA
-- ==================================================

-- Delete name change requests first (has foreign keys)
WITH deleted_ncr AS (DELETE FROM name_change_requests RETURNING *)
SELECT 'Deleted ' || COUNT(*) || ' name change requests' FROM deleted_ncr;

-- Delete children data
WITH deleted_children AS (DELETE FROM children RETURNING *)
SELECT 'Deleted ' || COUNT(*) || ' children records' FROM deleted_children;

-- Delete emergency contacts
WITH deleted_contacts AS (DELETE FROM emergency_contacts RETURNING *)
SELECT 'Deleted ' || COUNT(*) || ' emergency contacts' FROM deleted_contacts;

-- Delete phone numbers
WITH deleted_phones AS (DELETE FROM phones RETURNING *)
SELECT 'Deleted ' || COUNT(*) || ' phone numbers' FROM deleted_phones;

-- Delete addresses
WITH deleted_addresses AS (DELETE FROM addresses RETURNING *)
SELECT 'Deleted ' || COUNT(*) || ' addresses' FROM deleted_addresses;

-- Delete personal information
WITH deleted_personal AS (DELETE FROM personal_info RETURNING *)
SELECT 'Deleted ' || COUNT(*) || ' personal info records' FROM deleted_personal;

-- Delete file uploads (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'file_uploads') THEN
        EXECUTE 'WITH deleted_files AS (DELETE FROM file_uploads RETURNING *) SELECT ''Deleted '' || COUNT(*) || '' file uploads'' FROM deleted_files';
    ELSE
        RAISE NOTICE 'file_uploads table does not exist, skipping';
    END IF;
END $$;

-- Delete storage objects (if using Supabase storage)
-- Note: This requires storage admin privileges
-- WITH deleted_storage AS (DELETE FROM storage.objects RETURNING *)
-- SELECT 'Deleted ' || COUNT(*) || ' storage objects' FROM deleted_storage;

-- ==================================================
-- STEP 3: DELETE USERS FROM APPLICATION TABLES
-- ==================================================

-- Delete from application users table (if different from auth.users)
WITH deleted_app_users AS (DELETE FROM users RETURNING *)
SELECT 'Deleted ' || COUNT(*) || ' users from application users table' FROM deleted_app_users;

-- ==================================================
-- STEP 4: DELETE AUTH USERS (SUPABASE AUTHENTICATION)
-- ==================================================

-- Delete all users from Supabase auth system
-- Note: This cascades to all related auth data
WITH deleted_auth_users AS (DELETE FROM auth.users RETURNING *)
SELECT 'Deleted ' || COUNT(*) || ' authentication users' FROM deleted_auth_users;

-- Clean up any orphaned auth sessions
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'sessions') THEN
        WITH deleted_sessions AS (DELETE FROM auth.sessions RETURNING *)
        SELECT 'Deleted ' || COUNT(*) || ' auth sessions' FROM deleted_sessions;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'refresh_tokens') THEN
        WITH deleted_tokens AS (DELETE FROM auth.refresh_tokens RETURNING *)
        SELECT 'Deleted ' || COUNT(*) || ' refresh tokens' FROM deleted_tokens;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'audit_log_entries') THEN
        WITH deleted_audit AS (DELETE FROM auth.audit_log_entries RETURNING *)
        SELECT 'Deleted ' || COUNT(*) || ' audit log entries' FROM deleted_audit;
    END IF;
END $$;

-- ==================================================
-- STEP 5: RESET AUTO-INCREMENT SEQUENCES
-- ==================================================

-- Reset sequences for tables that use them
ALTER SEQUENCE IF EXISTS personal_info_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS addresses_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS phones_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS emergency_contacts_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS children_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS name_change_requests_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS file_uploads_id_seq RESTART WITH 1;

-- ==================================================
-- STEP 6: RE-ENABLE ROW LEVEL SECURITY
-- ==================================================
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE name_change_requests ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- STEP 7: VERIFICATION - CONFIRM ALL DATA DELETED
-- ==================================================

-- Count remaining records in each table
SELECT 
    'auth.users' as table_name,
    COUNT(*) as remaining_records
FROM auth.users
UNION ALL
SELECT 
    'users' as table_name,
    COUNT(*) as remaining_records
FROM users
UNION ALL
SELECT 
    'personal_info' as table_name,
    COUNT(*) as remaining_records
FROM personal_info
UNION ALL
SELECT 
    'addresses' as table_name,
    COUNT(*) as remaining_records
FROM addresses
UNION ALL
SELECT 
    'phones' as table_name,
    COUNT(*) as remaining_records
FROM phones
UNION ALL
SELECT 
    'emergency_contacts' as table_name,
    COUNT(*) as remaining_records
FROM emergency_contacts
UNION ALL
SELECT 
    'children' as table_name,
    COUNT(*) as remaining_records
FROM children
UNION ALL
SELECT 
    'name_change_requests' as table_name,
    COUNT(*) as remaining_records
FROM name_change_requests
ORDER BY table_name;

-- ==================================================
-- STEP 8: CREATE FRESH ADMIN USER (OPTIONAL)
-- ==================================================

-- Uncomment the section below if you want to create a fresh admin user
/*
-- Insert a new admin user
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@skilledbinder.com',
    crypt('admin123', gen_salt('bf')), -- Change this password!
    NOW(),
    NOW(),
    NOW(),
    'authenticated'
);

-- Add to users table
INSERT INTO users (id, email, created_at, updated_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@skilledbinder.com',
    NOW(),
    NOW()
);

-- Add basic personal info for admin
INSERT INTO personal_info (
    user_id,
    legal_first_name,
    legal_last_name,
    preferred_name,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Admin',
    'User',
    'Administrator',
    NOW(),
    NOW()
);
*/

-- ==================================================
-- SUCCESS MESSAGE
-- ==================================================
SELECT 
    '🎉 DATABASE RESET COMPLETE! 🎉' as status,
    'All user data has been removed.' as message,
    'You can now start fresh with new users.' as next_step;

-- ==================================================
-- SAFETY REMINDER
-- ==================================================
SELECT 
    '⚠️  REMINDER ⚠️' as warning,
    'This action was IRREVERSIBLE' as note,
    'All user accounts and data have been permanently deleted' as confirmation;
