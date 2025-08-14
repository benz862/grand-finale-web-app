-- Fix finance_business table schema to match the code
-- This script ensures the table has the correct column names

-- First, check if the table exists and what columns it has
DO $$
BEGIN
    -- Check if finance_business table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'finance_business') THEN
        -- Check if advisor_email column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'finance_business' AND column_name = 'advisor_email') THEN
            -- Add the missing advisor_email column
            ALTER TABLE finance_business ADD COLUMN advisor_email TEXT;
            RAISE NOTICE 'Added advisor_email column to finance_business table';
        ELSE
            RAISE NOTICE 'advisor_email column already exists in finance_business table';
        END IF;
        
        -- Check if advisor_name column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'finance_business' AND column_name = 'advisor_name') THEN
            -- Add the missing advisor_name column
            ALTER TABLE finance_business ADD COLUMN advisor_name TEXT;
            RAISE NOTICE 'Added advisor_name column to finance_business table';
        ELSE
            RAISE NOTICE 'advisor_name column already exists in finance_business table';
        END IF;
        
        -- Check if advisor_phone column exists
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'finance_business' AND column_name = 'advisor_phone') THEN
            -- Add the missing advisor_phone column
            ALTER TABLE finance_business ADD COLUMN advisor_phone TEXT;
            RAISE NOTICE 'Added advisor_phone column to finance_business table';
        ELSE
            RAISE NOTICE 'advisor_phone column already exists in finance_business table';
        END IF;
        
        -- Remove any conflicting financial_advisor_email column if it exists
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'finance_business' AND column_name = 'financial_advisor_email') THEN
            ALTER TABLE finance_business DROP COLUMN financial_advisor_email;
            RAISE NOTICE 'Removed conflicting financial_advisor_email column from finance_business table';
        END IF;
        
    ELSE
        RAISE NOTICE 'finance_business table does not exist - please run the create_finance_business_table.sql script first';
    END IF;
END $$;

-- Verify the table structure
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'finance_business' 
ORDER BY ordinal_position; 