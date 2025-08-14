-- Create finance_business table for storing comprehensive finance & business information
-- This table will store all finance & business data from the FinanceBusinessForm

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_finance_business_user_id ON finance_business(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_business_created_at ON finance_business(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE finance_business ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own finance business information
CREATE POLICY "Users can view their own finance business" ON finance_business
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own finance business" ON finance_business
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own finance business" ON finance_business
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own finance business" ON finance_business
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_finance_business_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_finance_business_updated_at
  BEFORE UPDATE ON finance_business
  FOR EACH ROW
  EXECUTE FUNCTION update_finance_business_updated_at();

-- Add unique constraint to prevent duplicate records per user
ALTER TABLE finance_business 
ADD CONSTRAINT finance_business_user_id_unique 
UNIQUE (user_id);

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'finance_business' 
ORDER BY ordinal_position; 