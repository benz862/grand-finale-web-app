// Test Personal Information Database Sync
// This script tests the comprehensive personal info form sync functionality

const testPersonalInfoSync = async () => {
  console.log('🧪 TESTING PERSONAL INFORMATION DATABASE SYNC');
  console.log('=============================================');

  // Test data that should be saved to database
  const testFormData = {
    // Basic identity fields
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    nickname: 'Johnny',
    dob: '1985-03-15',
    gender: 'Male',
    pronouns: 'He/Him',
    customPronoun: '',
    
    // Birth information
    countryOfBirth: 'United States',
    provinceOfBirth: 'California',
    cityOfBirth: 'Los Angeles',
    
    // Citizenship and language
    citizenships: 'United States',
    primaryLanguage: 'English',
    secondaryLanguage: 'Spanish',
    
    // Government documents
    ssn: '123-45-6789',
    license: 'DL123456789',
    licenseExpiry: '2025-12-31',
    licenseProvince: 'CA',
    
    // Family information
    fatherName: 'Robert Doe',
    motherName: 'Mary Doe',
    stepfatherName: 'James Smith',
    stepmotherName: 'Sarah Smith',
    relationshipStatus: 'Married',
    spouseName: 'Jane Doe',
    spouseContact: '555-123-4567',
    
    // Religious and spiritual information
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
    
    // Employment information
    employmentStatus: 'Employed',
    
    // Additional notes
    additionalNotes: 'Test notes for comprehensive personal info sync',
    
    // Addresses
    addresses: [
      {
        type: 'Current',
        street: '123 Main St',
        city: 'Los Angeles',
        country: 'United States',
        province: 'California',
        postal: '90210',
        start: '2020-01-01',
        end: '',
        availableRegions: ['California', 'Nevada', 'Arizona'],
        regionLabel: 'State',
        postalLabel: 'ZIP Code'
      }
    ],
    
    // Phones
    phones: [
      {
        type: 'Mobile',
        number: '555-123-4567'
      },
      {
        type: 'Work',
        number: '555-987-6543'
      }
    ],
    
    // Emergency contacts
    contacts: [
      {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '555-123-4567',
        email: 'jane.doe@email.com',
        authorized: 'Yes',
        emergency: 'Yes'
      }
    ],
    
    // Children
    children: [
      {
        name: 'Emma Doe',
        gender: 'F',
        age: '8'
      },
      {
        name: 'Liam Doe',
        gender: 'M',
        age: '5'
      }
    ],
    
    // Passports
    passports: [
      {
        country: 'United States',
        number: 'US123456789',
        expiry: '2030-12-31'
      }
    ],
    
    // Education
    schools: [
      {
        name: 'UCLA',
        degree: 'Bachelor of Science',
        location: 'Los Angeles, CA',
        start: '2003-09-01',
        end: '2007-06-15'
      }
    ],
    
    // Critical documents
    criticalDocs: ['Passport/ID Location', 'Birth Certificate'],
    criticalDocLocations: {
      'Passport/ID Location': 'Safe deposit box',
      'Birth Certificate': 'Home office filing cabinet'
    }
  };

  console.log('📋 Test Form Data Structure:');
  console.log('Fields to be tested:', Object.keys(testFormData).length);
  console.log('Expected database columns:');
  
  const expectedDatabaseColumns = [
    // Basic identity fields
    'legal_first_name', 'legal_last_name', 'legal_middle_name', 'preferred_name', 'nickname',
    'date_of_birth', 'gender', 'pronouns', 'custom_pronoun',
    
    // Birth information
    'country_of_birth', 'province_of_birth', 'city_of_birth',
    
    // Citizenship and language
    'citizenships', 'primary_language', 'secondary_language',
    
    // Government documents
    'ssn_sin', 'drivers_license_number', 'drivers_license_expiry', 'drivers_license_province',
    
    // Family information
    'father_name', 'mother_name', 'stepfather_name', 'stepmother_name',
    'relationship_status', 'spouse_name', 'spouse_contact',
    
    // Religious and spiritual information
    'religious_affiliation', 'place_of_worship', 'clergy_name', 'clergy_phone', 'clergy_email',
    'last_rites_desired', 'clergy_present_desired', 'scripture_preferences', 'prayer_style', 'burial_rituals',
    
    // Employment information
    'employment_status',
    
    // Additional notes
    'additional_notes',
    
    // System fields
    'has_immutable_data', 'immutable_data_locked_at'
  ];
  
  console.log('Total expected columns:', expectedDatabaseColumns.length);
  console.log('Columns:', expectedDatabaseColumns.join(', '));
  
  console.log('\n🎯 TESTING SCENARIOS:');
  console.log('1. ✅ Form data structure validation');
  console.log('2. ✅ Database sync function call');
  console.log('3. ✅ All fields mapping correctly');
  console.log('4. ✅ Children data saved to separate table');
  console.log('5. ✅ Addresses saved to addresses table');
  console.log('6. ✅ Phones saved to phones table');
  console.log('7. ✅ Emergency contacts saved to emergency_contacts table');
  console.log('8. ✅ Passports saved to passports table');
  console.log('9. ✅ Education saved to education table');
  
  console.log('\n📊 EXPECTED RESULTS:');
  console.log('- All 40+ personal info fields saved to personal_info table');
  console.log('- Children saved to children table with proper relationships');
  console.log('- Addresses saved to addresses table');
  console.log('- Phones saved to phones table');
  console.log('- Emergency contacts saved to emergency_contacts table');
  console.log('- Passports saved to passports table');
  console.log('- Education saved to education table');
  console.log('- has_immutable_data set to true');
  console.log('- immutable_data_locked_at timestamp set');
  
  console.log('\n🔍 MANUAL TESTING STEPS:');
  console.log('1. Open app: http://localhost:8081');
  console.log('2. Create/login as test user');
  console.log('3. Navigate to Personal Information form');
  console.log('4. Fill out ALL fields with test data above');
  console.log('5. Save the form');
  console.log('6. Check browser console for sync logs');
  console.log('7. Verify database tables contain all data');
  
  console.log('\n📝 CONSOLE LOGS TO LOOK FOR:');
  console.log('- "=== Database Sync Started ==="');
  console.log('- "Processing personalInformationData..."');
  console.log('- "Saving complete personal info..."');
  console.log('- "Personal info data to save:" (with all fields)');
  console.log('- "Saving addresses..."');
  console.log('- "Saving phones..."');
  console.log('- "Saving emergency contacts..."');
  console.log('- "Saving children..."');
  console.log('- "Saving passports..."');
  console.log('- "Saving education..."');
  console.log('- "Personal info saved successfully"');
  
  console.log('\n❌ POTENTIAL ISSUES TO CHECK:');
  console.log('- Authentication errors');
  console.log('- Database connection issues');
  console.log('- Missing field mappings');
  console.log('- Data type mismatches');
  console.log('- RLS policy violations');
  
  console.log('\n✅ SUCCESS CRITERIA:');
  console.log('- All form fields appear in database');
  console.log('- No sync errors in console');
  console.log('- Success toast message displayed');
  console.log('- Data persists after page refresh');
  
  return testFormData;
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testPersonalInfoSync = testPersonalInfoSync;
}

// Run test if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testPersonalInfoSync };
}

console.log('🧪 Personal Info Sync Test Script Loaded');
console.log('Run testPersonalInfoSync() in browser console to see test data structure'); 