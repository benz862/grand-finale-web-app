-- Complete Legacy Planning Application Database Schema
-- This SQL file creates all necessary tables for the legacy planning application
-- Run this in Supabase SQL Editor to set up the complete database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create personal_info table
CREATE TABLE personal_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    legal_first_name VARCHAR(100) NOT NULL,
    legal_last_name VARCHAR(100) NOT NULL,
    preferred_name VARCHAR(100),
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(200),
    country_of_citizenship VARCHAR(100),
    language_spoken VARCHAR(100),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(50) NOT NULL,
    street VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create phones table
CREATE TABLE phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone_type VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create emails table
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    email_type VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE emergency_contacts (
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

-- Create legal_documents table
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    has_document VARCHAR(10) NOT NULL,
    location VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create legal_estate table (for LegalEstateForm)
CREATE TABLE legal_estate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    -- Will & Estate Overview
    has_will VARCHAR(10),
    will_updated_date DATE,
    will_location TEXT,
    other_estate_documents TEXT,
    
    -- Executor Details
    executor_name VARCHAR(200),
    executor_relationship VARCHAR(100),
    executor_phone VARCHAR(20),
    executor_email VARCHAR(255),
    executor_address TEXT,
    executor_aware VARCHAR(10),
    executor_accepted VARCHAR(10),
    
    -- Executor Notes
    executor_doc_location TEXT,
    executor_compensation VARCHAR(50),
    executor_notes TEXT,
    
    -- Legal and Financial Contacts
    estate_attorney_name VARCHAR(200),
    estate_attorney_phone VARCHAR(20),
    estate_attorney_firm VARCHAR(200),
    estate_attorney_email VARCHAR(255),
    financial_advisor_name VARCHAR(200),
    financial_advisor_phone VARCHAR(20),
    financial_advisor_company VARCHAR(200),
    financial_advisor_email VARCHAR(255),
    
    -- Power of Attorney
    financial_poa_agent VARCHAR(200),
    financial_poa_contact VARCHAR(20),
    financial_poa_relationship VARCHAR(100),
    financial_poa_effective VARCHAR(50),
    healthcare_proxy_name VARCHAR(200),
    healthcare_proxy_alternate VARCHAR(200),
    other_poa_role VARCHAR(200),
    other_poa_notes TEXT,
    
    -- Supporting Legal Documents
    guardianship_name VARCHAR(200),
    guardianship_location TEXT,
    burial_cremation VARCHAR(50),
    burial_form_location TEXT,
    hipaa_form_location TEXT,
    digital_will_exists VARCHAR(10),
    digital_executor_name VARCHAR(200),
    digital_doc_location TEXT,
    
    -- Personal Safe Details
    safe_type VARCHAR(200),
    safe_location TEXT,
    safe_code_location TEXT,
    safe_people_with_access TEXT,
    safe_contents TEXT,
    safe_instructions TEXT,
    
    -- Safe Deposit Box
    safe_deposit_bank VARCHAR(200),
    safe_deposit_box_number VARCHAR(50),
    safe_deposit_key_holder VARCHAR(200),
    safe_deposit_contents TEXT,
    safe_deposit_notes TEXT,
    
    -- Arrays for multiple items
    lawyers JSONB,
    alternate_executors JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create final_wishes_legacy_planning table (for FinalWishesLegacyPlanningForm)
CREATE TABLE final_wishes_legacy_planning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Ethical Will
    ethical_will_content TEXT,
    ethical_will_recipients JSONB,
    
    -- Creative Legacy Projects
    creative_projects JSONB,
    
    -- Charitable Donations
    charitable_donations JSONB,
    
    -- Life Lessons
    life_lessons JSONB,
    
    -- Family Traditions
    family_traditions JSONB,
    
    -- Legacy Messages
    legacy_messages JSONB,
    
    -- Final Reflections
    final_reflections TEXT,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create pets_animal_care table (for PetsAnimalCareForm)
CREATE TABLE pets_animal_care (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Pets
    pets JSONB,
    
    -- Veterinarian Information
    vet_name VARCHAR(200),
    vet_phone VARCHAR(20),
    vet_email VARCHAR(255),
    vet_address TEXT,
    vet_notes TEXT,
    
    -- Pet Care Instructions
    pet_care_instructions TEXT,
    pet_emergency_contacts JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create short_letters table (for ShortLettersForm)
CREATE TABLE short_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Letters
    letters JSONB,
    
    -- Delivery Instructions
    delivery_instructions JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create transition_notes table (for TransitionNotesForm)
CREATE TABLE transition_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Household Tips
    household_tips JSONB,
    
    -- Money Tips
    money_tips JSONB,
    
    -- Wisdom Tips
    wisdom_tips JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create file_uploads_multimedia table (for FileUploadsMultimediaForm)
CREATE TABLE file_uploads_multimedia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- File Categories
    photos JSONB,
    videos JSONB,
    documents JSONB,
    audio_files JSONB,
    other_files JSONB,
    
    -- QR Code Information
    qr_codes JSONB,
    
    -- File Organization
    file_organization_notes TEXT,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create medical_info table (for MedicalInfoForm)
CREATE TABLE medical_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Medical History
    medical_history JSONB,
    
    -- Medications
    medications JSONB,
    
    -- Allergies
    allergies JSONB,
    
    -- Physicians
    physicians JSONB,
    
    -- Hospitalizations
    hospitalizations JSONB,
    
    -- Surgeries
    surgeries JSONB,
    
    -- Insurance
    insurance JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create financial_info table (for FinanceBusinessForm)
CREATE TABLE financial_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Bank Accounts
    bank_accounts JSONB,
    
    -- Investments
    investments JSONB,
    
    -- Insurance Policies
    insurance_policies JSONB,
    
    -- Business Information
    business_info JSONB,
    
    -- Debts and Liabilities
    debts_liabilities JSONB,
    
    -- Income Sources
    income_sources JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create funeral_preferences table (for FuneralFinalArrangementsForm)
CREATE TABLE funeral_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Funeral Preferences
    funeral_type VARCHAR(100),
    funeral_location TEXT,
    funeral_instructions TEXT,
    
    -- Ceremony Details
    ceremony_details JSONB,
    
    -- Music Preferences
    music_preferences JSONB,
    
    -- Readings and Eulogies
    readings_eulogies JSONB,
    
    -- Burial/Cremation Preferences
    burial_cremation_preferences JSONB,
    
    -- Memorial Service
    memorial_service JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create personal_property_real_estate table (for PersonalPropertyRealEstateForm)
CREATE TABLE personal_property_real_estate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Real Estate
    real_estate JSONB,
    
    -- Vehicles
    vehicles JSONB,
    
    -- Personal Property
    personal_property JSONB,
    
    -- Business Property
    business_property JSONB,
    
    -- Digital Assets
    digital_assets JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create beneficiaries_inheritance table (for BeneficiariesInheritanceForm)
CREATE TABLE beneficiaries_inheritance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Beneficiaries
    beneficiaries JSONB,
    
    -- Inheritance Plans
    inheritance_plans JSONB,
    
    -- Trust Information
    trust_info JSONB,
    
    -- Special Instructions
    special_instructions TEXT,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create digital_life table (for DigitalLifeForm)
CREATE TABLE digital_life (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Online Accounts
    online_accounts JSONB,
    
    -- Social Media
    social_media JSONB,
    
    -- Digital Assets
    digital_assets JSONB,
    
    -- Passwords and Access
    passwords_access JSONB,
    
    -- Digital Legacy Instructions
    digital_legacy_instructions TEXT,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create accounts_memberships table (for AccountsMembershipsForm)
CREATE TABLE accounts_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Financial Accounts
    financial_accounts JSONB,
    
    -- Memberships
    memberships JSONB,
    
    -- Subscriptions
    subscriptions JSONB,
    
    -- Loyalty Programs
    loyalty_programs JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create key_contacts table (for KeyContactsForm)
CREATE TABLE key_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Key Contacts
    key_contacts JSONB,
    
    -- Professional Contacts
    professional_contacts JSONB,
    
    -- Personal Contacts
    personal_contacts JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create bucket_list_unfinished_business table (for BucketListUnfinishedBusinessForm)
CREATE TABLE bucket_list_unfinished_business (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Bucket List
    bucket_list JSONB,
    
    -- Unfinished Business
    unfinished_business JSONB,
    
    -- Goals and Dreams
    goals_dreams JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create formal_letters table (for FormalLettersForm)
CREATE TABLE formal_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Formal Letters
    formal_letters JSONB,
    
    -- Legal Letters
    legal_letters JSONB,
    
    -- Business Letters
    business_letters JSONB,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Create conclusion table (for ConclusionForm)
CREATE TABLE conclusion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Final Thoughts
    final_thoughts TEXT,
    
    -- Completion Checklist
    completion_checklist JSONB,
    
    -- Final Instructions
    final_instructions TEXT,
    
    -- Legacy Summary
    legacy_summary TEXT,
    
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_wishes_legacy_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets_animal_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE transition_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads_multimedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE funeral_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_property_real_estate ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries_inheritance ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_life ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list_unfinished_business ENABLE ROW LEVEL SECURITY;
ALTER TABLE formal_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE conclusion ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Personal Info policies
CREATE POLICY "Users can view own personal_info" ON personal_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own personal_info" ON personal_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personal_info" ON personal_info FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Addresses policies
CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- Phones policies
CREATE POLICY "Users can view own phones" ON phones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own phones" ON phones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own phones" ON phones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own phones" ON phones FOR DELETE USING (auth.uid() = user_id);

-- Emails policies
CREATE POLICY "Users can view own emails" ON emails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own emails" ON emails FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emails" ON emails FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own emails" ON emails FOR DELETE USING (auth.uid() = user_id);

-- Emergency Contacts policies
CREATE POLICY "Users can view own emergency_contacts" ON emergency_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own emergency_contacts" ON emergency_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emergency_contacts" ON emergency_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own emergency_contacts" ON emergency_contacts FOR DELETE USING (auth.uid() = user_id);

-- Legal Documents policies
CREATE POLICY "Users can view own legal_documents" ON legal_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own legal_documents" ON legal_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own legal_documents" ON legal_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own legal_documents" ON legal_documents FOR DELETE USING (auth.uid() = user_id);

-- Legal Estate policies
CREATE POLICY "Users can view own legal_estate" ON legal_estate FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own legal_estate" ON legal_estate FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own legal_estate" ON legal_estate FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own legal_estate" ON legal_estate FOR DELETE USING (auth.uid() = user_id);

-- Final Wishes Legacy Planning policies
CREATE POLICY "Users can view own final_wishes_legacy_planning" ON final_wishes_legacy_planning FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own final_wishes_legacy_planning" ON final_wishes_legacy_planning FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own final_wishes_legacy_planning" ON final_wishes_legacy_planning FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own final_wishes_legacy_planning" ON final_wishes_legacy_planning FOR DELETE USING (auth.uid() = user_id);

-- Pets Animal Care policies
CREATE POLICY "Users can view own pets_animal_care" ON pets_animal_care FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own pets_animal_care" ON pets_animal_care FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pets_animal_care" ON pets_animal_care FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own pets_animal_care" ON pets_animal_care FOR DELETE USING (auth.uid() = user_id);

-- Short Letters policies
CREATE POLICY "Users can view own short_letters" ON short_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own short_letters" ON short_letters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own short_letters" ON short_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own short_letters" ON short_letters FOR DELETE USING (auth.uid() = user_id);

-- Transition Notes policies
CREATE POLICY "Users can view own transition_notes" ON transition_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own transition_notes" ON transition_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transition_notes" ON transition_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own transition_notes" ON transition_notes FOR DELETE USING (auth.uid() = user_id);

-- File Uploads Multimedia policies
CREATE POLICY "Users can view own file_uploads_multimedia" ON file_uploads_multimedia FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own file_uploads_multimedia" ON file_uploads_multimedia FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own file_uploads_multimedia" ON file_uploads_multimedia FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own file_uploads_multimedia" ON file_uploads_multimedia FOR DELETE USING (auth.uid() = user_id);

-- Medical Info policies
CREATE POLICY "Users can view own medical_info" ON medical_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own medical_info" ON medical_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own medical_info" ON medical_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own medical_info" ON medical_info FOR DELETE USING (auth.uid() = user_id);

-- Financial Info policies
CREATE POLICY "Users can view own financial_info" ON financial_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own financial_info" ON financial_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own financial_info" ON financial_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own financial_info" ON financial_info FOR DELETE USING (auth.uid() = user_id);

-- Funeral Preferences policies
CREATE POLICY "Users can view own funeral_preferences" ON funeral_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own funeral_preferences" ON funeral_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own funeral_preferences" ON funeral_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own funeral_preferences" ON funeral_preferences FOR DELETE USING (auth.uid() = user_id);

-- Personal Property Real Estate policies
CREATE POLICY "Users can view own personal_property_real_estate" ON personal_property_real_estate FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own personal_property_real_estate" ON personal_property_real_estate FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personal_property_real_estate" ON personal_property_real_estate FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own personal_property_real_estate" ON personal_property_real_estate FOR DELETE USING (auth.uid() = user_id);

-- Beneficiaries Inheritance policies
CREATE POLICY "Users can view own beneficiaries_inheritance" ON beneficiaries_inheritance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own beneficiaries_inheritance" ON beneficiaries_inheritance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own beneficiaries_inheritance" ON beneficiaries_inheritance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own beneficiaries_inheritance" ON beneficiaries_inheritance FOR DELETE USING (auth.uid() = user_id);

-- Digital Life policies
CREATE POLICY "Users can view own digital_life" ON digital_life FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own digital_life" ON digital_life FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own digital_life" ON digital_life FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own digital_life" ON digital_life FOR DELETE USING (auth.uid() = user_id);

-- Accounts Memberships policies
CREATE POLICY "Users can view own accounts_memberships" ON accounts_memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts_memberships" ON accounts_memberships FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts_memberships" ON accounts_memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts_memberships" ON accounts_memberships FOR DELETE USING (auth.uid() = user_id);

-- Key Contacts policies
CREATE POLICY "Users can view own key_contacts" ON key_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own key_contacts" ON key_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own key_contacts" ON key_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own key_contacts" ON key_contacts FOR DELETE USING (auth.uid() = user_id);

-- Bucket List Unfinished Business policies
CREATE POLICY "Users can view own bucket_list_unfinished_business" ON bucket_list_unfinished_business FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own bucket_list_unfinished_business" ON bucket_list_unfinished_business FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bucket_list_unfinished_business" ON bucket_list_unfinished_business FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bucket_list_unfinished_business" ON bucket_list_unfinished_business FOR DELETE USING (auth.uid() = user_id);

-- Formal Letters policies
CREATE POLICY "Users can view own formal_letters" ON formal_letters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own formal_letters" ON formal_letters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own formal_letters" ON formal_letters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own formal_letters" ON formal_letters FOR DELETE USING (auth.uid() = user_id);

-- Conclusion policies
CREATE POLICY "Users can view own conclusion" ON conclusion FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own conclusion" ON conclusion FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conclusion" ON conclusion FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own conclusion" ON conclusion FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_personal_info_user_id ON personal_info(user_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_phones_user_id ON phones(user_id);
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_legal_documents_user_id ON legal_documents(user_id);
CREATE INDEX idx_legal_estate_user_id ON legal_estate(user_id);
CREATE INDEX idx_final_wishes_legacy_planning_user_id ON final_wishes_legacy_planning(user_id);
CREATE INDEX idx_pets_animal_care_user_id ON pets_animal_care(user_id);
CREATE INDEX idx_short_letters_user_id ON short_letters(user_id);
CREATE INDEX idx_transition_notes_user_id ON transition_notes(user_id);
CREATE INDEX idx_file_uploads_multimedia_user_id ON file_uploads_multimedia(user_id);
CREATE INDEX idx_medical_info_user_id ON medical_info(user_id);
CREATE INDEX idx_financial_info_user_id ON financial_info(user_id);
CREATE INDEX idx_funeral_preferences_user_id ON funeral_preferences(user_id);
CREATE INDEX idx_personal_property_real_estate_user_id ON personal_property_real_estate(user_id);
CREATE INDEX idx_beneficiaries_inheritance_user_id ON beneficiaries_inheritance(user_id);
CREATE INDEX idx_digital_life_user_id ON digital_life(user_id);
CREATE INDEX idx_accounts_memberships_user_id ON accounts_memberships(user_id);
CREATE INDEX idx_key_contacts_user_id ON key_contacts(user_id);
CREATE INDEX idx_bucket_list_unfinished_business_user_id ON bucket_list_unfinished_business(user_id);
CREATE INDEX idx_formal_letters_user_id ON formal_letters(user_id);
CREATE INDEX idx_conclusion_user_id ON conclusion(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at on all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_phones_updated_at BEFORE UPDATE ON phones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_documents_updated_at BEFORE UPDATE ON legal_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_estate_updated_at BEFORE UPDATE ON legal_estate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_final_wishes_legacy_planning_updated_at BEFORE UPDATE ON final_wishes_legacy_planning FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_animal_care_updated_at BEFORE UPDATE ON pets_animal_care FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_short_letters_updated_at BEFORE UPDATE ON short_letters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transition_notes_updated_at BEFORE UPDATE ON transition_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_file_uploads_multimedia_updated_at BEFORE UPDATE ON file_uploads_multimedia FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_info_updated_at BEFORE UPDATE ON medical_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_info_updated_at BEFORE UPDATE ON financial_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funeral_preferences_updated_at BEFORE UPDATE ON funeral_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_property_real_estate_updated_at BEFORE UPDATE ON personal_property_real_estate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_beneficiaries_inheritance_updated_at BEFORE UPDATE ON beneficiaries_inheritance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_digital_life_updated_at BEFORE UPDATE ON digital_life FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_memberships_updated_at BEFORE UPDATE ON accounts_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_key_contacts_updated_at BEFORE UPDATE ON key_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bucket_list_unfinished_business_updated_at BEFORE UPDATE ON bucket_list_unfinished_business FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_formal_letters_updated_at BEFORE UPDATE ON formal_letters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conclusion_updated_at BEFORE UPDATE ON conclusion FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 