-- Comprehensive fix for legal_estate table schema
-- This script will drop and recreate the table with all necessary columns for dynamic arrays

-- Drop existing table and related objects
DROP TRIGGER IF EXISTS trigger_update_legal_estate_updated_at ON legal_estate;
DROP FUNCTION IF EXISTS update_legal_estate_updated_at();
DROP POLICY IF EXISTS "Users can view their own legal estate" ON legal_estate;
DROP POLICY IF EXISTS "Users can insert their own legal estate" ON legal_estate;
DROP POLICY IF EXISTS "Users can update their own legal estate" ON legal_estate;
DROP POLICY IF EXISTS "Users can delete their own legal estate" ON legal_estate;
DROP INDEX IF EXISTS idx_legal_estate_user_id;
DROP INDEX IF EXISTS idx_legal_estate_created_at;
DROP TABLE IF EXISTS legal_estate;

-- Create legal_estate table with all required columns
CREATE TABLE legal_estate (
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
  
  -- Legal and Financial Contacts (stored as JSON arrays)
  contacts JSONB DEFAULT '[]',
  
  -- Executor Details (dynamic array)
  executors JSONB DEFAULT '[]',
  -- Alternate Executors (dynamic array)
  alternate_executors JSONB DEFAULT '[]',
  
  -- Power of Attorney (dynamic arrays)
  financial_poa JSONB DEFAULT '[]',
  healthcare_proxies JSONB DEFAULT '[]',
  other_poa JSONB DEFAULT '[]',
  
  -- Personal Safes (dynamic array)
  safes JSONB DEFAULT '[]',
  
  -- Safe Deposit Boxes (dynamic array)
  safe_deposit_boxes JSONB DEFAULT '[]',
  
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
  
  -- Additional Notes
  additional_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_legal_estate_user_id ON legal_estate(user_id);
CREATE INDEX idx_legal_estate_created_at ON legal_estate(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE legal_estate ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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