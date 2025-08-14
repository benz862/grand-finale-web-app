-- ============================================================================
-- COMPLETE DATABASE SETUP FOR THE GRAND FINALE WEB APP (FIXED VERSION)
-- This script creates all necessary tables for sections 1-17
-- Handles existing policies and tables gracefully
-- ============================================================================

-- ============================================================================
-- SECTION 1: PERSONAL INFORMATION (already exists)
-- ============================================================================
-- Note: personal_info table should already exist from previous setup

-- ============================================================================
-- SECTION 2: MEDICAL INFORMATION
-- ============================================================================
CREATE TABLE IF NOT EXISTS medical_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Doctors & Healthcare Providers (stored as JSON arrays)
  doctors JSONB DEFAULT '[]',
  
  -- Medications (stored as JSON arrays)
  medications JSONB DEFAULT '[]',
  
  -- Allergies (stored as JSON arrays)
  allergies JSONB DEFAULT '[]',
  
  -- Medical Conditions (stored as JSON arrays)
  medical_conditions JSONB DEFAULT '[]',
  
  -- Insurance Information
  insurance_provider TEXT,
  policy_number TEXT,
  group_number TEXT,
  insurance_notes TEXT,
  
  -- Emergency Medical Information
  emergency_medical_info TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 3: LEGAL & ESTATE PLANNING
-- ============================================================================
CREATE TABLE IF NOT EXISTS legal_estate (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Legal Documents (stored as JSON arrays)
  legal_documents JSONB DEFAULT '[]',
  
  -- Estate Planning Documents (stored as JSON arrays)
  estate_documents JSONB DEFAULT '[]',
  
  -- Power of Attorney Information
  power_of_attorney_name TEXT,
  power_of_attorney_contact TEXT,
  power_of_attorney_location TEXT,
  
  -- Healthcare Proxy Information
  healthcare_proxy_name TEXT,
  healthcare_proxy_contact TEXT,
  healthcare_proxy_location TEXT,
  
  -- Living Will Information
  living_will_location TEXT,
  living_will_executor TEXT,
  
  -- Trust Information (stored as JSON arrays)
  trusts JSONB DEFAULT '[]',
  
  -- Legal Notes
  legal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 4: FINANCE & BUSINESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS finance_business (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Bank Accounts (stored as JSON arrays)
  bank_accounts JSONB DEFAULT '[]',
  
  -- Cash on Hand (stored as JSON arrays)
  cash_on_hand JSONB DEFAULT '[]',
  
  -- Investments (stored as JSON arrays)
  investments JSONB DEFAULT '[]',
  
  -- Retirement Plans (stored as JSON arrays)
  retirement_plans JSONB DEFAULT '[]',
  
  -- Crypto & Metals (stored as JSON arrays)
  crypto_metals JSONB DEFAULT '[]',
  
  -- Income Sources (stored as JSON arrays)
  income_sources JSONB DEFAULT '[]',
  
  -- Liabilities (stored as JSON arrays)
  liabilities JSONB DEFAULT '[]',
  
  -- Vehicles (stored as JSON arrays)
  vehicles JSONB DEFAULT '[]',
  
  -- Properties (stored as JSON arrays)
  properties JSONB DEFAULT '[]',
  
  -- Business Ownership (stored as JSON arrays)
  businesses JSONB DEFAULT '[]',
  
  -- Financial Advisor
  advisor_name TEXT,
  advisor_phone TEXT,
  advisor_email TEXT,
  
  -- Statement Access
  statement_storage TEXT,
  storage_location TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 5: BENEFICIARIES & INHERITANCE
-- ============================================================================
CREATE TABLE IF NOT EXISTS beneficiaries_inheritance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Life and Health Insurance Policies (stored as JSON arrays)
  insurance_policies JSONB DEFAULT '[]',
  
  -- Employee Benefits (stored as JSON arrays)
  employee_benefits JSONB DEFAULT '[]',
  
  -- Social Security (stored as JSON arrays)
  social_security_benefits JSONB DEFAULT '[]',
  
  -- Retirement (stored as JSON arrays)
  retirement_benefits JSONB DEFAULT '[]',
  
  -- Veteran's Benefits (stored as JSON arrays)
  veteran_benefits JSONB DEFAULT '[]',
  
  -- Primary & Contingent Beneficiaries (stored as JSON arrays)
  beneficiary_groups JSONB DEFAULT '[]',
  
  -- Assigned Beneficiaries on Accounts (stored as JSON arrays)
  assigned_beneficiaries JSONB DEFAULT '[]',
  
  -- Specific Bequests (stored as JSON arrays)
  specific_bequests JSONB DEFAULT '[]',
  
  -- Messages or Letters for Beneficiaries (stored as JSON arrays)
  beneficiary_messages JSONB DEFAULT '[]',
  
  -- Notes on Disinheritance or Special Instructions
  disinheritance_notes TEXT,
  
  -- Document Locations & Keys (stored as JSON arrays)
  document_locations JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 6: PERSONAL PROPERTY & REAL ESTATE
-- ============================================================================
CREATE TABLE IF NOT EXISTS personal_property_real_estate (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Primary Residence
  primary_residence_address TEXT,
  primary_residence_co_owners TEXT,
  primary_residence_security TEXT,
  primary_residence_mortgage TEXT,
  
  -- Additional Properties (stored as JSON arrays)
  additional_properties JSONB DEFAULT '[]',
  
  -- Deeds & Tax Info
  deeds_tax_info_location TEXT,
  
  -- Storage Units & Garages (stored as JSON arrays)
  storage_units JSONB DEFAULT '[]',
  
  -- High-Value Items & Appraisals (stored as JSON arrays)
  high_value_items JSONB DEFAULT '[]',
  
  -- Photo Albums & Family Keepsakes
  photo_albums_location TEXT,
  
  -- Home Contents & Distribution Plan
  home_contents_plan TEXT,
  home_contents_special_instructions TEXT,
  
  -- Firearms (stored as JSON arrays)
  firearms JSONB DEFAULT '[]',
  
  -- Other Property
  other_property_details TEXT,
  other_property_special_instructions TEXT,
  
  -- Asset Distribution Plan
  distribution_executor TEXT,
  distribution_timeline TEXT,
  distribution_instructions TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 7: DIGITAL LIFE, SUBSCRIPTIONS, & SECURITY
-- ============================================================================
CREATE TABLE IF NOT EXISTS digital_life (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Password Manager
  password_manager_used TEXT,
  password_manager_service TEXT,
  password_manager_access TEXT,
  
  -- Two-Factor Authentication
  two_factor_devices TEXT,
  backup_codes_location TEXT,
  
  -- Cancelation Instructions
  cancelation_instructions TEXT,
  
  -- USBs & External Storage
  usb_storage_location TEXT,
  
  -- Digital Executor
  digital_executor_name TEXT,
  digital_executor_location TEXT,
  
  -- Repeatable sections (stored as JSON arrays)
  email_accounts JSONB DEFAULT '[]',
  website_logins JSONB DEFAULT '[]',
  blog_websites JSONB DEFAULT '[]',
  email_providers JSONB DEFAULT '[]',
  social_media_accounts JSONB DEFAULT '[]',
  cloud_storage_accounts JSONB DEFAULT '[]',
  streaming_accounts JSONB DEFAULT '[]',
  devices JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 8: KEY CONTACTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS key_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Repeatable sections (stored as JSON arrays)
  family_members JSONB DEFAULT '[]',
  friends_contacts JSONB DEFAULT '[]',
  professional_contacts JSONB DEFAULT '[]',
  healthcare_contacts JSONB DEFAULT '[]',
  household_contacts JSONB DEFAULT '[]',
  pet_contacts JSONB DEFAULT '[]',
  notification_contacts JSONB DEFAULT '[]',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTIONS 9-17: GENERIC TABLES WITH JSONB STORAGE
-- ============================================================================

-- SECTION 9: FUNERAL & FINAL ARRANGEMENTS
CREATE TABLE IF NOT EXISTS funeral_final_arrangements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 10: ACCOUNTS & MEMBERSHIPS
CREATE TABLE IF NOT EXISTS accounts_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 11: PETS & ANIMAL CARE
CREATE TABLE IF NOT EXISTS pets_animal_care (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 12: SHORT LETTERS TO LOVED ONES
CREATE TABLE IF NOT EXISTS short_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 13: FINAL WISHES & LEGACY PLANNING
CREATE TABLE IF NOT EXISTS final_wishes_legacy_planning (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 14: BUCKET LIST & UNFINISHED BUSINESS
CREATE TABLE IF NOT EXISTS bucket_list_unfinished_business (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 15: FORMAL LETTERS
CREATE TABLE IF NOT EXISTS formal_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 16: FILE UPLOADS & MULTIMEDIA
CREATE TABLE IF NOT EXISTS file_uploads_multimedia (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECTION 17: CONCLUSION
CREATE TABLE IF NOT EXISTS conclusion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR ALL TABLES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_medical_info_user_id ON medical_info(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_info_created_at ON medical_info(created_at);

CREATE INDEX IF NOT EXISTS idx_legal_estate_user_id ON legal_estate(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_estate_created_at ON legal_estate(created_at);

CREATE INDEX IF NOT EXISTS idx_finance_business_user_id ON finance_business(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_business_created_at ON finance_business(created_at);

CREATE INDEX IF NOT EXISTS idx_beneficiaries_inheritance_user_id ON beneficiaries_inheritance(user_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_inheritance_created_at ON beneficiaries_inheritance(created_at);

CREATE INDEX IF NOT EXISTS idx_personal_property_real_estate_user_id ON personal_property_real_estate(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_property_real_estate_created_at ON personal_property_real_estate(created_at);

CREATE INDEX IF NOT EXISTS idx_digital_life_user_id ON digital_life(user_id);
CREATE INDEX IF NOT EXISTS idx_digital_life_created_at ON digital_life(created_at);

CREATE INDEX IF NOT EXISTS idx_key_contacts_user_id ON key_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_key_contacts_created_at ON key_contacts(created_at);

CREATE INDEX IF NOT EXISTS idx_funeral_final_arrangements_user_id ON funeral_final_arrangements(user_id);
CREATE INDEX IF NOT EXISTS idx_funeral_final_arrangements_created_at ON funeral_final_arrangements(created_at);

CREATE INDEX IF NOT EXISTS idx_accounts_memberships_user_id ON accounts_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_memberships_created_at ON accounts_memberships(created_at);

CREATE INDEX IF NOT EXISTS idx_pets_animal_care_user_id ON pets_animal_care(user_id);
CREATE INDEX IF NOT EXISTS idx_pets_animal_care_created_at ON pets_animal_care(created_at);

CREATE INDEX IF NOT EXISTS idx_short_letters_user_id ON short_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_short_letters_created_at ON short_letters(created_at);

CREATE INDEX IF NOT EXISTS idx_final_wishes_legacy_planning_user_id ON final_wishes_legacy_planning(user_id);
CREATE INDEX IF NOT EXISTS idx_final_wishes_legacy_planning_created_at ON final_wishes_legacy_planning(created_at);

CREATE INDEX IF NOT EXISTS idx_bucket_list_unfinished_business_user_id ON bucket_list_unfinished_business(user_id);
CREATE INDEX IF NOT EXISTS idx_bucket_list_unfinished_business_created_at ON bucket_list_unfinished_business(created_at);

CREATE INDEX IF NOT EXISTS idx_formal_letters_user_id ON formal_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_formal_letters_created_at ON formal_letters(created_at);

CREATE INDEX IF NOT EXISTS idx_file_uploads_multimedia_user_id ON file_uploads_multimedia(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_multimedia_created_at ON file_uploads_multimedia(created_at);

CREATE INDEX IF NOT EXISTS idx_conclusion_user_id ON conclusion(user_id);
CREATE INDEX IF NOT EXISTS idx_conclusion_created_at ON conclusion(created_at);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
-- ============================================================================
ALTER TABLE medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_business ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries_inheritance ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_property_real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_life ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE funeral_final_arrangements ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets_animal_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_wishes_legacy_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list_unfinished_business ENABLE ROW LEVEL SECURITY;
ALTER TABLE formal_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads_multimedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE conclusion ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES FOR ALL TABLES (WITH EXISTING POLICY HANDLING)
-- ============================================================================

-- Generic trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DROP EXISTING POLICIES AND RECREATE THEM
-- ============================================================================

-- Medical Info Policies
DROP POLICY IF EXISTS "Users can view their own medical info" ON medical_info;
DROP POLICY IF EXISTS "Users can insert their own medical info" ON medical_info;
DROP POLICY IF EXISTS "Users can update their own medical info" ON medical_info;
DROP POLICY IF EXISTS "Users can delete their own medical info" ON medical_info;

CREATE POLICY "Users can view their own medical info" ON medical_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own medical info" ON medical_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own medical info" ON medical_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own medical info" ON medical_info FOR DELETE USING (auth.uid() = user_id);

-- Legal Estate Policies
DROP POLICY IF EXISTS "Users can view their own legal estate" ON legal_estate;
DROP POLICY IF EXISTS "Users can insert their own legal estate" ON legal_estate;
DROP POLICY IF EXISTS "Users can update their own legal estate" ON legal_estate;
DROP POLICY IF EXISTS "Users can delete their own legal estate" ON legal_estate;

CREATE POLICY "Users can view their own legal estate" ON legal_estate FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own legal estate" ON legal_estate FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own legal estate" ON legal_estate FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own legal estate" ON legal_estate FOR DELETE USING (auth.uid() = user_id);

-- Finance Business Policies
DROP POLICY IF EXISTS "Users can view their own finance business" ON finance_business;
DROP POLICY IF EXISTS "Users can insert their own finance business" ON finance_business;
DROP POLICY IF EXISTS "Users can update their own finance business" ON finance_business;
DROP POLICY IF EXISTS "Users can delete their own finance business" ON finance_business;

CREATE POLICY "Users can view their own finance business" ON finance_business FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own finance business" ON finance_business FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own finance business" ON finance_business FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own finance business" ON finance_business FOR DELETE USING (auth.uid() = user_id);

-- Beneficiaries Inheritance Policies
DROP POLICY IF EXISTS "Users can view their own beneficiaries inheritance" ON beneficiaries_inheritance;
DROP POLICY IF EXISTS "Users can insert their own beneficiaries inheritance" ON beneficiaries_inheritance;
DROP POLICY IF EXISTS "Users can update their own beneficiaries inheritance" ON beneficiaries_inheritance;
DROP POLICY IF EXISTS "Users can delete their own beneficiaries inheritance" ON beneficiaries_inheritance;

CREATE POLICY "Users can view their own beneficiaries inheritance" ON beneficiaries_inheritance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own beneficiaries inheritance" ON beneficiaries_inheritance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own beneficiaries inheritance" ON beneficiaries_inheritance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own beneficiaries inheritance" ON beneficiaries_inheritance FOR DELETE USING (auth.uid() = user_id);

-- Personal Property Real Estate Policies
DROP POLICY IF EXISTS "Users can view their own personal property real estate" ON personal_property_real_estate;
DROP POLICY IF EXISTS "Users can insert their own personal property real estate" ON personal_property_real_estate;
DROP POLICY IF EXISTS "Users can update their own personal property real estate" ON personal_property_real_estate;
DROP POLICY IF EXISTS "Users can delete their own personal property real estate" ON personal_property_real_estate;

CREATE POLICY "Users can view their own personal property real estate" ON personal_property_real_estate FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own personal property real estate" ON personal_property_real_estate FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own personal property real estate" ON personal_property_real_estate FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own personal property real estate" ON personal_property_real_estate FOR DELETE USING (auth.uid() = user_id);

-- Digital Life Policies
DROP POLICY IF EXISTS "Users can view their own digital life" ON digital_life;
DROP POLICY IF EXISTS "Users can insert their own digital life" ON digital_life;
DROP POLICY IF EXISTS "Users can update their own digital life" ON digital_life;
DROP POLICY IF EXISTS "Users can delete their own digital life" ON digital_life;

CREATE POLICY "Users can view their own digital life" ON digital_life FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own digital life" ON digital_life FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own digital life" ON digital_life FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own digital life" ON digital_life FOR DELETE USING (auth.uid() = user_id);

-- Key Contacts Policies
DROP POLICY IF EXISTS "Users can view their own key contacts" ON key_contacts;
DROP POLICY IF EXISTS "Users can insert their own key contacts" ON key_contacts;
DROP POLICY IF EXISTS "Users can update their own key contacts" ON key_contacts;
DROP POLICY IF EXISTS "Users can delete their own key contacts" ON key_contacts;

CREATE POLICY "Users can view their own key contacts" ON key_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own key contacts" ON key_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own key contacts" ON key_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own key contacts" ON key_contacts FOR DELETE USING (auth.uid() = user_id);

-- Generic Policies for Sections 9-17
DROP POLICY IF EXISTS "Users can view their own funeral final arrangements" ON funeral_final_arrangements;
DROP POLICY IF EXISTS "Users can insert their own funeral final arrangements" ON funeral_final_arrangements;
DROP POLICY IF EXISTS "Users can update their own funeral final arrangements" ON funeral_final_arrangements;
DROP POLICY IF EXISTS "Users can delete their own funeral final arrangements" ON funeral_final_arrangements;

CREATE POLICY "Users can view their own funeral final arrangements" ON funeral_final_arrangements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own funeral final arrangements" ON funeral_final_arrangements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own funeral final arrangements" ON funeral_final_arrangements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own funeral final arrangements" ON funeral_final_arrangements FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own accounts memberships" ON accounts_memberships;
DROP POLICY IF EXISTS "Users can insert their own accounts memberships" ON accounts_memberships;
DROP POLICY IF EXISTS "Users can update their own accounts memberships" ON accounts_memberships;
DROP POLICY IF EXISTS "Users can delete their own accounts memberships" ON accounts_memberships;

CREATE POLICY "Users can view their own accounts memberships" ON accounts_memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own accounts memberships" ON accounts_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts memberships" ON accounts_memberships FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts memberships" ON accounts_memberships FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own pets animal care" ON pets_animal_care;
DROP POLICY IF EXISTS "Users can insert their own pets animal care" ON pets_animal_care;
DROP POLICY IF EXISTS "Users can update their own pets animal care" ON pets_animal_care;
DROP POLICY IF EXISTS "Users can delete their own pets animal care" ON pets_animal_care;

CREATE POLICY "Users can view their own pets animal care" ON pets_animal_care FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own pets animal care" ON pets_animal_care FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pets animal care" ON pets_animal_care FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pets animal care" ON pets_animal_care FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own short letters" ON short_letters;
DROP POLICY IF EXISTS "Users can insert their own short letters" ON short_letters;
DROP POLICY IF EXISTS "Users can update their own short letters" ON short_letters;
DROP POLICY IF EXISTS "Users can delete their own short letters" ON short_letters;

CREATE POLICY "Users can view their own short letters" ON short_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own short letters" ON short_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own short letters" ON short_letters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own short letters" ON short_letters FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own final wishes legacy planning" ON final_wishes_legacy_planning;
DROP POLICY IF EXISTS "Users can insert their own final wishes legacy planning" ON final_wishes_legacy_planning;
DROP POLICY IF EXISTS "Users can update their own final wishes legacy planning" ON final_wishes_legacy_planning;
DROP POLICY IF EXISTS "Users can delete their own final wishes legacy planning" ON final_wishes_legacy_planning;

CREATE POLICY "Users can view their own final wishes legacy planning" ON final_wishes_legacy_planning FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own final wishes legacy planning" ON final_wishes_legacy_planning FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own final wishes legacy planning" ON final_wishes_legacy_planning FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own final wishes legacy planning" ON final_wishes_legacy_planning FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own bucket list unfinished business" ON bucket_list_unfinished_business;
DROP POLICY IF EXISTS "Users can insert their own bucket list unfinished business" ON bucket_list_unfinished_business;
DROP POLICY IF EXISTS "Users can update their own bucket list unfinished business" ON bucket_list_unfinished_business;
DROP POLICY IF EXISTS "Users can delete their own bucket list unfinished business" ON bucket_list_unfinished_business;

CREATE POLICY "Users can view their own bucket list unfinished business" ON bucket_list_unfinished_business FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bucket list unfinished business" ON bucket_list_unfinished_business FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bucket list unfinished business" ON bucket_list_unfinished_business FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bucket list unfinished business" ON bucket_list_unfinished_business FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own formal letters" ON formal_letters;
DROP POLICY IF EXISTS "Users can insert their own formal letters" ON formal_letters;
DROP POLICY IF EXISTS "Users can update their own formal letters" ON formal_letters;
DROP POLICY IF EXISTS "Users can delete their own formal letters" ON formal_letters;

CREATE POLICY "Users can view their own formal letters" ON formal_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own formal letters" ON formal_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own formal letters" ON formal_letters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own formal letters" ON formal_letters FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own file uploads multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can insert their own file uploads multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can update their own file uploads multimedia" ON file_uploads_multimedia;
DROP POLICY IF EXISTS "Users can delete their own file uploads multimedia" ON file_uploads_multimedia;

CREATE POLICY "Users can view their own file uploads multimedia" ON file_uploads_multimedia FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own file uploads multimedia" ON file_uploads_multimedia FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own file uploads multimedia" ON file_uploads_multimedia FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own file uploads multimedia" ON file_uploads_multimedia FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own conclusion" ON conclusion;
DROP POLICY IF EXISTS "Users can insert their own conclusion" ON conclusion;
DROP POLICY IF EXISTS "Users can update their own conclusion" ON conclusion;
DROP POLICY IF EXISTS "Users can delete their own conclusion" ON conclusion;

CREATE POLICY "Users can view their own conclusion" ON conclusion FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own conclusion" ON conclusion FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conclusion" ON conclusion FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conclusion" ON conclusion FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- CREATE TRIGGERS FOR ALL TABLES
-- ============================================================================

-- Create triggers for all tables
DROP TRIGGER IF EXISTS trigger_update_medical_info_updated_at ON medical_info;
CREATE TRIGGER trigger_update_medical_info_updated_at BEFORE UPDATE ON medical_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_legal_estate_updated_at ON legal_estate;
CREATE TRIGGER trigger_update_legal_estate_updated_at BEFORE UPDATE ON legal_estate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_finance_business_updated_at ON finance_business;
CREATE TRIGGER trigger_update_finance_business_updated_at BEFORE UPDATE ON finance_business FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_beneficiaries_inheritance_updated_at ON beneficiaries_inheritance;
CREATE TRIGGER trigger_update_beneficiaries_inheritance_updated_at BEFORE UPDATE ON beneficiaries_inheritance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_personal_property_real_estate_updated_at ON personal_property_real_estate;
CREATE TRIGGER trigger_update_personal_property_real_estate_updated_at BEFORE UPDATE ON personal_property_real_estate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_digital_life_updated_at ON digital_life;
CREATE TRIGGER trigger_update_digital_life_updated_at BEFORE UPDATE ON digital_life FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_key_contacts_updated_at ON key_contacts;
CREATE TRIGGER trigger_update_key_contacts_updated_at BEFORE UPDATE ON key_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_funeral_final_arrangements_updated_at ON funeral_final_arrangements;
CREATE TRIGGER trigger_update_funeral_final_arrangements_updated_at BEFORE UPDATE ON funeral_final_arrangements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_accounts_memberships_updated_at ON accounts_memberships;
CREATE TRIGGER trigger_update_accounts_memberships_updated_at BEFORE UPDATE ON accounts_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_pets_animal_care_updated_at ON pets_animal_care;
CREATE TRIGGER trigger_update_pets_animal_care_updated_at BEFORE UPDATE ON pets_animal_care FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_short_letters_updated_at ON short_letters;
CREATE TRIGGER trigger_update_short_letters_updated_at BEFORE UPDATE ON short_letters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_final_wishes_legacy_planning_updated_at ON final_wishes_legacy_planning;
CREATE TRIGGER trigger_update_final_wishes_legacy_planning_updated_at BEFORE UPDATE ON final_wishes_legacy_planning FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_bucket_list_unfinished_business_updated_at ON bucket_list_unfinished_business;
CREATE TRIGGER trigger_update_bucket_list_unfinished_business_updated_at BEFORE UPDATE ON bucket_list_unfinished_business FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_formal_letters_updated_at ON formal_letters;
CREATE TRIGGER trigger_update_formal_letters_updated_at BEFORE UPDATE ON formal_letters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_file_uploads_multimedia_updated_at ON file_uploads_multimedia;
CREATE TRIGGER trigger_update_file_uploads_multimedia_updated_at BEFORE UPDATE ON file_uploads_multimedia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_update_conclusion_updated_at ON conclusion;
CREATE TRIGGER trigger_update_conclusion_updated_at BEFORE UPDATE ON conclusion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ADD UNIQUE CONSTRAINTS TO PREVENT DUPLICATE RECORDS PER USER
-- ============================================================================
DO $$ 
BEGIN
    -- Add unique constraints only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'medical_info_user_id_unique') THEN
        ALTER TABLE medical_info ADD CONSTRAINT medical_info_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'legal_estate_user_id_unique') THEN
        ALTER TABLE legal_estate ADD CONSTRAINT legal_estate_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'finance_business_user_id_unique') THEN
        ALTER TABLE finance_business ADD CONSTRAINT finance_business_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'beneficiaries_inheritance_user_id_unique') THEN
        ALTER TABLE beneficiaries_inheritance ADD CONSTRAINT beneficiaries_inheritance_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'personal_property_real_estate_user_id_unique') THEN
        ALTER TABLE personal_property_real_estate ADD CONSTRAINT personal_property_real_estate_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'digital_life_user_id_unique') THEN
        ALTER TABLE digital_life ADD CONSTRAINT digital_life_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'key_contacts_user_id_unique') THEN
        ALTER TABLE key_contacts ADD CONSTRAINT key_contacts_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'funeral_final_arrangements_user_id_unique') THEN
        ALTER TABLE funeral_final_arrangements ADD CONSTRAINT funeral_final_arrangements_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'accounts_memberships_user_id_unique') THEN
        ALTER TABLE accounts_memberships ADD CONSTRAINT accounts_memberships_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pets_animal_care_user_id_unique') THEN
        ALTER TABLE pets_animal_care ADD CONSTRAINT pets_animal_care_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'short_letters_user_id_unique') THEN
        ALTER TABLE short_letters ADD CONSTRAINT short_letters_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'final_wishes_legacy_planning_user_id_unique') THEN
        ALTER TABLE final_wishes_legacy_planning ADD CONSTRAINT final_wishes_legacy_planning_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bucket_list_unfinished_business_user_id_unique') THEN
        ALTER TABLE bucket_list_unfinished_business ADD CONSTRAINT bucket_list_unfinished_business_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formal_letters_user_id_unique') THEN
        ALTER TABLE formal_letters ADD CONSTRAINT formal_letters_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'file_uploads_multimedia_user_id_unique') THEN
        ALTER TABLE file_uploads_multimedia ADD CONSTRAINT file_uploads_multimedia_user_id_unique UNIQUE (user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conclusion_user_id_unique') THEN
        ALTER TABLE conclusion ADD CONSTRAINT conclusion_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- ============================================================================
-- VERIFY ALL TABLES WERE CREATED SUCCESSFULLY
-- ============================================================================
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name IN (
  'medical_info',
  'legal_estate',
  'finance_business',
  'beneficiaries_inheritance',
  'personal_property_real_estate',
  'digital_life',
  'key_contacts',
  'funeral_final_arrangements',
  'accounts_memberships',
  'pets_animal_care',
  'short_letters',
  'final_wishes_legacy_planning',
  'bucket_list_unfinished_business',
  'formal_letters',
  'file_uploads_multimedia',
  'conclusion'
)
ORDER BY table_name, ordinal_position; 