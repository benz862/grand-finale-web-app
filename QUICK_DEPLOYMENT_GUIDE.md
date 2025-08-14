# 🚀 Quick Deployment Guide - No CLI Required

## Option 1: Railway (Recommended - Easiest)

### Step 1: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set the source directory to: `api`
6. Railway will automatically detect it's a Node.js app

### Step 2: Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
APP_URL=https://your-domain.com
FROM_EMAIL=support@skillbinder.com
```

### Step 3: Get Your API URL
Railway will give you a URL like: `https://your-app-name.railway.app`

---

## Option 2: Render (Alternative)

### Step 1: Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `grand-finale-couples-api`
   - **Root Directory**: `api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Configure Environment Variables
Same as Railway above.

---

## Option 3: Netlify Functions (If you prefer Netlify)

### Step 1: Create Netlify Functions
Create a `netlify/functions` directory and move the API there:

```bash
mkdir -p netlify/functions
cp api/couples-bundle.js netlify/functions/couples-bundle.js
```

### Step 2: Deploy to Netlify
1. Go to [Netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Deploy automatically

---

## 🔧 Environment Variables Setup

### 1. Stripe Configuration
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)
3. Go to **Developers** → **Webhooks**
4. Create webhook endpoint: `https://your-api-url.com/webhook`
5. Copy the **Webhook Secret** (starts with `whsec_`)

### 2. Supabase Configuration
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Copy your **Project URL**
3. Go to **Settings** → **API**
4. Copy your **Service Role Key** (starts with `eyJ`)

### 3. SendGrid Configuration
1. Go to [SendGrid Dashboard](https://app.sendgrid.com)
2. Go to **Settings** → **API Keys**
3. Create new API key with **Mail Send** permissions
4. Copy the API key (starts with `SG.`)

---

## 🗄️ Database Setup

Run these SQL commands in your Supabase SQL Editor:

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

-- Create indexes
CREATE INDEX idx_bundle_purchases_session_id ON bundle_purchases(stripe_session_id);
CREATE INDEX idx_bundle_purchases_status ON bundle_purchases(status);
CREATE INDEX idx_users_bundle_id ON users(bundle_id);
```

---

## 🔗 Update Frontend URLs

Once you have your API URL, update the frontend components:

### Update API Base URL
In all frontend components, replace the API calls with your new URL:

```javascript
// Instead of:
fetch('/create-couples-checkout-session')

// Use:
fetch('https://your-api-url.com/create-couples-checkout-session')
```

### Update Environment Variables
In your frontend `.env.local`:

```env
VITE_API_URL=https://your-api-url.com
```

---

## 🧪 Testing

### 1. Test Health Check
```bash
curl https://your-api-url.com/
# Should return: {"status":"ok","message":"Couples Bundle API is running"}
```

### 2. Test Stripe Connection
```bash
curl -X GET https://api.stripe.com/v1/account \
  -H "Authorization: Bearer YOUR_STRIPE_SECRET_KEY"
```

### 3. Test Complete Flow
1. Visit your frontend: `http://localhost:8081/couples-pricing`
2. Select a couples bundle
3. Complete checkout with test card: `4242 4242 4242 4242`
4. Check webhook logs in Stripe dashboard
5. Verify bundle creation in Supabase

---

## 🚨 Common Issues

### 1. CORS Errors
If you get CORS errors, update the CORS configuration in the API:

```javascript
app.use(cors({
  origin: ["http://localhost:8081", "https://your-frontend-domain.com"],
  credentials: true
}));
```

### 2. Environment Variables Not Loading
Make sure all environment variables are set in your deployment platform.

### 3. Database Connection Issues
Verify your Supabase URL and service key are correct.

---

## 📞 Support

If you encounter issues:
1. Check the deployment platform logs
2. Verify all environment variables are set
3. Test the health check endpoint
4. Check Stripe webhook delivery in dashboard

---

**Next Steps:**
1. Choose your deployment platform (Railway recommended)
2. Set up environment variables
3. Deploy the API
4. Update frontend URLs
5. Test the complete flow 