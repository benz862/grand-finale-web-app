-- Create key_contacts table for storing comprehensive key contacts information
-- This table will store all key contacts data from the KeyContactsForm

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_key_contacts_user_id ON key_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_key_contacts_created_at ON key_contacts(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE key_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own key contacts information
CREATE POLICY "Users can view their own key contacts" ON key_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own key contacts" ON key_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own key contacts" ON key_contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own key contacts" ON key_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_key_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_key_contacts_updated_at
  BEFORE UPDATE ON key_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_key_contacts_updated_at();

-- Add unique constraint to prevent duplicate records per user
ALTER TABLE key_contacts 
ADD CONSTRAINT key_contacts_user_id_unique 
UNIQUE (user_id);

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'key_contacts' 
ORDER BY ordinal_position; 