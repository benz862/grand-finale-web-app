# 🚀 Token Purchasing System Deployment Guide

## Overview

This guide will help you deploy the **complete token purchasing system** that allows users to buy additional PDF export tokens beyond their monthly limits. Users can now purchase tokens instead of being forced to upgrade their entire plan.

## 🎯 What's New

### ✅ **Token Purchasing System**
- **$4.95 per token** (matches your PDF book pricing)
- **Package options:** 1 token ($4.95), 2 tokens ($9.90), 5 tokens ($19.80)
- **No expiration** (tokens never expire)
- **Plan-appropriate watermarks** (Lite = watermarked, Standard+ = clean)

### ✅ **Enhanced User Experience**
- **Purchase modal** with package selection
- **Real-time token tracking** (monthly + purchased)
- **Smart consumption** (monthly tokens first, then purchased)
- **Clear status display** with remaining counts

### ✅ **Business Benefits**
- **Additional revenue** without forcing plan upgrades
- **User retention** through flexible options
- **Reduced churn** from limit frustrations

## 🗄️ Database Setup

### 1. Run Both SQL Scripts

**First, run the PDF exports table:**
```sql
-- Run create_pdf_exports_table.sql in Supabase SQL Editor
```

**Then, run the token purchases table:**
```sql
-- Run create_token_purchases_table.sql in Supabase SQL Editor
```

### 2. Verify Tables Created

After running both scripts, you should have:
- ✅ `pdf_exports` table (tracks monthly usage)
- ✅ `token_purchases` table (tracks purchased tokens)
- ✅ Helper functions for token management
- ✅ RLS policies for security

## 🔧 Frontend Changes

### New Files Created:
1. **`src/lib/pdfExportService.ts`** - Enhanced with token support
2. **`src/components/TokenPurchaseModal.tsx`** - Purchase interface
3. **`src/components/PdfExportLimitDisplay.tsx`** - Updated with token display
4. **`create_token_purchases_table.sql`** - Database setup

### Updated Files:
1. **`src/contexts/TrialContext.tsx`** - Integrated token tracking

## 🚀 Deployment Steps

### 1. Database Setup
```bash
# Run both SQL scripts in Supabase SQL Editor
# 1. create_pdf_exports_table.sql
# 2. create_token_purchases_table.sql
```

### 2. Frontend Deployment
```bash
# Download the zip file
grandfinale-token-purchasing-system.zip

# Extract to your server's grandfinale/ folder
# This will update the dist/ folder with new code
```

### 3. Test the Feature
1. **Visit** `grandfinale.skillbinder.com`
2. **Sign in** with a test account
3. **Use up monthly exports** (1 for Lite, 3 for Standard)
4. **Click "Buy More Tokens"** when limit is reached
5. **Purchase tokens** and verify they work

## 🎯 How It Works

### **Token Consumption Logic:**
1. **Monthly tokens first** - Uses monthly allocation before purchased tokens
2. **Purchased tokens second** - Only uses purchased tokens when monthly is exhausted
3. **Watermark rules** - Lite users get watermarked tokens, Standard+ get clean

### **User Flow:**
1. **User hits monthly limit** → "Buy More Tokens" button appears
2. **User clicks button** → Token purchase modal opens
3. **User selects package** → Chooses 1, 2, or 5 tokens
4. **User completes purchase** → Tokens added to account
5. **User can export** → Uses purchased tokens immediately

### **Display Examples:**

#### **Lite User (1/month limit):**
```
Monthly: 1/1 used (watermarked)
Purchased: +2 tokens available (watermarked)
Total: 2 watermarked exports available

⚠️ Only 2 tokens left until December 1, 2024
[Buy More Tokens] - $4.95 each
```

#### **Standard User (3/month limit):**
```
Monthly: 3/3 used (no watermark)
Purchased: +2 tokens available (no watermark)
Total: 2 clean exports available

⚠️ Only 2 tokens left until December 1, 2024
[Buy More Tokens] - $4.95 each
```

## 💰 Pricing Strategy

### **Token Packages:**
- **1 Token:** $4.95 (no discount)
- **2 Tokens:** $9.90 (popular choice)
- **5 Tokens:** $19.80 (best value)

### **Revenue Potential:**
- **Standard user** hits 3/month limit → buys 2 tokens for $9.90
- **Instead of** upgrading to Premium ($12/month)
- **You get** immediate $9.90 without losing $8/month subscription

## 🔍 Testing Checklist

### ✅ **Database**
- [ ] `pdf_exports` table exists and tracks monthly usage
- [ ] `token_purchases` table exists and tracks purchases
- [ ] Helper functions work correctly
- [ ] RLS policies are active

### ✅ **User Experience**
- [ ] Monthly limits are enforced correctly
- [ ] "Buy More Tokens" button appears when needed
- [ ] Purchase modal opens and works
- [ ] Tokens are consumed in correct order
- [ ] Watermark rules are followed

### ✅ **Token Logic**
- [ ] **Lite users** get watermarked tokens
- [ ] **Standard users** get clean tokens
- [ ] **Premium/Lifetime** don't need tokens
- [ ] Monthly tokens used before purchased tokens

## 🛠️ Integration Points

### **Where the Token Display Appears:**

1. **User Dashboard**
```tsx
<PdfExportLimitDisplay className="mb-4" />
```

2. **Before PDF Export**
```tsx
<PdfExportLimitDisplay showDetails={false} />
```

3. **Account Settings**
```tsx
<PdfExportLimitDisplay className="mt-4" />
```

### **Purchase Button Triggers:**
- Shows when user has 1 or 0 monthly tokens remaining
- Hidden for Premium/Lifetime users (unlimited)
- Hidden when user has plenty of monthly tokens

## 📊 Monitoring

### **Key Metrics to Watch:**
- **Token purchase conversion rate** (users who buy when prompted)
- **Average tokens purchased** per user
- **Revenue from token sales** vs plan upgrades
- **User satisfaction** (reduced churn from limits)

### **Admin Queries:**
```sql
-- Get token purchase metrics
SELECT 
  COUNT(*) as total_purchases,
  SUM(tokens_purchased) as total_tokens_sold,
  SUM(purchase_amount) as total_revenue,
  AVG(tokens_purchased) as avg_tokens_per_purchase
FROM token_purchases
WHERE is_active = true;

-- Get users who purchased tokens
SELECT 
  u.email,
  COUNT(tp.id) as purchase_count,
  SUM(tp.tokens_purchased) as total_tokens,
  SUM(tp.purchase_amount) as total_spent
FROM token_purchases tp
JOIN auth.users u ON tp.user_id = u.id
WHERE tp.is_active = true
GROUP BY u.id, u.email
ORDER BY total_spent DESC;
```

## 🎉 Success Indicators

After deployment, you should see:

1. **✅ Token purchases** - Users buying tokens when they hit limits
2. **✅ Revenue increase** - Additional income from token sales
3. **✅ Reduced upgrades** - Fewer forced plan upgrades
4. **✅ User satisfaction** - Less frustration from hitting limits
5. **✅ Clear tracking** - All token usage properly recorded

## 🆘 Troubleshooting

### **Common Issues:**

1. **"Buy More Tokens" button not appearing**
   - Check if user has monthly tokens remaining
   - Verify user tier is not Premium/Lifetime

2. **Tokens not being consumed**
   - Check database connection
   - Verify token purchase records exist

3. **Wrong watermark applied**
   - Check user tier logic
   - Verify Lite users get watermarked tokens

4. **Purchase not completing**
   - Check Stripe integration (currently simulated)
   - Verify database insert permissions

### **Support:**
If you encounter issues, check:
- Supabase logs for database errors
- Browser console for frontend errors
- Network tab for API failures

## 🔮 Future Enhancements

### **Potential Improvements:**
- **Stripe integration** for real payments
- **Bulk token discounts** (10 tokens for $45)
- **Token expiration** (6-month expiry)
- **Admin token management** (gift tokens to users)
- **Usage analytics** (track token consumption patterns)

---

**🎯 Ready to deploy!** The token purchasing system will provide flexible options for users and additional revenue for your business.


