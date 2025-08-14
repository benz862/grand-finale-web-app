-- Create legal_estate table for storing comprehensive legal & estate planning information
-- This table will store all legal & estate data from the LegalEstateForm

CREATE TABLE IF NOT EXISTS legal_estate (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Will & Estate Overview
  will_exists TEXT DEFAULT 'No',
  will_location TEXT,
  will_date TEXT,
  estate_value TEXT,
  estate_notes TEXT,
  
  -- Lawyer Information (stored as JSON arrays)
  lawyers JSONB DEFAULT '[]',
  
  -- Legal and Financial Contacts
  legal_contacts TEXT,
  financial_contacts TEXT,
  accountant_name TEXT,
  accountant_phone TEXT,
  accountant_email TEXT,
  
  -- Executor Details
  executor_name TEXT,
  executor_phone TEXT,
  executor_email TEXT,
  executor_address TEXT,
  executor_relationship TEXT,
  executor_notes TEXT,
  
  -- Alternate Executors (stored as JSON arrays)
  alternate_executors JSONB DEFAULT '[]',
  
  -- Power of Attorney (POA)
  poa_exists TEXT DEFAULT 'No',
  poa_type TEXT,
  poa_name TEXT,
  poa_phone TEXT,
  poa_email TEXT,
  poa_address TEXT,
  poa_relationship TEXT,
  poa_date TEXT,
  poa_location TEXT,
  
  -- Supporting Legal Documents
  trust_exists TEXT DEFAULT 'No',
  trust_name TEXT,
  trust_date TEXT,
  trust_location TEXT,
  living_will TEXT DEFAULT 'No',
  living_will_date TEXT,
  living_will_location TEXT,
  healthcare_proxy TEXT DEFAULT 'No',
  healthcare_proxy_name TEXT,
  healthcare_proxy_date TEXT,
  healthcare_proxy_location TEXT,
  
  -- Personal Safe Details
  safe_exists TEXT DEFAULT 'No',
  safe_location TEXT,
  safe_combination TEXT,
  safe_contents TEXT,
  
  -- Safe Deposit Box
  deposit_box_exists TEXT DEFAULT 'No',
  deposit_box_bank TEXT,
  deposit_box_location TEXT,
  deposit_box_number TEXT,
  deposit_box_key_location TEXT,
  deposit_box_contents TEXT,
  
  -- Additional Notes
  additional_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_legal_estate_user_id ON legal_estate(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_estate_created_at ON legal_estate(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE legal_estate ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own legal estate information
CREATE POLICY "Users can view their own legal estate" ON legal_estate
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own legal estate" ON legal_estate
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own legal estate" ON legal_estate
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own legal estate" ON legal_estate
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_legal_estate_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_legal_estate_updated_at
  BEFORE UPDATE ON legal_estate
  FOR EACH ROW
  EXECUTE FUNCTION update_legal_estate_updated_at();

-- Add unique constraint to prevent duplicate records per user
ALTER TABLE legal_estate 
ADD CONSTRAINT legal_estate_user_id_unique 
UNIQUE (user_id);

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'legal_estate' 
ORDER BY ordinal_position; 