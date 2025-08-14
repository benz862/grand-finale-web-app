# 🚀 Production Deployment Guide

## Overview
This guide will help you deploy The Grand Finale Web App with real production APIs for the Couples Bundle and Subscription Management features.

## 📋 Prerequisites

### 1. Stripe Account Setup
- [ ] Create a Stripe account at https://stripe.com
- [ ] Get your **Live API Keys** (not test keys)
- [ ] Create the Couples Bundle products and prices in Stripe Dashboard
- [ ] Set up webhook endpoints for production

### 2. Supabase Project Setup
- [ ] Create a Supabase project at https://supabase.com
- [ ] Get your **Project URL** and **Service Role Key**
- [ ] Run the database migration: `add_subscription_columns.sql`

### 3. SendGrid Account Setup
- [ ] Create a SendGrid account at https://sendgrid.com
- [ ] Get your **API Key**
- [ ] Verify your sender domain

### 4. Domain & SSL
- [ ] Purchase a domain name
- [ ] Set up SSL certificates
- [ ] Configure DNS records

## 🔧 Environment Configuration

### Backend Environment Variables
Create `api/.env` with your real production credentials:

```bash
# Stripe Configuration (LIVE keys, not test)
STRIPE_SECRET_KEY=sk_live_your_real_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_real_webhook_secret_here

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_real_supabase_service_key_here

# SendGrid Configuration
SENDGRID_API_KEY=SG.your_real_sendgrid_api_key_here

# App Configuration
APP_URL=https://your-domain.com
PORT=4242
```

### Frontend Environment Variables
Create `.env.production` with:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=https://your-domain.com
```

## 🗄️ Database Setup

### 1. Run Migration
Execute this SQL in your Supabase SQL Editor:

```sql
-- Add subscription management columns
ALTER TABLE IF NOT EXISTS users 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS subscription_grace_expires TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_status 
ON users(subscription_status);

-- Update existing users to have active status
UPDATE users 
SET subscription_status = 'active' 
WHERE subscription_status IS NULL;
```

### 2. Verify Tables Exist
Ensure these tables exist in your Supabase database:
- `users` (with `bundle_id`, `subscription_status`, `subscription_grace_expires`, `stripe_customer_id`)
- `bundle_purchases` (with all required columns)

## 🔗 Stripe Webhook Setup

### 1. Create Webhook Endpoint
In your Stripe Dashboard:
1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set URL to: `https://your-domain.com/api/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`

### 2. Get Webhook Secret
Copy the webhook signing secret and add it to your `.env` file.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Backend Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
cd api
vercel --prod

# Set environment variables
vercel env add STRIPE_SECRET_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add SENDGRID_API_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add APP_URL
```

#### Frontend Deployment
```bash
# Deploy frontend
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_APP_URL
```

### Option 2: Railway

#### Backend Deployment
1. Connect your GitHub repo to Railway
2. Set the source directory to `/api`
3. Add environment variables in Railway dashboard
4. Deploy

#### Frontend Deployment
1. Create a new Railway project
2. Set build command: `npm run build`
3. Set start command: `npm run preview`
4. Add environment variables

### Option 3: Render

#### Backend Deployment
1. Create a new Web Service
2. Connect your GitHub repo
3. Set build command: `cd api && npm install`
4. Set start command: `cd api && npm start`
5. Add environment variables

## 🔍 Testing Production

### 1. Test Couples Bundle Flow
1. Visit your production URL
2. Go to `/couples-pricing`
3. Click "Get [Plan]" button
4. Complete Stripe checkout with test card
5. Verify redirect to invite partner page
6. Send partner invite
7. Test partner registration

### 2. Test Subscription Management
1. Create a test user with subscription
2. Test billing portal access
3. Simulate failed payment
4. Verify grace period behavior
5. Test subscription cancellation

### 3. Test Webhooks
Use Stripe CLI to test webhooks locally:
```bash
stripe listen --forward-to localhost:4242/webhook
```

## 🔒 Security Checklist

- [ ] All API keys are production keys (not test)
- [ ] Webhook signatures are verified
- [ ] CORS is properly configured
- [ ] Environment variables are secure
- [ ] SSL certificates are valid
- [ ] Database has proper RLS policies
- [ ] Rate limiting is implemented

## 📊 Monitoring

### 1. Stripe Dashboard
- Monitor payment success/failure rates
- Check webhook delivery status
- Review customer portal usage

### 2. Supabase Dashboard
- Monitor database performance
- Check authentication logs
- Review storage usage

### 3. Application Logs
- Monitor API response times
- Check error rates
- Track user engagement

## 🆘 Troubleshooting

### Common Issues

1. **Webhook Failures**
   - Check webhook URL is accessible
   - Verify webhook secret is correct
   - Check Stripe dashboard for delivery status

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure tables exist

3. **Email Delivery Issues**
   - Verify SendGrid API key
   - Check sender domain verification
   - Review SendGrid activity logs

### Support Resources
- Stripe Documentation: https://stripe.com/docs
- Supabase Documentation: https://supabase.com/docs
- SendGrid Documentation: https://sendgrid.com/docs

## 🎉 Go Live Checklist

- [ ] All environment variables configured
- [ ] Database migration completed
- [ ] Stripe webhooks configured
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Frontend and backend deployed
- [ ] End-to-end testing completed
- [ ] Monitoring set up
- [ ] Support documentation ready

---

**Congratulations!** Your production deployment is ready to handle real customers and payments. 🚀 