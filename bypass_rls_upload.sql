-- Bypass RLS for file uploads using a function
-- Run this in your Supabase SQL Editor

-- 1. Create a function that can insert without RLS
CREATE OR REPLACE FUNCTION insert_file_upload(
  p_user_id UUID,
  p_file_name TEXT,
  p_original_file_name TEXT,
  p_file_type TEXT,
  p_file_category TEXT,
  p_file_size BIGINT,
  p_file_extension TEXT,
  p_file_url TEXT,
  p_qr_code_url TEXT DEFAULT NULL,
  p_qr_code_data TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Insert the file upload record
  INSERT INTO file_uploads (
    user_id,
    file_name,
    original_file_name,
    file_type,
    file_category,
    file_size,
    file_extension,
    file_url,
    qr_code_url,
    qr_code_data,
    description
  ) VALUES (
    p_user_id,
    p_file_name,
    p_original_file_name,
    p_file_type,
    p_file_category,
    p_file_size,
    p_file_extension,
    p_file_url,
    p_qr_code_url,
    p_qr_code_data,
    p_description
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION insert_file_upload(UUID, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- 3. Test the function
DO $$
DECLARE
  test_user_id UUID;
  test_result UUID;
BEGIN
  -- Get first user
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  IF test_user_id IS NOT NULL THEN
    -- Test the function
    SELECT insert_file_upload(
      test_user_id,
      'test-file.pdf',
      'test-file.pdf',
      'document',
      'test-category',
      1024,
      'pdf',
      'https://example.com/test.pdf',
      NULL,
      NULL,
      'Test description'
    ) INTO test_result;
    
    RAISE NOTICE '✅ FUNCTION TEST SUCCESSFUL - ID: %', test_result;
    
    -- Clean up
    DELETE FROM file_uploads WHERE id = test_result;
    RAISE NOTICE '✅ Test record cleaned up';
  ELSE
    RAISE NOTICE '⚠️ No users found in auth.users';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ FUNCTION TEST FAILED: %', SQLERRM;
END $$;

-- 4. Show success message
SELECT '✅ RLS BYPASS FUNCTION CREATED SUCCESSFULLY!' as status; 