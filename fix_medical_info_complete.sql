-- Complete fix for medical_info table to match the TypeScript interface
-- Run this in Supabase SQL Editor

-- Drop the existing medical_info table and recreate it with all required columns
DROP TABLE IF EXISTS medical_info CASCADE;

-- Recreate medical_info table with all required columns
CREATE TABLE medical_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Physician Information
  doctors JSONB DEFAULT '[]',
  
  -- Health Insurance & ID
  insurance_notes TEXT,
  
  -- Medications
  medications JSONB DEFAULT '[]',
  supplements TEXT,
  
  -- Pharmacy Info
  pharmacy_name TEXT,
  pharmacy_phone TEXT,
  
  -- Allergies & Reactions
  allergies TEXT,
  reactions TEXT,
  
  -- Medical History
  chronic_illnesses JSONB DEFAULT '[]',
  surgeries JSONB DEFAULT '[]',
  hospitalizations JSONB DEFAULT '[]',
  
  -- Organ Donation & Advance Directives
  organ_donor TEXT,
  organ_donor_state TEXT,
  organ_donor_location TEXT,
  living_will TEXT,
  living_will_date TEXT,
  living_will_location TEXT,
  dnr TEXT,
  dnr_date TEXT,
  dnr_location TEXT,
  
  -- Healthcare Proxy
  proxy_name TEXT,
  proxy_relationship TEXT,
  proxy_phone TEXT,
  proxy_email TEXT,
  proxy_location TEXT,
  
  -- Insurance Details
  primary_provider TEXT,
  policy_number TEXT,
  policyholder TEXT,
  insurance_phone TEXT,
  secondary_coverage TEXT,
  
  -- Preferred Facilities
  nearest_er TEXT,
  preferred_hospital TEXT,
  
  -- Additional Notes
  additional_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_medical_info_user_id ON medical_info(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_info_created_at ON medical_info(created_at);

-- Enable RLS
ALTER TABLE medical_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own medical info" ON medical_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own medical info" ON medical_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own medical info" ON medical_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own medical info" ON medical_info FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_medical_info_updated_at 
  BEFORE UPDATE ON medical_info 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add unique constraint
ALTER TABLE medical_info ADD CONSTRAINT medical_info_user_id_unique UNIQUE (user_id);

-- Verify the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'medical_info'
ORDER BY ordinal_position; 