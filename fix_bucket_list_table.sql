-- Fix bucket_list_unfinished_business table - remove duplicate triggers
-- This script will clean up the duplicate triggers that are causing issues

-- Drop the duplicate triggers first
DROP TRIGGER IF EXISTS trigger_update_bucket_list_unfinished_business_updated_at ON bucket_list_unfinished_business;
DROP TRIGGER IF EXISTS update_bucket_list_unfinished_business_updated_at ON bucket_list_unfinished_business;

-- Create the correct trigger (only one)
CREATE TRIGGER update_bucket_list_unfinished_business_updated_at 
BEFORE UPDATE ON bucket_list_unfinished_business 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Verify the table structure and triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'bucket_list_unfinished_business';

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bucket_list_unfinished_business'
ORDER BY ordinal_position;
