-- Supabase Auth Users Setup
-- This shows how to create authentication users for the dummy accounts
-- Note: This should be done through Supabase Dashboard or Auth API, not direct SQL

-- Option 1: Create via Supabase Dashboard
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add User" for each dummy account
-- 4. Use these credentials:

/*
Dummy Lite-Monthly:
Email: info@epoxydogs.com
Password: DummyLite2024!

Dummy Standard-Monthly:
Email: info@epoxydogs.com  
Password: DummyStandard2024!

Dummy Premium-Monthly:
Email: info@epoxydogs.com
Password: DummyPremium2024!

Dummy Lifetime:
Email: info@epoxydogs.com
Password: DummyLifetime2024!

Dummy Lite-Yearly:
Email: info@epoxydogs.com
Password: DummyLiteYearly2024!

Dummy Standard-Yearly:
Email: info@epoxydogs.com
Password: DummyStandardYearly2024!

Dummy Premium-Yearly:
Email: info@epoxydogs.com
Password: DummyPremiumYearly2024!

Dummy Lifetime-Yearly:
Email: info@epoxydogs.com
Password: DummyLifetimeYearly2024!
*/

-- Option 2: Create via Supabase Auth API (JavaScript/TypeScript)
-- You can use this in your application code:

/*
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

// Create auth user
const { data, error } = await supabase.auth.admin.createUser({
  email: 'info@epoxydogs.com',
  password: 'DummyLite2024!',
  email_confirm: true
})
*/

-- Option 3: Use Supabase CLI
-- You can also create users via the Supabase CLI:

/*
supabase auth create-user --email info@epoxydogs.com --password DummyLite2024!
*/

-- Note: Since all accounts use the same email, you'll need to either:
-- 1. Use different email addresses for each tier
-- 2. Create separate auth users and link them to your dummy accounts
-- 3. Use a single auth user and manage tier access through your application logic 