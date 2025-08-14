-- Legacy Planning Application Database Schema
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

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own personal_info" ON personal_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own personal_info" ON personal_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personal_info" ON personal_info FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON addresses FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own phones" ON phones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own phones" ON phones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own phones" ON phones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own phones" ON phones FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own emails" ON emails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own emails" ON emails FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emails" ON emails FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own emails" ON emails FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own emergency_contacts" ON emergency_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own emergency_contacts" ON emergency_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emergency_contacts" ON emergency_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own emergency_contacts" ON emergency_contacts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own legal_documents" ON legal_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own legal_documents" ON legal_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own legal_documents" ON legal_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own legal_documents" ON legal_documents FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_personal_info_user_id ON personal_info(user_id);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_phones_user_id ON phones(user_id);
CREATE INDEX idx_emails_user_id ON emails(user_id);
CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_legal_documents_user_id ON legal_documents(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_phones_updated_at BEFORE UPDATE ON phones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_documents_updated_at BEFORE UPDATE ON legal_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();