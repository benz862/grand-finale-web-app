-- Comprehensive Personal Information Database Check & Fix
-- Run this in Supabase SQL Editor

-- ========================================
-- 1. CHECK ALL REQUIRED TABLES EXIST
-- ========================================

-- Check which tables exist for Personal Information form
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN (
                'personal_info',
                'emergency_contacts', 
                'children',
                'education',
                'document_storage',
                'work_career',
                'security_digital_access',
                'addresses',
                'phones',
                'passports'
            )
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM (
    VALUES 
        ('personal_info'),
        ('emergency_contacts'),
        ('children'),
        ('education'),
        ('document_storage'),
        ('work_career'),
        ('security_digital_access'),
        ('addresses'),
        ('phones'),
        ('passports')
) AS required_tables(table_name)
ORDER BY table_name;

-- ========================================
-- 2. CREATE MISSING TABLES
-- ========================================

-- Create education table if it doesn't exist
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_name VARCHAR(200) NOT NULL,
    degree VARCHAR(200),
    field_of_study VARCHAR(200),
    location VARCHAR(200),
    start_date DATE,
    end_date DATE,
    graduation_date DATE,
    gpa NUMERIC(3,2),
    honors_awards TEXT,
    activities_extracurricular TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create document_storage table if it doesn't exist
CREATE TABLE IF NOT EXISTS document_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    has_document BOOLEAN DEFAULT true,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create work_career table if it doesn't exist
CREATE TABLE IF NOT EXISTS work_career (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(200),
    employer VARCHAR(200),
    employer_address TEXT,
    work_phone VARCHAR(20),
    supervisor_name VARCHAR(200),
    work_notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create security_digital_access table if it doesn't exist
CREATE TABLE IF NOT EXISTS security_digital_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    will_location TEXT,
    unlock_code VARCHAR(200),
    password_manager VARCHAR(200),
    backup_code_storage TEXT,
    key_accounts TEXT,
    digital_docs_location TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create emergency_contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(200) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    custom_relationship VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    phone_alt VARCHAR(20),
    email VARCHAR(255),
    address VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    zip VARCHAR(20),
    country VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create children table if it doesn't exist
CREATE TABLE IF NOT EXISTS children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    child_name VARCHAR(200) NOT NULL,
    child_gender VARCHAR(20),
    child_dob DATE,
    relationship_to_child VARCHAR(100),
    child_contact VARCHAR(200),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create phones table if it doesn't exist
CREATE TABLE IF NOT EXISTS phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone_type VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create passports table if it doesn't exist
CREATE TABLE IF NOT EXISTS passports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    country VARCHAR(100) NOT NULL,
    number VARCHAR(100) NOT NULL,
    expiry DATE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- ========================================
-- 3. ADD MISSING COLUMNS TO personal_info
-- ========================================

-- Add missing columns to personal_info table
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS pronouns VARCHAR(50),
ADD COLUMN IF NOT EXISTS custom_pronoun VARCHAR(100),
ADD COLUMN IF NOT EXISTS relationship_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS spouse_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS spouse_contact VARCHAR(200),
ADD COLUMN IF NOT EXISTS father_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS mother_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS stepfather_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS stepmother_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS religious_affiliation VARCHAR(200),
ADD COLUMN IF NOT EXISTS place_of_worship VARCHAR(200),
ADD COLUMN IF NOT EXISTS clergy_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS clergy_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS clergy_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_rites_desired BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS clergy_present_desired BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS scripture_preferences TEXT,
ADD COLUMN IF NOT EXISTS prayer_style VARCHAR(200),
ADD COLUMN IF NOT EXISTS burial_rituals TEXT,
ADD COLUMN IF NOT EXISTS employment_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- ========================================
-- 4. FIX user_id COLUMNS (MAKE NOT NULL)
-- ========================================

-- Fix user_id columns to be NOT NULL
ALTER TABLE addresses ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE phones ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE emergency_contacts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE children ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE passports ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE education ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE document_storage ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE work_career ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE security_digital_access ALTER COLUMN user_id SET NOT NULL;

-- ========================================
-- 5. ADD INDEXES FOR PERFORMANCE
-- ========================================

-- Add indexes for all tables
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_phones_user_id ON phones(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);
CREATE INDEX IF NOT EXISTS idx_passports_user_id ON passports(user_id);
CREATE INDEX IF NOT EXISTS idx_education_user_id ON education(user_id);
CREATE INDEX IF NOT EXISTS idx_document_storage_user_id ON document_storage(user_id);
CREATE INDEX IF NOT EXISTS idx_work_career_user_id ON work_career(user_id);
CREATE INDEX IF NOT EXISTS idx_security_digital_access_user_id ON security_digital_access(user_id);

-- ========================================
-- 6. SET UP RLS POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_career ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_digital_access ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON addresses;

DROP POLICY IF EXISTS "Users can view their own phones" ON phones;
DROP POLICY IF EXISTS "Users can insert their own phones" ON phones;
DROP POLICY IF EXISTS "Users can update their own phones" ON phones;
DROP POLICY IF EXISTS "Users can delete their own phones" ON phones;

DROP POLICY IF EXISTS "Users can view their own emergency_contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Users can insert their own emergency_contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Users can update their own emergency_contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Users can delete their own emergency_contacts" ON emergency_contacts;

DROP POLICY IF EXISTS "Users can view their own children" ON children;
DROP POLICY IF EXISTS "Users can insert their own children" ON children;
DROP POLICY IF EXISTS "Users can update their own children" ON children;
DROP POLICY IF EXISTS "Users can delete their own children" ON children;

DROP POLICY IF EXISTS "Users can view their own passports" ON passports;
DROP POLICY IF EXISTS "Users can insert their own passports" ON passports;
DROP POLICY IF EXISTS "Users can update their own passports" ON passports;
DROP POLICY IF EXISTS "Users can delete their own passports" ON passports;

DROP POLICY IF EXISTS "Users can view their own education" ON education;
DROP POLICY IF EXISTS "Users can insert their own education" ON education;
DROP POLICY IF EXISTS "Users can update their own education" ON education;
DROP POLICY IF EXISTS "Users can delete their own education" ON education;

DROP POLICY IF EXISTS "Users can view their own document_storage" ON document_storage;
DROP POLICY IF EXISTS "Users can insert their own document_storage" ON document_storage;
DROP POLICY IF EXISTS "Users can update their own document_storage" ON document_storage;
DROP POLICY IF EXISTS "Users can delete their own document_storage" ON document_storage;

DROP POLICY IF EXISTS "Users can view their own work_career" ON work_career;
DROP POLICY IF EXISTS "Users can insert their own work_career" ON work_career;
DROP POLICY IF EXISTS "Users can update their own work_career" ON work_career;
DROP POLICY IF EXISTS "Users can delete their own work_career" ON work_career;

DROP POLICY IF EXISTS "Users can view their own security_digital_access" ON security_digital_access;
DROP POLICY IF EXISTS "Users can insert their own security_digital_access" ON security_digital_access;
DROP POLICY IF EXISTS "Users can update their own security_digital_access" ON security_digital_access;
DROP POLICY IF EXISTS "Users can delete their own security_digital_access" ON security_digital_access;

-- Create RLS policies for addresses
CREATE POLICY "Users can view their own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for phones
CREATE POLICY "Users can view their own phones" ON phones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own phones" ON phones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own phones" ON phones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own phones" ON phones FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for emergency_contacts
CREATE POLICY "Users can view their own emergency_contacts" ON emergency_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own emergency_contacts" ON emergency_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own emergency_contacts" ON emergency_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own emergency_contacts" ON emergency_contacts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for children
CREATE POLICY "Users can view their own children" ON children FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own children" ON children FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own children" ON children FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own children" ON children FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for passports
CREATE POLICY "Users can view their own passports" ON passports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own passports" ON passports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own passports" ON passports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own passports" ON passports FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for education
CREATE POLICY "Users can view their own education" ON education FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own education" ON education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own education" ON education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own education" ON education FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for document_storage
CREATE POLICY "Users can view their own document_storage" ON document_storage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own document_storage" ON document_storage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own document_storage" ON document_storage FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own document_storage" ON document_storage FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for work_career
CREATE POLICY "Users can view their own work_career" ON work_career FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own work_career" ON work_career FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own work_career" ON work_career FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own work_career" ON work_career FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for security_digital_access
CREATE POLICY "Users can view their own security_digital_access" ON security_digital_access FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own security_digital_access" ON security_digital_access FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own security_digital_access" ON security_digital_access FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own security_digital_access" ON security_digital_access FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 7. ADD TRIGGERS FOR updated_at
-- ========================================

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables
DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_phones_updated_at ON phones;
CREATE TRIGGER update_phones_updated_at BEFORE UPDATE ON phones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_emergency_contacts_updated_at ON emergency_contacts;
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_children_updated_at ON children;
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_passports_updated_at ON passports;
CREATE TRIGGER update_passports_updated_at BEFORE UPDATE ON passports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_updated_at ON education;
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_document_storage_updated_at ON document_storage;
CREATE TRIGGER update_document_storage_updated_at BEFORE UPDATE ON document_storage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_work_career_updated_at ON work_career;
CREATE TRIGGER update_work_career_updated_at BEFORE UPDATE ON work_career FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_security_digital_access_updated_at ON security_digital_access;
CREATE TRIGGER update_security_digital_access_updated_at BEFORE UPDATE ON security_digital_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. VERIFICATION
-- ========================================

-- Final verification - show all tables and their column counts
SELECT 
    table_name,
    COUNT(*) as column_count,
    CASE 
        WHEN table_name IN (
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN (
                'personal_info',
                'emergency_contacts', 
                'children',
                'education',
                'document_storage',
                'work_career',
                'security_digital_access',
                'addresses',
                'phones',
                'passports'
            )
        ) THEN 'READY'
        ELSE 'MISSING'
    END as status
FROM information_schema.columns 
WHERE table_name IN (
    'personal_info',
    'emergency_contacts', 
    'children',
    'education',
    'document_storage',
    'work_career',
    'security_digital_access',
    'addresses',
    'phones',
    'passports'
)
GROUP BY table_name
ORDER BY table_name; 