-- Create all remaining tables for The Grand Finale Web App
-- This script creates tables for sections 9-17 (Funeral Final Arrangements through Conclusion)

-- ============================================================================
-- SECTION 9: FUNERAL & FINAL ARRANGEMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS funeral_final_arrangements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 10: ACCOUNTS & MEMBERSHIPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS accounts_memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 11: PETS & ANIMAL CARE
-- ============================================================================
CREATE TABLE IF NOT EXISTS pets_animal_care (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 12: SHORT LETTERS TO LOVED ONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS short_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 13: FINAL WISHES & LEGACY PLANNING
-- ============================================================================
CREATE TABLE IF NOT EXISTS final_wishes_legacy_planning (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 14: BUCKET LIST & UNFINISHED BUSINESS
-- ============================================================================
CREATE TABLE IF NOT EXISTS bucket_list_unfinished_business (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 15: FORMAL LETTERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS formal_letters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION 16: FILE UPLOADS & MULTIMEDIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS file_uploads_multimedia (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SECTION C: CONCLUSION
-- ============================================================================
CREATE TABLE IF NOT EXISTS conclusion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- All form data will be stored as JSONB for flexibility
  form_data JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR ALL TABLES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_funeral_final_arrangements_user_id ON funeral_final_arrangements(user_id);
CREATE INDEX IF NOT EXISTS idx_funeral_final_arrangements_created_at ON funeral_final_arrangements(created_at);

CREATE INDEX IF NOT EXISTS idx_accounts_memberships_user_id ON accounts_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_memberships_created_at ON accounts_memberships(created_at);

CREATE INDEX IF NOT EXISTS idx_pets_animal_care_user_id ON pets_animal_care(user_id);
CREATE INDEX IF NOT EXISTS idx_pets_animal_care_created_at ON pets_animal_care(created_at);

CREATE INDEX IF NOT EXISTS idx_short_letters_user_id ON short_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_short_letters_created_at ON short_letters(created_at);

CREATE INDEX IF NOT EXISTS idx_final_wishes_legacy_planning_user_id ON final_wishes_legacy_planning(user_id);
CREATE INDEX IF NOT EXISTS idx_final_wishes_legacy_planning_created_at ON final_wishes_legacy_planning(created_at);

CREATE INDEX IF NOT EXISTS idx_bucket_list_unfinished_business_user_id ON bucket_list_unfinished_business(user_id);
CREATE INDEX IF NOT EXISTS idx_bucket_list_unfinished_business_created_at ON bucket_list_unfinished_business(created_at);

CREATE INDEX IF NOT EXISTS idx_formal_letters_user_id ON formal_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_formal_letters_created_at ON formal_letters(created_at);

CREATE INDEX IF NOT EXISTS idx_file_uploads_multimedia_user_id ON file_uploads_multimedia(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_multimedia_created_at ON file_uploads_multimedia(created_at);

CREATE INDEX IF NOT EXISTS idx_conclusion_user_id ON conclusion(user_id);
CREATE INDEX IF NOT EXISTS idx_conclusion_created_at ON conclusion(created_at);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
-- ============================================================================
ALTER TABLE funeral_final_arrangements ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets_animal_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_wishes_legacy_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE bucket_list_unfinished_business ENABLE ROW LEVEL SECURITY;
ALTER TABLE formal_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads_multimedia ENABLE ROW LEVEL SECURITY;
ALTER TABLE conclusion ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE RLS POLICIES FOR ALL TABLES
-- ============================================================================

-- Funeral Final Arrangements Policies
CREATE POLICY "Users can view their own funeral final arrangements" ON funeral_final_arrangements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own funeral final arrangements" ON funeral_final_arrangements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own funeral final arrangements" ON funeral_final_arrangements
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own funeral final arrangements" ON funeral_final_arrangements
  FOR DELETE USING (auth.uid() = user_id);

-- Accounts Memberships Policies
CREATE POLICY "Users can view their own accounts memberships" ON accounts_memberships
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own accounts memberships" ON accounts_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts memberships" ON accounts_memberships
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts memberships" ON accounts_memberships
  FOR DELETE USING (auth.uid() = user_id);

-- Pets Animal Care Policies
CREATE POLICY "Users can view their own pets animal care" ON pets_animal_care
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own pets animal care" ON pets_animal_care
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pets animal care" ON pets_animal_care
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pets animal care" ON pets_animal_care
  FOR DELETE USING (auth.uid() = user_id);

-- Short Letters Policies
CREATE POLICY "Users can view their own short letters" ON short_letters
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own short letters" ON short_letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own short letters" ON short_letters
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own short letters" ON short_letters
  FOR DELETE USING (auth.uid() = user_id);

-- Final Wishes Legacy Planning Policies
CREATE POLICY "Users can view their own final wishes legacy planning" ON final_wishes_legacy_planning
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own final wishes legacy planning" ON final_wishes_legacy_planning
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own final wishes legacy planning" ON final_wishes_legacy_planning
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own final wishes legacy planning" ON final_wishes_legacy_planning
  FOR DELETE USING (auth.uid() = user_id);

-- Bucket List Unfinished Business Policies
CREATE POLICY "Users can view their own bucket list unfinished business" ON bucket_list_unfinished_business
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bucket list unfinished business" ON bucket_list_unfinished_business
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bucket list unfinished business" ON bucket_list_unfinished_business
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bucket list unfinished business" ON bucket_list_unfinished_business
  FOR DELETE USING (auth.uid() = user_id);

-- Formal Letters Policies
CREATE POLICY "Users can view their own formal letters" ON formal_letters
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own formal letters" ON formal_letters
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own formal letters" ON formal_letters
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own formal letters" ON formal_letters
  FOR DELETE USING (auth.uid() = user_id);

-- File Uploads Multimedia Policies
CREATE POLICY "Users can view their own file uploads multimedia" ON file_uploads_multimedia
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own file uploads multimedia" ON file_uploads_multimedia
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own file uploads multimedia" ON file_uploads_multimedia
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own file uploads multimedia" ON file_uploads_multimedia
  FOR DELETE USING (auth.uid() = user_id);

-- Conclusion Policies
CREATE POLICY "Users can view their own conclusion" ON conclusion
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own conclusion" ON conclusion
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conclusion" ON conclusion
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conclusion" ON conclusion
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- CREATE TRIGGERS FOR ALL TABLES
-- ============================================================================

-- Generic trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER trigger_update_funeral_final_arrangements_updated_at
  BEFORE UPDATE ON funeral_final_arrangements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_accounts_memberships_updated_at
  BEFORE UPDATE ON accounts_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_pets_animal_care_updated_at
  BEFORE UPDATE ON pets_animal_care
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_short_letters_updated_at
  BEFORE UPDATE ON short_letters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_final_wishes_legacy_planning_updated_at
  BEFORE UPDATE ON final_wishes_legacy_planning
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_bucket_list_unfinished_business_updated_at
  BEFORE UPDATE ON bucket_list_unfinished_business
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_formal_letters_updated_at
  BEFORE UPDATE ON formal_letters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_file_uploads_multimedia_updated_at
  BEFORE UPDATE ON file_uploads_multimedia
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_conclusion_updated_at
  BEFORE UPDATE ON conclusion
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ADD UNIQUE CONSTRAINTS TO PREVENT DUPLICATE RECORDS PER USER
-- ============================================================================
ALTER TABLE funeral_final_arrangements 
ADD CONSTRAINT funeral_final_arrangements_user_id_unique 
UNIQUE (user_id);

ALTER TABLE accounts_memberships 
ADD CONSTRAINT accounts_memberships_user_id_unique 
UNIQUE (user_id);

ALTER TABLE pets_animal_care 
ADD CONSTRAINT pets_animal_care_user_id_unique 
UNIQUE (user_id);

ALTER TABLE short_letters 
ADD CONSTRAINT short_letters_user_id_unique 
UNIQUE (user_id);

ALTER TABLE final_wishes_legacy_planning 
ADD CONSTRAINT final_wishes_legacy_planning_user_id_unique 
UNIQUE (user_id);

ALTER TABLE bucket_list_unfinished_business 
ADD CONSTRAINT bucket_list_unfinished_business_user_id_unique 
UNIQUE (user_id);

ALTER TABLE formal_letters 
ADD CONSTRAINT formal_letters_user_id_unique 
UNIQUE (user_id);

ALTER TABLE file_uploads_multimedia 
ADD CONSTRAINT file_uploads_multimedia_user_id_unique 
UNIQUE (user_id);

ALTER TABLE conclusion 
ADD CONSTRAINT conclusion_user_id_unique 
UNIQUE (user_id);

-- ============================================================================
-- VERIFY ALL TABLES WERE CREATED SUCCESSFULLY
-- ============================================================================
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name IN (
  'funeral_final_arrangements',
  'accounts_memberships',
  'pets_animal_care',
  'short_letters',
  'final_wishes_legacy_planning',
  'bucket_list_unfinished_business',
  'formal_letters',
  'file_uploads_multimedia',
  'conclusion'
)
ORDER BY table_name, ordinal_position; 