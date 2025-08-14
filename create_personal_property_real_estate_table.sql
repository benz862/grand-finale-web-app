-- Create personal_property_real_estate table for storing comprehensive personal property & real estate information
-- This table will store all personal property & real estate data from the PersonalPropertyRealEstateForm

CREATE TABLE IF NOT EXISTS personal_property_real_estate (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Primary Residence
  primary_residence_address TEXT,
  primary_residence_co_owners TEXT,
  primary_residence_security TEXT,
  primary_residence_mortgage TEXT,
  
  -- Additional Properties (stored as JSON arrays)
  additional_properties JSONB DEFAULT '[]',
  
  -- Deeds & Tax Info
  deeds_tax_info_location TEXT,
  
  -- Storage Units & Garages (stored as JSON arrays)
  storage_units JSONB DEFAULT '[]',
  
  -- High-Value Items & Appraisals (stored as JSON arrays)
  high_value_items JSONB DEFAULT '[]',
  
  -- Photo Albums & Family Keepsakes
  photo_albums_location TEXT,
  
  -- Home Contents & Distribution Plan
  home_contents_plan TEXT,
  home_contents_special_instructions TEXT,
  
  -- Firearms (stored as JSON arrays)
  firearms JSONB DEFAULT '[]',
  
  -- Other Property
  other_property_details TEXT,
  other_property_special_instructions TEXT,
  
  -- Asset Distribution Plan
  distribution_executor TEXT,
  distribution_timeline TEXT,
  distribution_instructions TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personal_property_real_estate_user_id ON personal_property_real_estate(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_property_real_estate_created_at ON personal_property_real_estate(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE personal_property_real_estate ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own personal property real estate information
CREATE POLICY "Users can view their own personal property real estate" ON personal_property_real_estate
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own personal property real estate" ON personal_property_real_estate
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal property real estate" ON personal_property_real_estate
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personal property real estate" ON personal_property_real_estate
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_personal_property_real_estate_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_personal_property_real_estate_updated_at
  BEFORE UPDATE ON personal_property_real_estate
  FOR EACH ROW
  EXECUTE FUNCTION update_personal_property_real_estate_updated_at();

-- Add unique constraint to prevent duplicate records per user
ALTER TABLE personal_property_real_estate 
ADD CONSTRAINT personal_property_real_estate_user_id_unique 
UNIQUE (user_id);

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'personal_property_real_estate' 
ORDER BY ordinal_position; 