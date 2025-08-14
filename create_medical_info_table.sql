-- Create medical_info table for storing comprehensive medical information
-- This table will store all medical-related data from the MedicalInfoForm

CREATE TABLE IF NOT EXISTS medical_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Physician Information (stored as JSON arrays)
  doctors JSONB DEFAULT '[]',
  
  -- Health Insurance & ID
  insurance_notes TEXT,
  
  -- Medications (stored as JSON arrays)
  medications JSONB DEFAULT '[]',
  supplements TEXT,
  
  -- Pharmacy Info
  pharmacy_name TEXT,
  pharmacy_phone TEXT,
  
  -- Allergies & Reactions
  allergies TEXT,
  reactions TEXT,
  
  -- Medical History (stored as JSON arrays)
  chronic_illnesses JSONB DEFAULT '[]',
  surgeries JSONB DEFAULT '[]',
  hospitalizations JSONB DEFAULT '[]',
  
  -- Organ Donation & Advance Directives
  organ_donor TEXT DEFAULT 'No',
  organ_donor_state TEXT,
  organ_donor_location TEXT,
  living_will TEXT DEFAULT 'No',
  living_will_date TEXT,
  living_will_location TEXT,
  dnr TEXT DEFAULT 'No',
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medical_info_user_id ON medical_info(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_info_created_at ON medical_info(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE medical_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own medical information
CREATE POLICY "Users can view their own medical info" ON medical_info
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medical info" ON medical_info
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical info" ON medical_info
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical info" ON medical_info
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_medical_info_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_medical_info_updated_at
  BEFORE UPDATE ON medical_info
  FOR EACH ROW
  EXECUTE FUNCTION update_medical_info_updated_at();

-- Add unique constraint to prevent duplicate records per user
ALTER TABLE medical_info 
ADD CONSTRAINT medical_info_user_id_unique 
UNIQUE (user_id);

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'medical_info' 
ORDER BY ordinal_position; 