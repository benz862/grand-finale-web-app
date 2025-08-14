# 🧪 TEST ACCOUNT CREDENTIALS

## **Test User Account for Comprehensive Testing**

### **Account Details:**
- **Email**: `testuser@grandfinale.com`
- **Password**: `TestPassword123!`
- **Name**: John Michael Doe (Test User)

### **How to Use:**
1. **Open**: http://localhost:8081
2. **Click**: "Sign Up" or "Create Account"
3. **Enter**:
   - Email: `testuser@grandfinale.com`
   - Password: `TestPassword123!`
   - First Name: `John`
   - Last Name: `Doe`
4. **Complete registration**
5. **Login** with the same credentials

### **Alternative Test Accounts:**

#### **Account 1 (Primary Test):**
- Email: `testuser@grandfinale.com`
- Password: `TestPassword123!`

#### **Account 2 (Backup):**
- Email: `testuser2@grandfinale.com`
- Password: `TestPassword456!`

#### **Account 3 (Admin Test):**
- Email: `admin@grandfinale.com`
- Password: `AdminPassword789!`

### **Test Data to Use:**

#### **Personal Information Test Data:**
```javascript
{
  // Basic Identity
  firstName: 'John',
  middleName: 'Michael',
  lastName: 'Doe',
  nickname: 'Johnny',
  dob: '1985-03-15',
  gender: 'Male',
  pronouns: 'He/Him',
  
  // Birth Information
  countryOfBirth: 'United States',
  provinceOfBirth: 'California',
  cityOfBirth: 'Los Angeles',
  
  // Citizenship & Language
  citizenships: 'United States',
  primaryLanguage: 'English',
  secondaryLanguage: 'Spanish',
  
  // Government Documents
  ssn: '123-45-6789',
  license: 'DL123456789',
  licenseExpiry: '2025-12-31',
  licenseProvince: 'CA',
  
  // Family Information
  fatherName: 'Robert Doe',
  motherName: 'Mary Doe',
  stepfatherName: 'James Smith',
  stepmotherName: 'Sarah Smith',
  relationshipStatus: 'Married',
  spouseName: 'Jane Doe',
  spouseContact: '555-123-4567',
  
  // Religious & Spiritual
  religiousAffiliation: 'Catholic',
  placeOfWorship: 'St. Mary\'s Church',
  clergyName: 'Father Michael',
  clergyPhone: '555-987-6543',
  clergyEmail: 'father.michael@stmarys.org',
  lastRites: true,
  clergyPresent: true,
  scripturePreferences: 'Psalm 23',
  prayerStyle: 'Traditional',
  burialRituals: 'Catholic burial service',
  
  // Employment
  employmentStatus: 'Employed',
  
  // Additional Notes
  additionalNotes: 'Test notes for comprehensive personal info sync'
}
```

#### **Address Information:**
```javascript
{
  addresses: [
    {
      type: 'Current',
      street: '123 Main St',
      city: 'Los Angeles',
      country: 'United States',
      province: 'California',
      postal: '90210'
    }
  ]
}
```

#### **Phone Numbers:**
```javascript
{
  phones: [
    { type: 'Mobile', number: '555-123-4567' },
    { type: 'Work', number: '555-987-6543' }
  ]
}
```

#### **Emergency Contacts:**
```javascript
{
  contacts: [
    {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '555-123-4567',
      email: 'jane.doe@email.com',
      emergency: 'Yes'
    }
  ]
}
```

#### **Children:**
```javascript
{
  children: [
    { name: 'Emma Doe', gender: 'F', age: '8' },
    { name: 'Liam Doe', gender: 'M', age: '5' }
  ]
}
```

#### **Passports:**
```javascript
{
  passports: [
    {
      country: 'United States',
      number: 'US123456789',
      expiry: '2030-12-31'
    }
  ]
}
```

#### **Education:**
```javascript
{
  schools: [
    {
      name: 'UCLA',
      degree: 'Bachelor of Science',
      location: 'Los Angeles, CA',
      start: '2003-09-01',
      end: '2007-06-15'
    }
  ]
}
```

### **Testing Workflow:**

1. **Create Account**: Use test credentials above
2. **Login**: Verify authentication works
3. **Fill Personal Info**: Use comprehensive test data
4. **Save Form**: Check console logs and database
5. **Test Name Change**: Submit name change request
6. **Admin Panel**: Test approval workflow
7. **Verify Data**: Check all database tables

### **Expected Console Logs:**
```
=== Database Sync Started ===
User email: testuser@grandfinale.com
Form type: personalInformationData
Form data keys: [all form fields]
Processing personalInformationData...
Saving complete personal info...
Personal info data to save: [comprehensive data]
Saving addresses...
Saving phones...
Saving emergency contacts...
Saving children...
Saving passports...
Saving education...
Personal info saved successfully
```

### **Database Tables to Verify:**
- ✅ `personal_info` - All 40+ fields
- ✅ `children` - Emma and Liam Doe
- ✅ `addresses` - Current address
- ✅ `phones` - Mobile and work phones
- ✅ `emergency_contacts` - Jane Doe contact
- ✅ `passports` - US passport
- ✅ `education` - UCLA education
- ✅ `name_change_requests` - If testing name changes

### **Success Criteria:**
- ✅ Account creation successful
- ✅ Login works without email verification
- ✅ All form data saves to database
- ✅ No sync errors in console
- ✅ Data persists after refresh
- ✅ Admin workflows function (if testing)

**Ready to test with these credentials!** 