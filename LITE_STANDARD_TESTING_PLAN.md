# 🧪 LITE & STANDARD EDITION TESTING PLAN

## 📋 Current Status

You left off yesterday with testing dummy users for the **Lite** and **Standard** editions of The Grand Finale Web App. The test accounts have been created and are ready for comprehensive testing.

## 🎯 Test Accounts Available

### **Lite Test Account**
- **Email**: `test.lite@epoxydogs.com`
- **Password**: `testpassword123`
- **Plan**: Lite Edition
- **Monthly Limit**: 1 PDF export/month
- **Watermark**: Yes (watermarked exports)
- **Token Purchase**: Available ($4.95 per token)

### **Standard Test Account**
- **Email**: `test.standard@epoxydogs.com`
- **Password**: `testpassword123`
- **Plan**: Standard Edition
- **Monthly Limit**: 3 PDF exports/month
- **Watermark**: No (clean exports)
- **Token Purchase**: Available ($4.95 per token)

## 🚀 Testing Checklist

### **PHASE 1: Basic Authentication & Navigation**

#### ✅ Test 1: Lite Account Login
1. **Navigate to**: `http://localhost:8080` (or your dev server URL)
2. **Action**: Click "Sign In"
3. **Enter**:
   - Email: `test.lite@epoxydogs.com`
   - Password: `testpassword123`
4. **Expected Result**: 
   - ✅ Successfully logged in
   - ✅ No authentication errors
   - ✅ User email appears in console logs

#### ✅ Test 2: Standard Account Login
1. **Action**: Sign out (if logged in)
2. **Action**: Click "Sign In"
3. **Enter**:
   - Email: `test.standard@epoxydogs.com`
   - Password: `testpassword123`
4. **Expected Result**: 
   - ✅ Successfully logged in
   - ✅ No authentication errors
   - ✅ User email appears in console logs

#### ✅ Test 3: Form Navigation
1. **Action**: Navigate through all 17 sections using the form progression
2. **Expected Result**:
   - ✅ All forms load without errors
   - ✅ Navigation buttons work properly
   - ✅ Audio players load correctly
   - ✅ No plan-specific restrictions on form access

---

### **PHASE 2: Data Entry & Database Sync**

#### ✅ Test 4: Personal Information (Section 1)
1. **Navigate to**: Personal Information form
2. **Action**: Fill out comprehensive test data:
   ```javascript
   {
     firstName: 'John',
     middleName: 'Michael',
     lastName: 'Doe',
     nickname: 'Johnny',
     dob: '1985-03-15',
     gender: 'Male',
     pronouns: 'He/Him',
     countryOfBirth: 'United States',
     provinceOfBirth: 'California',
     cityOfBirth: 'Los Angeles',
     citizenships: 'United States',
     primaryLanguage: 'English',
     ssn: '123-45-6789',
     license: 'DL123456789',
     licenseExpiry: '2025-12-31',
     licenseProvince: 'CA',
     fatherName: 'Robert Doe',
     motherName: 'Mary Doe',
     relationshipStatus: 'Married',
     spouseName: 'Jane Doe',
     spouseContact: '555-123-4567',
     religiousAffiliation: 'Catholic',
     employmentStatus: 'Employed'
   }
   ```
3. **Action**: Click "Save & Continue"
4. **Expected Result**:
   - ✅ Green toast: "Success! Your personal information has been saved to the database and locally"
   - ✅ Console logs show successful database sync
   - ✅ Data persists after refresh

#### ✅ Test 5: Complete All Forms (Sections 2-17)
1. **Action**: Fill out at least one field in each remaining form
2. **Action**: Save each form
3. **Expected Result**:
   - ✅ All forms save successfully
   - ✅ Green success toasts for each form
   - ✅ No red error messages
   - ✅ Data syncs to database properly

---

### **PHASE 3: PDF Export Limit Testing**

#### ✅ Test 6: Lite Account - Monthly Limit Enforcement
1. **Login as**: `test.lite@epoxydogs.com`
2. **Action**: Navigate to Conclusion form (Section 17)
3. **Action**: Click "Generate PDF" or "Export My Legacy Plan"
4. **Expected Result**:
   - ✅ PDF generates successfully (watermarked)
   - ✅ Monthly usage shows: "1/1 used"
   - ✅ "Buy More Tokens" button appears
   - ✅ Cannot generate additional PDFs without purchasing tokens

#### ✅ Test 7: Standard Account - Monthly Limit Enforcement
1. **Login as**: `test.standard@epoxydogs.com`
2. **Action**: Navigate to Conclusion form (Section 17)
3. **Action**: Generate PDF 3 times
4. **Expected Result**:
   - ✅ First 3 PDFs generate successfully (no watermark)
   - ✅ Monthly usage shows: "3/3 used"
   - ✅ "Buy More Tokens" button appears after 3rd export
   - ✅ Cannot generate additional PDFs without purchasing tokens

---

### **PHASE 4: Token Purchasing System**

#### ✅ Test 8: Token Purchase Modal
1. **Action**: Click "Buy More Tokens" button
2. **Expected Result**:
   - ✅ Token purchase modal opens
   - ✅ Shows package options: 1 token ($4.95), 2 tokens ($9.90), 5 tokens ($19.80)
   - ✅ Modal displays correctly for both Lite and Standard accounts

#### ✅ Test 9: Token Purchase Flow (Simulated)
1. **Action**: Select a token package (e.g., 2 tokens for $9.90)
2. **Action**: Click "Purchase Tokens"
3. **Expected Result**:
   - ✅ Purchase completes (currently simulated)
   - ✅ Tokens added to account
   - ✅ Updated token count displayed
   - ✅ Can now generate additional PDFs

#### ✅ Test 10: Token Consumption Logic
1. **Action**: Generate additional PDFs using purchased tokens
2. **Expected Result**:
   - ✅ **Lite users**: Get watermarked PDFs from purchased tokens
   - ✅ **Standard users**: Get clean PDFs from purchased tokens
   - ✅ Token count decreases appropriately
   - ✅ Monthly limit resets on next month

---

### **PHASE 5: Plan-Specific Features**

#### ✅ Test 11: Watermark Verification
1. **Lite Account**: Generate PDF and verify watermark
2. **Standard Account**: Generate PDF and verify no watermark
3. **Expected Result**:
   - ✅ Lite PDFs have visible watermark
   - ✅ Standard PDFs are clean without watermark
   - ✅ Purchased tokens follow same watermark rules

#### ✅ Test 12: File Upload Restrictions
1. **Action**: Navigate to File Uploads & Multimedia form (Section 16)
2. **Action**: Try to upload files
3. **Expected Result**:
   - ✅ **Lite users**: File uploads may be restricted or limited
   - ✅ **Standard users**: File uploads work normally
   - ✅ Appropriate messaging for plan limitations

---

### **PHASE 6: Database Verification**

#### ✅ Test 13: Database Records Check
1. **Open**: Supabase Dashboard → Table Editor
2. **Check Tables**:
   - `auth.users` - Both test accounts exist
   - `pdf_exports` - Export records for both accounts
   - `token_purchases` - Purchase records (if tokens were bought)
   - All form data tables - Verify data was saved
3. **Expected Result**:
   - ✅ All user data properly stored
   - ✅ PDF export tracking works
   - ✅ Token purchase tracking works (if applicable)

#### ✅ Test 14: Monthly Reset Logic
1. **Action**: Check current month's usage
2. **Action**: Verify monthly limits are enforced
3. **Expected Result**:
   - ✅ Monthly limits reset on 1st of each month
   - ✅ Previous month's usage doesn't affect current month
   - ✅ Purchased tokens persist across months

---

### **PHASE 7: Error Handling & Edge Cases**

#### ✅ Test 15: Offline Functionality
1. **Action**: Disconnect internet connection
2. **Action**: Try to save data and generate PDFs
3. **Expected Result**:
   - ✅ Data saves locally
   - ✅ Appropriate offline messaging
   - ✅ No red error messages

#### ✅ Test 16: Token Purchase Edge Cases
1. **Action**: Try to purchase tokens when monthly limit not reached
2. **Action**: Try to purchase tokens with invalid payment info
3. **Expected Result**:
   - ✅ Purchase button only shows when needed
   - ✅ Appropriate error handling for failed purchases
   - ✅ User-friendly error messages

---

## 📊 Success Criteria

### **All Tests Pass When:**
- ✅ Both Lite and Standard accounts can log in successfully
- ✅ All forms save data to database without errors
- ✅ Monthly PDF limits are enforced correctly
- ✅ Watermark rules are followed (Lite = watermarked, Standard = clean)
- ✅ Token purchasing system works as expected
- ✅ Purchased tokens follow plan-specific rules
- ✅ Database records are accurate and complete
- ✅ Error handling works gracefully
- ✅ User experience is smooth and professional

### **Expected User Experience:**
- **Lite Users**: 
  - 1 watermarked PDF per month
  - Option to purchase additional watermarked tokens
  - Clear messaging about plan limitations
  
- **Standard Users**:
  - 3 clean PDFs per month
  - Option to purchase additional clean tokens
  - Full access to all features

---

## 🎯 Next Steps After Testing

### **If All Tests Pass:**
1. **Deploy to Production** - The token purchasing system is ready
2. **Monitor Usage** - Track token purchases and user behavior
3. **Gather Feedback** - Collect user feedback on the system
4. **Optimize Pricing** - Adjust token pricing based on usage data

### **If Issues Found:**
1. **Document Issues** - Note specific problems encountered
2. **Fix Bugs** - Address any technical issues
3. **Retest** - Run through the testing plan again
4. **Iterate** - Make improvements based on findings

---

## 🚨 Troubleshooting Guide

### **Common Issues:**

1. **"Cannot log in"**
   - Check if test accounts exist in Supabase
   - Verify email/password credentials
   - Check authentication settings

2. **"PDF generation fails"**
   - Check PDF export service configuration
   - Verify database permissions
   - Check console for specific errors

3. **"Token purchase not working"**
   - Verify token purchase table exists
   - Check Stripe integration (currently simulated)
   - Verify database insert permissions

4. **"Wrong watermark applied"**
   - Check user tier logic
   - Verify plan detection is working
   - Check PDF generation service

### **Support Commands:**
```sql
-- Check test accounts exist
SELECT email, created_at FROM auth.users 
WHERE email IN ('test.lite@epoxydogs.com', 'test.standard@epoxydogs.com');

-- Check PDF export usage
SELECT u.email, COUNT(pe.id) as exports_this_month
FROM auth.users u
LEFT JOIN pdf_exports pe ON u.id = pe.user_id 
  AND pe.month_year = to_char(CURRENT_DATE, 'YYYY-MM')
WHERE u.email IN ('test.lite@epoxydogs.com', 'test.standard@epoxydogs.com')
GROUP BY u.id, u.email;

-- Check token purchases
SELECT u.email, COUNT(tp.id) as purchases, SUM(tp.tokens_purchased) as total_tokens
FROM auth.users u
LEFT JOIN token_purchases tp ON u.id = tp.user_id AND tp.is_active = true
WHERE u.email IN ('test.lite@epoxydogs.com', 'test.standard@epoxydogs.com')
GROUP BY u.id, u.email;
```

---

**🎯 Ready to continue testing!** This comprehensive plan will ensure the Lite and Standard editions work perfectly with the token purchasing system.
