-- Create beneficiaries_inheritance table for storing comprehensive beneficiaries & inheritance information
-- This table will store all beneficiaries & inheritance data from the BeneficiariesInheritanceForm

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_beneficiaries_inheritance_user_id ON beneficiaries_inheritance(user_id);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_inheritance_created_at ON beneficiaries_inheritance(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE beneficiaries_inheritance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own beneficiaries inheritance information
CREATE POLICY "Users can view their own beneficiaries inheritance" ON beneficiaries_inheritance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own beneficiaries inheritance" ON beneficiaries_inheritance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own beneficiaries inheritance" ON beneficiaries_inheritance
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own beneficiaries inheritance" ON beneficiaries_inheritance
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_beneficiaries_inheritance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_beneficiaries_inheritance_updated_at
  BEFORE UPDATE ON beneficiaries_inheritance
  FOR EACH ROW
  EXECUTE FUNCTION update_beneficiaries_inheritance_updated_at();

-- Add unique constraint to prevent duplicate records per user
ALTER TABLE beneficiaries_inheritance 
ADD CONSTRAINT beneficiaries_inheritance_user_id_unique 
UNIQUE (user_id);

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'beneficiaries_inheritance' 
ORDER BY ordinal_position; 