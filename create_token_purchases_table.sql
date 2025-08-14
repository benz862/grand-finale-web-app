-- Create token purchases table for additional PDF export tokens
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. CREATE TOKEN PURCHASES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS token_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_purchased INTEGER NOT NULL CHECK (tokens_purchased > 0),
  tokens_remaining INTEGER NOT NULL CHECK (tokens_remaining >= 0),
  purchase_amount DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_token_purchases_user_id ON token_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_token_purchases_active ON token_purchases(is_active);
CREATE INDEX IF NOT EXISTS idx_token_purchases_expires ON token_purchases(expires_at);
CREATE INDEX IF NOT EXISTS idx_token_purchases_user_active ON token_purchases(user_id, is_active);

-- ========================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE token_purchases ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. CREATE RLS POLICIES
-- ========================================

-- Users can view their own token purchases
CREATE POLICY "Users can view their own token purchases" ON token_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own token purchases
CREATE POLICY "Users can insert their own token purchases" ON token_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own token purchases (for token consumption)
CREATE POLICY "Users can update their own token purchases" ON token_purchases
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can manage all token purchases
CREATE POLICY "Service role can manage token purchases" ON token_purchases
  FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- 5. CREATE HELPER FUNCTIONS
-- ========================================

-- Function to get user's total available tokens (monthly + purchased)
CREATE OR REPLACE FUNCTION get_user_total_tokens(user_uuid UUID)
RETURNS TABLE(
  monthly_limit INTEGER,
  monthly_used INTEGER,
  monthly_remaining INTEGER,
  purchased_tokens INTEGER,
  total_available INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH monthly_stats AS (
    SELECT 
      CASE 
        WHEN u.email LIKE '%.lite.%' THEN 1
        WHEN u.email LIKE '%.standard.%' THEN 3
        WHEN u.email LIKE '%.premium.%' OR u.email LIKE '%.lifetime%' THEN -1
        ELSE 1
      END as monthly_limit,
      COALESCE(COUNT(pe.id), 0) as monthly_used
    FROM auth.users u
    LEFT JOIN pdf_exports pe ON u.id = pe.user_id 
      AND pe.month_year = to_char(CURRENT_DATE, 'YYYY-MM')
    WHERE u.id = user_uuid
    GROUP BY u.id, u.email
  ),
  purchased_stats AS (
    SELECT COALESCE(SUM(tp.tokens_remaining), 0) as purchased_tokens
    FROM token_purchases tp
    WHERE tp.user_id = user_uuid 
      AND tp.is_active = true
      AND (tp.expires_at IS NULL OR tp.expires_at > CURRENT_DATE)
  )
  SELECT 
    ms.monthly_limit,
    ms.monthly_used,
    GREATEST(0, ms.monthly_limit - ms.monthly_used) as monthly_remaining,
    ps.purchased_tokens,
    CASE 
      WHEN ms.monthly_limit = -1 THEN -1  -- Unlimited
      ELSE GREATEST(0, ms.monthly_limit - ms.monthly_used) + ps.purchased_tokens
    END as total_available
  FROM monthly_stats ms
  CROSS JOIN purchased_stats ps;
END;
$$ LANGUAGE plpgsql;

-- Function to consume a token (prioritizes monthly tokens first, then purchased)
CREATE OR REPLACE FUNCTION consume_pdf_token(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  monthly_remaining INTEGER;
  purchased_tokens INTEGER;
  token_purchase_id UUID;
BEGIN
  -- Get user's token status
  SELECT 
    GREATEST(0, monthly_limit - monthly_used) as monthly_remaining,
    purchased_tokens
  INTO monthly_remaining, purchased_tokens
  FROM get_user_total_tokens(user_uuid)
  WHERE user_uuid = user_uuid;

  -- Check if user has any tokens available
  IF monthly_remaining = 0 AND purchased_tokens = 0 THEN
    RETURN FALSE;
  END IF;

  -- If monthly tokens available, use those first
  IF monthly_remaining > 0 THEN
    -- Record the export (this will count against monthly limit)
    INSERT INTO pdf_exports (user_id, has_watermark, month_year)
    VALUES (
      user_uuid,
      CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE id = user_uuid AND email LIKE '%.lite.%') THEN true
        ELSE false
      END,
      to_char(CURRENT_DATE, 'YYYY-MM')
    );
    RETURN TRUE;
  END IF;

  -- If no monthly tokens, use purchased tokens
  IF purchased_tokens > 0 THEN
    -- Find the oldest active token purchase
    SELECT id INTO token_purchase_id
    FROM token_purchases
    WHERE user_id = user_uuid 
      AND is_active = true 
      AND tokens_remaining > 0
      AND (expires_at IS NULL OR expires_at > CURRENT_DATE)
    ORDER BY purchase_date ASC
    LIMIT 1;

    IF token_purchase_id IS NOT NULL THEN
      -- Consume one token from the purchase
      UPDATE token_purchases
      SET tokens_remaining = tokens_remaining - 1
      WHERE id = token_purchase_id;

      -- Record the export (with no watermark for purchased tokens)
      INSERT INTO pdf_exports (user_id, has_watermark, month_year)
      VALUES (user_uuid, false, to_char(CURRENT_DATE, 'YYYY-MM'));

      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
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
WHERE table_name = 'token_purchases'
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
WHERE tablename = 'token_purchases';


