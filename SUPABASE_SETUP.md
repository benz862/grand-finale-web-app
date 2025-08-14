# Supabase Setup Guide for The Grand Finale

## Overview
The Grand Finale web app uses Supabase for secure data storage and user authentication. This guide will help you set up and connect to Supabase.

## Current Configuration
The app is already configured with Supabase credentials in `src/lib/supabase.ts`:
- **URL**: `https://imrubrygajmjxqvoogyr.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcnVicnlnYWptanhxdm9vZ3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjc4NzIsImV4cCI6MjA2NjYwMzg3Mn0.KjcZuU5vvQRWfF0gH8GsB3bASVkapO8RfZFr2lkovls`

## Database Schema
The app uses the following tables in Supabase:

### 1. Personal Information
```sql
CREATE TABLE personal_info (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  legal_first_name TEXT NOT NULL,
  legal_last_name TEXT NOT NULL,
  preferred_name TEXT,
  date_of_birth DATE,
  place_of_birth TEXT,
  country_of_citizenship TEXT,
  language_spoken TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Addresses
```sql
CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  address_type TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Phones
```sql
CREATE TABLE phones (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  phone_type TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Emails
```sql
CREATE TABLE emails (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Emergency Contacts
```sql
CREATE TABLE emergency_contacts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  custom_relationship TEXT,
  phone TEXT NOT NULL,
  phone_alt TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Legal Documents
```sql
CREATE TABLE legal_documents (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  document_type TEXT NOT NULL,
  has_document TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies
Enable RLS on all tables and add these policies:

```sql
-- Enable RLS on all tables
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Users can view own personal_info" ON personal_info
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal_info" ON personal_info
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personal_info" ON personal_info
  FOR UPDATE USING (auth.uid() = user_id);

-- Repeat for other tables...
```

## Authentication Setup
1. **Enable Google OAuth** in Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

2. **Configure Redirect URLs**:
   - Add `http://localhost:5173` for development
   - Add your production domain for deployment

## Environment Variables (Optional)
For better security, you can move credentials to environment variables:

1. Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://imrubrygajmjxqvoogyr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcnVicnlnYWptanhxdm9vZ3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMjc4NzIsImV4cCI6MjA2NjYwMzg3Mn0.KjcZuU5vvQRWfF0gH8GsB3bASVkapO8RfZFr2lkovls
```

2. Update `src/lib/supabase.ts`:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## Data Migration from localStorage
The app currently supports both localStorage and Supabase. To migrate existing data:

1. Users sign in with Google OAuth
2. The `DatabaseIntegration` component syncs localStorage data to Supabase
3. Future data is stored directly in Supabase

## Security Features
- **Row Level Security**: Users can only access their own data
- **Authentication Required**: All data operations require user authentication
- **Encryption**: Data is encrypted at rest and in transit
- **GDPR Compliance**: Supabase is GDPR compliant
- **SOC 2 Certified**: Enterprise-grade security standards

## Troubleshooting
1. **Authentication Issues**: Check OAuth configuration in Supabase Dashboard
2. **RLS Errors**: Ensure RLS policies are properly configured
3. **Connection Issues**: Verify URL and API key in supabase.ts
4. **Data Sync Issues**: Check browser console for error messages

## Next Steps
1. Set up the database schema in your Supabase project
2. Configure authentication providers
3. Test the data sync functionality
4. Deploy with proper environment variables 