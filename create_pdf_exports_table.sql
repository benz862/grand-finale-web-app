-- Create PDF exports tracking table
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. CREATE PDF EXPORTS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS pdf_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  export_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  has_watermark BOOLEAN DEFAULT false,
  month_year TEXT NOT NULL, -- Format: "2024-01"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_pdf_exports_user_id ON pdf_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_exports_month_year ON pdf_exports(month_year);
CREATE INDEX IF NOT EXISTS idx_pdf_exports_user_month ON pdf_exports(user_id, month_year);

-- ========================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE pdf_exports ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. CREATE RLS POLICIES
-- ========================================

-- Users can view their own PDF exports
CREATE POLICY "Users can view their own PDF exports" ON pdf_exports
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own PDF exports
CREATE POLICY "Users can insert their own PDF exports" ON pdf_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role can manage all PDF exports (for admin functions)
CREATE POLICY "Service role can manage PDF exports" ON pdf_exports
  FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- 5. CREATE HELPER FUNCTION
-- ========================================

-- Function to get current month-year string
CREATE OR REPLACE FUNCTION get_current_month_year()
RETURNS TEXT AS $$
BEGIN
  RETURN to_char(CURRENT_DATE, 'YYYY-MM');
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 6. VERIFY TABLE CREATION
-- ========================================

-- Check if table was created successfully
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'pdf_exports'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'pdf_exports';
