#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Couples Bundle API Environment Setup');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file already exists');
} else {
  console.log('📝 Creating .env file...');
  
  const envTemplate = `# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# SendGrid Configuration
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here

# App Configuration
APP_URL=http://localhost:8081
PORT=4242

# Email Configuration
FROM_EMAIL=support@skillbinder.com
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created');
}

console.log('\n📋 Next Steps:');
console.log('1. Edit the .env file with your actual credentials');
console.log('2. Run: npm run dev');
console.log('3. Test the API: curl http://localhost:4242/');
console.log('\n🔗 Get your credentials from:');
console.log('- Stripe: https://dashboard.stripe.com/apikeys');
console.log('- Supabase: https://supabase.com/dashboard/project/[YOUR_PROJECT]/settings/api');
console.log('- SendGrid: https://app.sendgrid.com/settings/api_keys'); 