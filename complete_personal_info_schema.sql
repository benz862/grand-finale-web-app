-- COMPLETE PERSONAL INFO SCHEMA UPDATE
-- This adds ALL missing fields from Section 1 Personal Information Form
-- Run this AFTER creating the name_change_requests table

-- 1. Add all missing columns to personal_info table
ALTER TABLE personal_info 
-- Name & Identity fields (already exist, but adding middle name if missing)
ADD COLUMN IF NOT EXISTS legal_middle_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS nickname VARCHAR(100),
ADD COLUMN IF NOT EXISTS gender VARCHAR(50),
ADD COLUMN IF NOT EXISTS pronouns VARCHAR(50),
ADD COLUMN IF NOT EXISTS custom_pronoun VARCHAR(100),

-- Birth & Location details
ADD COLUMN IF NOT EXISTS country_of_birth VARCHAR(100),
ADD COLUMN IF NOT EXISTS province_of_birth VARCHAR(100), 
ADD COLUMN IF NOT EXISTS city_of_birth VARCHAR(100),
ADD COLUMN IF NOT EXISTS citizenships TEXT, -- Can hold multiple citizenships

-- Language details
ADD COLUMN IF NOT EXISTS primary_language VARCHAR(100),
ADD COLUMN IF NOT EXISTS secondary_language VARCHAR(100),

-- Government IDs & Documents
ADD COLUMN IF NOT EXISTS ssn VARCHAR(50), -- Social Security Number
ADD COLUMN IF NOT EXISTS passport_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS passport_expiry DATE,
ADD COLUMN IF NOT EXISTS drivers_license VARCHAR(50),
ADD COLUMN IF NOT EXISTS license_expiry DATE,
ADD COLUMN IF NOT EXISTS license_province VARCHAR(100),

-- Family Information
ADD COLUMN IF NOT EXISTS father_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS mother_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS stepfather_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS stepmother_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS relationship_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS spouse_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS spouse_contact VARCHAR(200),

-- Religious & Spiritual Information
ADD COLUMN IF NOT EXISTS religious_affiliation VARCHAR(100),
ADD COLUMN IF NOT EXISTS place_of_worship VARCHAR(200),
ADD COLUMN IF NOT EXISTS clergy_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS clergy_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS clergy_email VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_rites_desired BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS clergy_present_desired BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS scripture_preferences TEXT,
ADD COLUMN IF NOT EXISTS prayer_style TEXT,
ADD COLUMN IF NOT EXISTS burial_rituals TEXT,

-- Employment & Professional
ADD COLUMN IF NOT EXISTS employment_status VARCHAR(50),

-- System tracking fields for immutable data
ADD COLUMN IF NOT EXISTS has_immutable_data BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS immutable_data_locked_at TIMESTAMP,

-- Additional notes and information
ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- 2. Create children table (since children is an array in the form)
CREATE TABLE IF NOT EXISTS children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    child_name VARCHAR(200) NOT NULL,
    child_gender VARCHAR(20),
    child_dob DATE,
    relationship_to_child VARCHAR(100), -- biological, adopted, step, etc.
    child_contact VARCHAR(200),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- 3. Update existing tables to ensure they have all needed fields

-- Update addresses table (should already exist)
-- Check if it has all the fields from your form
-- The form uses: type, street, city, country, province, postal, start, end

-- Update phones table (should already exist) 
-- The form uses: type ('Home', 'Mobile', etc.), number

-- Update emergency_contacts table (should already exist)
-- The form uses: name, relationship, phone, email, authorized, emergency

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_personal_info_user_id ON personal_info(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_info_immutable_data ON personal_info(has_immutable_data);
CREATE INDEX IF NOT EXISTS idx_children_user_id ON children(user_id);

-- 5. Add RLS to children table
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for children table
CREATE POLICY "Users can view own children" ON children 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own children" ON children 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own children" ON children 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own children" ON children 
    FOR DELETE USING (auth.uid() = user_id);

-- 7. Create trigger for children table timestamps
CREATE OR REPLACE FUNCTION update_children_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_children_updated_at
    BEFORE UPDATE ON children
    FOR EACH ROW
    EXECUTE FUNCTION update_children_updated_at();

-- 8. Add comments for documentation
COMMENT ON TABLE personal_info IS 'Comprehensive personal information including identity, family, religious, and professional details';
COMMENT ON TABLE children IS 'Information about user children and dependents';

COMMENT ON COLUMN personal_info.has_immutable_data IS 'Flag indicating if core identity fields are locked from editing';
COMMENT ON COLUMN personal_info.immutable_data_locked_at IS 'Timestamp when immutable data was first locked';
COMMENT ON COLUMN personal_info.ssn IS 'Social Security Number or equivalent national ID';
COMMENT ON COLUMN personal_info.citizenships IS 'Can contain multiple citizenships as text';
COMMENT ON COLUMN personal_info.last_rites_desired IS 'Whether user wants religious last rites';
COMMENT ON COLUMN personal_info.clergy_present_desired IS 'Whether user wants clergy present at end of life';

-- 9. Sample data validation constraints (optional but recommended)
ALTER TABLE personal_info 
ADD CONSTRAINT check_gender CHECK (gender IN ('Male', 'Female', 'Non-Binary', 'Prefer not to say') OR gender IS NULL),
ADD CONSTRAINT check_pronouns CHECK (pronouns IN ('He/Him', 'She/Her', 'They/Them', 'Other') OR pronouns IS NULL),
ADD CONSTRAINT check_relationship_status CHECK (relationship_status IN ('Single', 'Married', 'Divorced', 'Widowed', 'Common Law', 'Separated') OR relationship_status IS NULL),
ADD CONSTRAINT check_employment_status CHECK (employment_status IN ('Employed', 'Unemployed', 'Self-Employed', 'Retired', 'Entrepreneur') OR employment_status IS NULL);

-- Add constraint for children gender
ALTER TABLE children 
ADD CONSTRAINT check_child_gender CHECK (child_gender IN ('M', 'F', 'Other') OR child_gender IS NULL);
