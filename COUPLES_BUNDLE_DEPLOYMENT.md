# 🚀 Couples Bundle Deployment Guide

## Overview

This guide will help you deploy the Couples Bundle feature for The Grand Finale web app. The implementation includes a complete Stripe webhook flow, SendGrid email integration, and Supabase database management.

## 📋 Prerequisites

- Node.js 18+ installed
- Stripe account with couples bundle price IDs configured
- Supabase project with required tables
- SendGrid account for email delivery
- Domain with SSL certificate (for production)

## 🗄️ Database Setup

### 1. Create Required Tables in Supabase

```sql
-- Create bundle_purchases table
CREATE TABLE bundle_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  primary_user_email TEXT NOT NULL,
  secondary_invite_email TEXT,
  secondary_user_id UUID,
  plan_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
  invite_token TEXT,
  invite_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add bundle_id column to users table
ALTER TABLE users ADD COLUMN bundle_id UUID REFERENCES bundle_purchases(id);

-- Create indexes for performance
CREATE INDEX idx_bundle_purchases_session_id ON bundle_purchases(stripe_session_id);
CREATE INDEX idx_bundle_purchases_status ON bundle_purchases(status);
CREATE INDEX idx_users_bundle_id ON users(bundle_id);
```

### 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on bundle_purchases
ALTER TABLE bundle_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your security requirements)
CREATE POLICY "Users can view their own bundles" ON bundle_purchases
  FOR SELECT USING (auth.uid() IN (
    SELECT id FROM users WHERE bundle_id = bundle_purchases.id
  ));

CREATE POLICY "Service role can manage bundles" ON bundle_purchases
  FOR ALL USING (auth.role() = 'service_role');
```

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd api
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `api` directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# SendGrid Configuration
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here

# App Configuration
APP_URL=https://your-domain.com
PORT=4242

# Email Configuration
FROM_EMAIL=support@skillbinder.com
```

### 3. Verify Stripe Price IDs

Ensure these price IDs are configured in your Stripe dashboard:

| Plan | Price ID |
|------|----------|
| Lifetime Couples | `price_1Rok3hE6oTidvpnUNU4SHFSA` |
| Lite Couples Monthly | `price_1Rok5LE6oTidvpnUSQB2GMCw` |
| Standard Couples Monthly | `price_1Rok6AE6oTidvpnUHjp4lPXT` |
| Premium Couples Monthly | `price_1RokFkE6oTidvpnUOd5lfhuu` |
| Lite Couples Yearly | `price_1RokHAE6oTidvpnUnzBNHLNn` |
| Standard Couples Yearly | `price_1RokJAE6oTidvpnUeqfK3JDN` |
| Premium Couples Yearly | `price_1RokJtE6oTidvpnUFh8Kocvj` |

## 🔗 Stripe Webhook Configuration

### 1. Create Webhook Endpoint

In your Stripe Dashboard:
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://your-domain.com/webhook`
4. Select events: `checkout.session.completed`
5. Copy the webhook secret to your `.env` file

### 2. Test Webhook

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:4242/webhook

# In another terminal, test the webhook
stripe trigger checkout.session.completed
```

## 📧 SendGrid Setup

### 1. Create SendGrid Account

1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your sender domain
3. Create an API key with **Mail Send** permissions
4. Add the API key to your `.env` file

### 2. Verify Sender Email

```bash
# Verify your sender email in SendGrid dashboard
# Or use SendGrid API to verify
curl -X POST https://api.sendgrid.com/v3/verified_senders \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from_email": "support@skillbinder.com"}'
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend:**
   ```bash
   cd api
   vercel --prod
   ```

3. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from your `.env` file

4. **Update Frontend URLs:**
   - Update `APP_URL` in environment variables
   - Update API endpoints in frontend components

### Option 2: Railway

1. **Connect Repository:**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Select the `api` directory

2. **Configure Environment:**
   - Add all environment variables
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Deploy:**
   - Railway will automatically deploy on push

### Option 3: DigitalOcean App Platform

1. **Create App:**
   - Go to DigitalOcean App Platform
   - Connect your repository
   - Select Node.js environment

2. **Configure:**
   - Set source directory to `api`
   - Add environment variables
   - Set build command: `npm install`
   - Set run command: `npm start`

### Option 4: Heroku

1. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

2. **Deploy:**
   ```bash
   cd api
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-app-name
   git push heroku main
   ```

3. **Configure Environment:**
   ```bash
   heroku config:set STRIPE_SECRET_KEY=sk_test_...
   heroku config:set SUPABASE_URL=https://...
   # Add all other environment variables
   ```

## 🔍 Testing

### 1. Local Testing

```bash
# Start backend
cd api
npm run dev

# Start frontend (in another terminal)
cd ..
npm run dev

# Test the flow:
# 1. Visit http://localhost:8081/couples-pricing
# 2. Select a plan and complete checkout
# 3. Check webhook logs
# 4. Verify bundle creation in Supabase
```

### 2. Production Testing

1. **Test Checkout Flow:**
   - Use Stripe test cards
   - Verify webhook receives events
   - Check bundle creation in database

2. **Test Email Flow:**
   - Send test invitation
   - Verify email delivery
   - Test partner registration

3. **Test Security:**
   - Verify email uniqueness
   - Test expired invitations
   - Check token validation

## 📊 Monitoring

### 1. Stripe Dashboard

- Monitor webhook delivery
- Check payment success rates
- Review customer data

### 2. SendGrid Dashboard

- Monitor email delivery rates
- Check bounce rates
- Review email analytics

### 3. Supabase Dashboard

- Monitor database performance
- Check RLS policies
- Review user authentication

### 4. Application Logs

```bash
# View logs (Vercel)
vercel logs

# View logs (Railway)
railway logs

# View logs (Heroku)
heroku logs --tail
```

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] Stripe webhook signature verification enabled
- [ ] CORS properly configured
- [ ] RLS policies implemented
- [ ] Email validation in place
- [ ] Token expiration enforced
- [ ] HTTPS enabled in production
- [ ] Rate limiting implemented (optional)

## 🐛 Troubleshooting

### Common Issues

1. **Webhook Not Receiving Events:**
   - Check webhook endpoint URL
   - Verify webhook secret
   - Check server logs

2. **Email Not Sending:**
   - Verify SendGrid API key
   - Check sender email verification
   - Review SendGrid logs

3. **Database Errors:**
   - Check Supabase connection
   - Verify table structure
   - Review RLS policies

4. **CORS Errors:**
   - Update CORS origin in backend
   - Check frontend URL configuration
   - Verify credentials setting

### Debug Commands

```bash
# Test Stripe connection
curl -X GET https://api.stripe.com/v1/account \
  -H "Authorization: Bearer YOUR_STRIPE_SECRET_KEY"

# Test Supabase connection
curl -X GET https://your-project.supabase.co/rest/v1/bundle_purchases \
  -H "apikey: YOUR_SUPABASE_ANON_KEY"

# Test SendGrid
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_SENDGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"support@skillbinder.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test email"}]}'
```

## 📈 Performance Optimization

1. **Database Indexing:**
   - Add indexes on frequently queried columns
   - Monitor query performance

2. **Caching:**
   - Consider Redis for session storage
   - Cache bundle information

3. **CDN:**
   - Use CDN for static assets
   - Optimize image delivery

## 🔄 Updates and Maintenance

1. **Regular Updates:**
   - Keep dependencies updated
   - Monitor security advisories
   - Update Stripe SDK regularly

2. **Backup Strategy:**
   - Regular database backups
   - Version control for code
   - Environment variable backups

3. **Monitoring:**
   - Set up alerts for errors
   - Monitor performance metrics
   - Track user engagement

---

**Note:** This deployment guide provides a comprehensive approach to deploying the couples bundle feature. Adjust the configuration based on your specific infrastructure and requirements. 