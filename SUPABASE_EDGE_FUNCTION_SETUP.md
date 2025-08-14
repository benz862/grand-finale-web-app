# 🚀 Supabase Edge Function Setup Guide

This guide will help you set up the Supabase Edge Function to send real email notifications for support requests.

## 📋 **Prerequisites**

1. **Supabase CLI** installed
2. **SendGrid account** with API key
3. **Verified sender email** in SendGrid

## 🔧 **Step 1: Install Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

## 🏗️ **Step 2: Initialize Supabase in Your Project**

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

**To find your project ref:**
1. Go to your Supabase Dashboard
2. Click on your project
3. Go to Settings → General
4. Copy the "Reference ID"

## 📁 **Step 3: Deploy the Edge Function**

The edge function is already created at `supabase/functions/send-support-email/index.ts`.

```bash
# Deploy the edge function
supabase functions deploy send-support-email
```

## 🔑 **Step 4: Set Environment Variables**

```bash
# Set SendGrid API key in Supabase
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key_here

# Verify the secret was set
supabase secrets list
```

## 📧 **Step 5: Configure SendGrid**

### **A. Get Your SendGrid API Key**
1. Go to [SendGrid Dashboard](https://app.sendgrid.com/)
2. Navigate to Settings → API Keys
3. Create a new API Key with "Mail Send" permissions
4. Copy the API key

### **B. Verify Your Sender Email**
1. In SendGrid Dashboard, go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Add `noreply@skillbinder.com` (or your preferred sender email)
4. Follow the verification steps

### **C. Update the Edge Function**
Edit `supabase/functions/send-support-email/index.ts` and update the `from` email:

```typescript
from: {
  email: 'noreply@skillbinder.com', // Replace with your verified sender
  name: 'The Grand Finale Support System',
},
```

## 🧪 **Step 6: Test the Edge Function**

### **A. Test Locally (Optional)**
```bash
# Start Supabase locally
supabase start

# Test the function locally
curl -X POST http://localhost:54321/functions/v1/send-support-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "supportData": {
      "id": "test-123",
      "name": "Test User",
      "email": "test@example.com",
      "subject": "Test Request",
      "category": "General",
      "message": "This is a test message"
    }
  }'
```

### **B. Test in Production**
1. Submit a support request through your web app
2. Check your email at `support@skillbinder.com`
3. Check the Supabase Dashboard → Edge Functions → Logs

## 🔍 **Step 7: Monitor and Debug**

### **View Function Logs**
```bash
# View recent logs
supabase functions logs send-support-email

# Follow logs in real-time
supabase functions logs send-support-email --follow
```

### **Check Function Status**
```bash
# List all functions
supabase functions list

# Get function details
supabase functions show send-support-email
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **"Email service not configured"**
   - Check if `SENDGRID_API_KEY` is set: `supabase secrets list`
   - Verify the API key is valid in SendGrid

2. **"SendGrid API error: 403"**
   - Verify your sender email is authenticated in SendGrid
   - Check API key permissions

3. **"Function not found"**
   - Ensure the function is deployed: `supabase functions list`
   - Redeploy: `supabase functions deploy send-support-email`

4. **CORS errors**
   - The function includes CORS headers, but check your Supabase project settings

### **Debug Steps:**
1. Check function logs: `supabase functions logs send-support-email`
2. Verify environment variables: `supabase secrets list`
3. Test SendGrid API key separately
4. Check Supabase Dashboard → Edge Functions → Logs

## ✅ **Verification Checklist**

- [ ] Supabase CLI installed and logged in
- [ ] Project linked to Supabase
- [ ] Edge function deployed successfully
- [ ] SendGrid API key set as secret
- [ ] Sender email verified in SendGrid
- [ ] Function logs show successful deployment
- [ ] Test support request sends email
- [ ] Email received at `support@skillbinder.com`

## 🎯 **Expected Results**

After setup, when a user submits a support request:

1. ✅ **Form data saved** to `support_requests` table
2. ✅ **Edge function called** with request data
3. ✅ **SendGrid sends email** to `support@skillbinder.com`
4. ✅ **Professional HTML email** received with SkillBinder branding
5. ✅ **Success page** shown to user

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase Edge Function logs
3. Verify SendGrid configuration
4. Test with a simple curl request

---

**Next Steps:** Once this is set up, your support system will send real email notifications automatically! 