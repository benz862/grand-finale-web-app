# Support System Testing Guide

## 🚨 **Current Issue:**
You're not receiving emails or seeing support requests because the database table doesn't exist yet.

## 🔧 **Step 1: Set Up Database**

### **Option A: Quick Setup (Recommended)**
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the entire content from `setup_support_requests_complete.sql`
4. **Run the SQL script**
5. You should see: "Table created successfully" with a record count

### **Option B: Simple Setup**
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the entire content from `support_requests_table.sql`
4. **Run the SQL script**
5. Then run the content from `disable_rls_support_requests.sql`

## 🧪 **Step 2: Test the Form**

1. **Open your browser** to `http://localhost:8080`
2. **Click "Support"** button in the header
3. **Fill out the form** with test data:
   - Name: Test User
   - Email: test@example.com
   - Category: General Question
   - Subject: Test Support Request
   - Message: This is a test message
4. **Click "Send Message"**

## 📊 **Step 3: Check Results**

### **In Browser Console (F12 → Console):**
You should see:
```
Submitting support request: {name: "Test User", email: "test@example.com", ...}
Inserting support request with data: {user_id: null, name: "Test User", ...}
Support request submitted successfully: {id: "uuid-here", ...}
=== SUPPORT REQUEST EMAIL ===
To: support@skillbinder.com
Subject: The Grand Finale - Support Request
Body: [Full email content]
Support Data: [Complete request details]
============================
Support request email logged successfully (development mode)
```

### **In Supabase Dashboard:**
1. Go to **Table Editor**
2. Look for `support_requests` table
3. You should see your test request

## 📧 **Step 4: Email System Status**

### **Current Setup (Development):**
- ✅ **Email content logged** to browser console
- ❌ **No actual emails sent** (development mode)
- ✅ **Database storage** working (after setup)

### **To Enable Real Emails:**
1. Follow the `EMAIL_SETUP_GUIDE.md`
2. Set up SendGrid or another email service
3. Deploy the email API function

## 🐛 **Troubleshooting:**

### **If you see "Submission Error":**
- Database table doesn't exist → Run SQL setup
- RLS policies blocking → Run RLS fix scripts
- Network error → Check Supabase connection

### **If no console logs:**
- Form not submitting → Check browser console for errors
- JavaScript error → Check for syntax errors

### **If database error:**
- Table missing → Run `setup_support_requests_complete.sql`
- Permission denied → Run `disable_rls_support_requests.sql`

## 🎯 **Expected Results:**

After running the SQL setup:
1. ✅ **Form submits successfully**
2. ✅ **Redirects to success page**
3. ✅ **Email content in console**
4. ✅ **Request saved to database**
5. ✅ **No error messages**

## 📞 **Next Steps:**

1. **Run the database setup** (SQL script)
2. **Test the form** with the guide above
3. **Check console logs** for email content
4. **Verify database** has the request
5. **Set up real email** if needed

The system is working correctly - you just need to create the database table first! 