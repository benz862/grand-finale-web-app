-- Create digital_life table for storing comprehensive digital life information
-- This table will store all digital life data from the DigitalLifeForm

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_digital_life_user_id ON digital_life(user_id);
CREATE INDEX IF NOT EXISTS idx_digital_life_created_at ON digital_life(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE digital_life ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own digital life information
CREATE POLICY "Users can view their own digital life" ON digital_life
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own digital life" ON digital_life
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own digital life" ON digital_life
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own digital life" ON digital_life
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_digital_life_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_digital_life_updated_at
  BEFORE UPDATE ON digital_life
  FOR EACH ROW
  EXECUTE FUNCTION update_digital_life_updated_at();

-- Add unique constraint to prevent duplicate records per user
ALTER TABLE digital_life 
ADD CONSTRAINT digital_life_user_id_unique 
UNIQUE (user_id);

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'digital_life' 
ORDER BY ordinal_position; 