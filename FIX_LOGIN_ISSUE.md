# 🔧 FIX TEST ACCOUNT LOGIN ISSUE

## 🚨 Problem
The test accounts `test.lite@epoxydogs.com` and `test.standard@epoxydogs.com` are not working to log in.

## 🔍 Root Cause
The test accounts haven't been created in your Supabase database yet. They only exist in the SQL scripts but haven't been executed.

## ✅ Solution Steps

### **Step 1: Open Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **"New Query"**

### **Step 2: Run Verification Script**
1. Copy and paste the contents of `verify_test_accounts.sql` into the SQL Editor
2. Click **"Run"** to check current status
3. **Expected Result**: Should show no test accounts exist yet

### **Step 3: Create Test Accounts**
1. Copy and paste the contents of `create_test_accounts_fixed.sql` into a new SQL query
2. Click **"Run"** to create the test accounts
3. **Expected Result**: Should show "Lite test account created successfully" and "Standard test account created successfully"

### **Step 4: Verify Accounts Created**
1. Run the verification script again from Step 2
2. **Expected Result**: Should now show both test accounts with "✅ Email Confirmed" status

### **Step 5: Test Login**
1. Go to `http://localhost:8080/` (your development server)
2. Click **"Sign In"** or **"Login"**
3. Try logging in with:
   - **Email**: `test.lite@epoxydogs.com`
   - **Password**: `testpassword123`
4. **Expected Result**: Should successfully log in

## 🎯 Test Account Details

### **Lite Test Account**
- **Email**: `test.lite@epoxydogs.com`
- **Password**: `testpassword123`
- **Plan**: Lite Edition
- **Monthly Limit**: 1 PDF export/month
- **Watermark**: Yes (watermarked exports)

### **Standard Test Account**
- **Email**: `test.standard@epoxydogs.com`
- **Password**: `testpassword123`
- **Plan**: Standard Edition
- **Monthly Limit**: 3 PDF exports/month
- **Watermark**: No (clean exports)

## 🔧 Alternative: Quick Account Creation

If you prefer, you can also create the accounts manually in Supabase:

### **Manual Creation Steps:**
1. Go to **Authentication** → **Users** in Supabase
2. Click **"Add User"**
3. Enter the test account details:
   - Email: `test.lite@epoxydogs.com`
   - Password: `testpassword123`
   - Check "Email Confirmed"
4. Repeat for `test.standard@epoxydogs.com`

## 🚨 Troubleshooting

### **If accounts still don't work after creation:**

1. **Check Email Confirmation**
   ```sql
   SELECT email, email_confirmed_at FROM auth.users 
   WHERE email IN ('test.lite@epoxydogs.com', 'test.standard@epoxydogs.com');
   ```

2. **Check Authentication Settings**
   - Go to **Authentication** → **Settings** in Supabase
   - Ensure "Enable email confirmations" is OFF for testing
   - Or ensure "Enable email confirmations" is ON and accounts are confirmed

3. **Check RLS Policies**
   - Go to **Authentication** → **Policies** in Supabase
   - Ensure users can access the necessary tables

4. **Check Environment Variables**
   - Verify your `.env.local` file has correct Supabase URL and keys
   - Ensure the keys match your Supabase project

### **Common Issues:**

1. **"Invalid login credentials"**
   - Account doesn't exist in database
   - Password is incorrect
   - Email confirmation required

2. **"Email not confirmed"**
   - Set `email_confirmed_at` to current timestamp in database
   - Or disable email confirmation in Supabase settings

3. **"Cannot connect to database"**
   - Check Supabase URL and keys in environment variables
   - Verify internet connection

## ✅ Success Criteria

After following these steps, you should be able to:
- ✅ Log in with `test.lite@epoxydogs.com` / `testpassword123`
- ✅ Log in with `test.standard@epoxydogs.com` / `testpassword123`
- ✅ Access the main application at `/app`
- ✅ See different plan limitations for each account
- ✅ Test PDF export limits and token purchasing

## 🎯 Next Steps

Once the test accounts are working:
1. Follow the **LITE_STANDARD_TESTING_PLAN.md** for comprehensive testing
2. Test PDF export limits (1 for Lite, 3 for Standard)
3. Test token purchasing system
4. Verify watermark rules (Lite = watermarked, Standard = clean)

---

**🎯 Ready to fix the login issue!** Follow these steps and the test accounts should work perfectly.
