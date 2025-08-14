import { supabase } from './supabase';
import { savePersonalInfo, saveAddresses, savePhones, saveEmails, saveEmergencyContacts, saveChildren, savePassports, saveEducation, saveDocumentStorage, saveWorkCareer, saveSecurityDigitalAccess, saveMedicalInfo, saveLegalEstate, saveFinanceBusiness, saveBeneficiariesInheritance, savePersonalPropertyRealEstate, saveDigitalLife, saveKeyContacts, saveFuneralFinalArrangements, saveAccountsMemberships, savePetsAnimalCare, saveShortLetters, saveFinalWishesLegacyPlanning, saveBucketListUnfinishedBusiness, saveFormalLetters, saveFileUploadsMultimedia, saveConclusion } from './database';

export interface DatabaseSyncOptions {
  userEmail: string;
  formType: string;
  formData: any;
}

export const syncFormDataToDatabase = async (options: DatabaseSyncOptions) => {
  const { userEmail, formType, formData } = options;

  try {
    console.log('=== Database Sync Started ===');
    console.log('User email:', userEmail);
    console.log('Form type:', formType);
    console.log('Form data keys:', Object.keys(formData || {}));

    // Get the current authenticated user from Supabase Auth
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      console.error('No authenticated user found:', authError);
      return { success: false, error: 'No authenticated user found. Please log in first.' };
    }

    // Verify the authenticated user's email matches the provided email
    if (authUser.email !== userEmail) {
      console.error('Email mismatch:', { authEmail: authUser.email, providedEmail: userEmail });
      return { success: false, error: 'Email mismatch. Please log in with the correct account.' };
    }

    // Use the Supabase Auth user ID directly
    const userId = authUser.id;
    console.log('Using Supabase Auth user ID:', userId);

    // Ensure user exists in our custom users table (for backward compatibility)
    // This will only create a record if it doesn't exist, preventing duplicates
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (!existingUser && !selectError) {
      console.log('Creating user record in custom users table for backward compatibility...');
      const { error: insertError } = await supabase
        .from('users')
        .insert({ 
          id: userId, // Use the same ID as Supabase Auth
          email: userEmail 
        });

      if (insertError) {
        console.error('Failed to create user record in custom table:', insertError);
        // Don't fail the sync if this fails, just log it
      }
    } else if (existingUser) {
      console.log('User already exists in custom users table');
    }

    switch (formType) {
      case 'personalContactData':
        // Save addresses, phones, and emails
        if (formData.addresses) {
          console.log('Saving addresses...');
          await saveAddresses(userId, formData.addresses);
        }
        if (formData.phones) {
          console.log('Saving phones...');
          await savePhones(userId, formData.phones);
        }
        if (formData.emails) {
          console.log('Saving emails...');
          await saveEmails(userId, formData.emails);
        }
        break;

      case 'personalInformationData':
        console.log('Processing personalInformationData...');
        
        // Save comprehensive personal info with ALL form fields
        if (formData.firstName && formData.lastName) {
          console.log('Saving complete personal info...');
          
          // First, get existing data to preserve fields that aren't being updated
          const { data: existingData, error: fetchError } = await supabase
            .from('personal_info')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Error fetching existing data:', fetchError);
          }
          
          // Create the data object with all available fields, preserving existing data
          const personalInfoData: any = {
            // Basic identity fields - only update if provided
            legal_first_name: formData.firstName,
            legal_last_name: formData.lastName,
            legal_middle_name: formData.middleName || existingData?.legal_middle_name || null,
            preferred_name: formData.preferredName || formData.nickname || existingData?.preferred_name || null,
            nickname: formData.nickname || existingData?.nickname || null,
            date_of_birth: formData.dob,
            
            // Gender and pronouns - preserve existing if not provided
            gender: formData.gender || existingData?.gender || null,
            pronouns: formData.pronouns || existingData?.pronouns || null,
            custom_pronoun: formData.customPronoun || existingData?.custom_pronoun || null,
            
            // Birth information - preserve existing if not provided
            place_of_birth: formData.placeOfBirth || formData.cityOfBirth || existingData?.place_of_birth || null,
            country_of_birth: formData.countryOfBirth || existingData?.country_of_birth || null,
            province_of_birth: formData.provinceOfBirth || existingData?.province_of_birth || null,
            city_of_birth: formData.cityOfBirth || existingData?.city_of_birth || null,
            
            // Citizenship and language - preserve existing if not provided
            country_of_citizenship: formData.countryOfCitizenship || formData.citizenships || existingData?.country_of_citizenship || null,
            citizenships: formData.citizenships || existingData?.citizenships || null,
            citizenship_countries: formData.citizenshipCountries || formData.citizenships || existingData?.citizenship_countries || null,
            language_spoken: formData.languageSpoken || formData.primaryLanguage || existingData?.language_spoken || null,
            primary_language: formData.primaryLanguage || existingData?.primary_language || null,
            secondary_language: formData.secondaryLanguage || existingData?.secondary_language || null,
            
            // Government documents - preserve existing if not provided
            ssn_sin: formData.ssn || existingData?.ssn_sin || null,
            drivers_license_number: formData.license || formData.driversLicense || existingData?.drivers_license_number || null,
            drivers_license_expiry: formData.licenseExpiry || existingData?.drivers_license_expiry || null,
            drivers_license_province: formData.licenseProvince || existingData?.drivers_license_province || null,
            
            // Family information - preserve existing if not provided
            father_name: formData.fatherName || existingData?.father_name || null,
            mother_name: formData.motherName || existingData?.mother_name || null,
            stepfather_name: formData.stepfatherName || existingData?.stepfather_name || null,
            stepmother_name: formData.stepmotherName || existingData?.stepmother_name || null,
            relationship_status: formData.relationshipStatus || existingData?.relationship_status || null,
            spouse_name: formData.spouseName || existingData?.spouse_name || null,
            spouse_contact: formData.spouseContact || existingData?.spouse_contact || null,
            
            // Religious and spiritual information - preserve existing if not provided
            religious_affiliation: formData.religiousAffiliation || existingData?.religious_affiliation || null,
            place_of_worship: formData.placeOfWorship || existingData?.place_of_worship || null,
            clergy_name: formData.clergyName || existingData?.clergy_name || null,
            clergy_phone: formData.clergyPhone || existingData?.clergy_phone || null,
            clergy_email: formData.clergyEmail || existingData?.clergy_email || null,
            last_rites_desired: formData.lastRites !== undefined ? formData.lastRites : (existingData?.last_rites_desired || false),
            clergy_present_desired: formData.clergyPresent !== undefined ? formData.clergyPresent : (existingData?.clergy_present_desired || false),
            scripture_preferences: formData.scripturePreferences || existingData?.scripture_preferences || null,
            prayer_style: formData.prayerStyle || existingData?.prayer_style || null,
            burial_rituals: formData.burialRituals || existingData?.burial_rituals || null,
            
            // Employment information - preserve existing if not provided
            employment_status: formData.employmentStatus || existingData?.employment_status || null,
            
            // Additional notes - preserve existing if not provided
            additional_notes: formData.additionalNotes || existingData?.additional_notes || null,
            
            // Preserve existing immutable data flags
            has_immutable_data: existingData?.has_immutable_data || true,
            immutable_data_locked_at: existingData?.immutable_data_locked_at || new Date().toISOString()
          };
          
          console.log('Personal info data to save:', personalInfoData);
          await savePersonalInfo(userId, personalInfoData);
        }

        // Save addresses if available
        if (formData.addresses && Array.isArray(formData.addresses)) {
          console.log('Saving addresses...');
          console.log('Raw addresses data:', formData.addresses);
          const formattedAddresses = formData.addresses
            .filter((addr: any) => addr.street && addr.city) // Only save addresses with required fields
            .map((addr: any) => ({
              address_type: addr.type || 'current',
              street: addr.street || '',
              city: addr.city || '',
              state: addr.province || '',
              zip: addr.postal || '',
              country: addr.country || '',
              is_primary: addr.type === 'Current'
            }));
          
          console.log('Formatted addresses:', formattedAddresses);
          
          if (formattedAddresses.length > 0) {
            console.log('Calling saveAddresses with userId:', userId);
            await saveAddresses(userId, formattedAddresses);
            console.log('Addresses saved successfully');
          } else {
            console.log('No addresses to save (all filtered out)');
          }
        } else {
          console.log('No addresses data found in formData');
        }

        // Save phones if available
        if (formData.phones && Array.isArray(formData.phones)) {
          console.log('Saving phones...');
          const formattedPhones = formData.phones
            .filter((phone: any) => phone.number) // Only save phones with numbers
            .map((phone: any) => ({
              phone_type: phone.type || 'mobile',
              phone_number: phone.number || '',
              is_primary: phone.type === 'Mobile'
            }));
          
          if (formattedPhones.length > 0) {
            await savePhones(userId, formattedPhones);
          }
        }

        // Save emergency contacts if available
        if (formData.contacts && Array.isArray(formData.contacts)) {
          console.log('Saving emergency contacts...');
          const formattedContacts = formData.contacts
            .filter((contact: any) => contact.name && contact.phone) // Only save contacts with name and phone
            .map((contact: any) => ({
              full_name: contact.name || '',
              relationship: contact.relationship || '',
              phone: contact.phone || '',
              email: contact.email || '',
              is_primary: contact.emergency === 'Yes'
            }));
          
          if (formattedContacts.length > 0) {
            await saveEmergencyContacts(userId, formattedContacts);
          }
        }

        // Save children if available
        if (formData.children && Array.isArray(formData.children)) {
          console.log('Saving children...');
          const formattedChildren = formData.children
            .filter((child: any) => child.name) // Only save children with names
            .map((child: any) => ({
              child_name: child.name || '',
              child_gender: child.gender || null,
              child_dob: child.age ? null : null, // Age is provided, not DOB in this form
              relationship_to_child: 'child', // Default relationship
              child_contact: null // Not provided in current form structure
            }));
          
          if (formattedChildren.length > 0) {
            await saveChildren(userId, formattedChildren);
          }
        }

        // Save passports if available
        if (formData.passports && Array.isArray(formData.passports)) {
          console.log('Saving passports...');
          const formattedPassports = formData.passports
            .filter((passport: any) => passport.country && passport.number) // Only save passports with country and number
            .map((passport: any) => ({
              country: passport.country || '',
              number: passport.number || '',
              expiry: passport.expiry || null
            }));
          
          if (formattedPassports.length > 0) {
            await savePassports(userId, formattedPassports);
          }
        }

        // Save education if available
        if (formData.schools && Array.isArray(formData.schools)) {
          console.log('Saving education...');
          const formattedEducation = formData.schools
            .filter((school: any) => school.name) // Only save schools with names
            .map((school: any) => ({
              school_name: school.name || '',
              degree: school.degree || null,
              field_of_study: school.fieldOfStudy || null,
              location: school.location || null,
              start_date: school.start || null,
              end_date: school.end || null,
              graduation_date: school.graduationDate || null,
              gpa: school.gpa || null,
              honors_awards: school.honorsAwards || null,
              activities_extracurricular: school.activities || null,
              notes: school.notes || null
            }));
          
          if (formattedEducation.length > 0) {
            await saveEducation(userId, formattedEducation);
          }
        }

        // Save critical documents if available
        if (formData.criticalDocs && Array.isArray(formData.criticalDocs)) {
          console.log('Saving critical documents...');
          const formattedDocuments = formData.criticalDocs
            .filter((doc: any) => doc.checked) // Only save checked documents
            .map((doc: any) => ({
              document_type: doc.name || '',
              has_document: true,
              location: formData.criticalDocLocations?.[doc.name] || null,
              notes: null
            }));
          
          if (formattedDocuments.length > 0) {
            await saveDocumentStorage(userId, formattedDocuments);
          }
        }

        // Save work career information if available
        if (formData.occupation || formData.employer || formData.workPhone) {
          console.log('Saving work career information...');
          const workCareerData = {
            occupation: formData.occupation || null,
            employer: formData.employer || null,
            employer_address: formData.employerAddress || null,
            work_phone: formData.workPhone || null,
            supervisor_name: formData.supervisorName || null,
            work_notes: formData.workNotes || null
          };
          await saveWorkCareer(userId, workCareerData);
        }

        // Save security and digital access information if available
        if (formData.willLocation || formData.unlockCode || formData.passwordManager) {
          console.log('Saving security and digital access information...');
          const securityData = {
            will_location: formData.willLocation || null,
            unlock_code: formData.unlockCode || null,
            password_manager: formData.passwordManager || null,
            backup_code_storage: formData.backupCodeStorage || null,
            key_accounts: formData.keyAccounts || null,
            digital_docs_location: formData.digitalDocsLocation || null
          };
          await saveSecurityDigitalAccess(userId, securityData);
        }
        break;

      case 'legalBiographicalData':
        // Save personal info
        if (formData.fullName) {
          const [firstName, ...lastNameParts] = formData.fullName.split(' ');
          const lastName = lastNameParts.join(' ');
          
          await savePersonalInfo(userId, {
            legal_first_name: firstName,
            legal_last_name: lastName,
            preferred_name: formData.preferredName || '',
            date_of_birth: formData.dateOfBirth,
            place_of_birth: formData.placeOfBirthCity,
            country_of_citizenship: formData.countryOfCitizenship,
            language_spoken: formData.languageSpoken || ''
          });
        }
        break;

      case 'emergencyContacts':
        // Save emergency contacts
        if (formData && Array.isArray(formData)) {
          await saveEmergencyContacts(userId, formData);
        }
        break;

      case 'medicalInfoData':
        console.log('Processing medicalInfoData...');
        
        // Save medical information to a dedicated medical_info table
        const medicalInfoData = {
          // Physician Information
          physicians: formData.physicians || [],
          
          // Health Insurance & ID
          insurance_notes: formData.insuranceNotes || null,
          
          // Medications
          medications: formData.medications || [],
          supplements: formData.supplements || null,
          
          // Pharmacy Info
          pharmacy_name: formData.pharmacyName || null,
          pharmacy_phone: formData.pharmacyPhone || null,
          
          // Allergies & Reactions
          allergies: formData.allergies || null,
          reactions: formData.reactions || null,
          
          // Medical History
          chronic_illnesses: formData.chronicIllnesses || [],
          surgeries: formData.surgeries || [],
          hospitalizations: formData.hospitalizations || [],
          
          // Organ Donation & Advance Directives
          organ_donor: formData.organDonor || 'No',
          organ_donor_state: formData.organDonorState || null,
          organ_donor_location: formData.organDonorLocation || null,
          living_will: formData.livingWill || 'No',
          living_will_date: formData.livingWillDate || null,
          living_will_location: formData.livingWillLocation || null,
          dnr: formData.dnr || 'No',
          dnr_date: formData.dnrDate || null,
          dnr_location: formData.dnrLocation || null,
          
          // Healthcare Proxy
          proxy_name: formData.proxyName || null,
          proxy_relationship: formData.proxyRelationship || null,
          proxy_phone: formData.proxyPhone || null,
          proxy_email: formData.proxyEmail || null,
          proxy_location: formData.proxyLocation || null,
          
          // Insurance Details
          primary_provider: formData.primaryProvider || null,
          policy_number: formData.policyNumber || null,
          policyholder: formData.policyholder || null,
          insurance_phone: formData.insurancePhone || null,
          secondary_coverage: formData.secondaryCoverage || null,
          
          // Preferred Facilities
          nearest_er: formData.nearestER || null,
          preferred_hospital: formData.preferredHospital || null,
          
          // Additional Notes
          additional_notes: formData.additionalNotes || null
        };
        
        console.log('Medical info data to save:', medicalInfoData);
        await saveMedicalInfo(userId, medicalInfoData);
        break;

      case 'legalEstateData':
        console.log('Processing legalEstateData...');
        
        // Save legal & estate information to a dedicated legal_estate table
        const legalEstateData = {
          // Will & Estate Overview
          will_exists: formData.will_exists || 'No',
          will_location: formData.will_location || null,
          will_date: formData.will_date || null,
          estate_value: formData.estate_value || null,
          estate_notes: formData.estate_notes || null,
          
          // Lawyer Information (stored as JSON array)
          lawyers: formData.lawyers || [],
          
          // Legal and Financial Contacts (stored as JSON array)
          contacts: formData.contacts || [],
          
          // Executor Details (dynamic array)
          executors: formData.executors || [],
          
          // Alternate Executors (dynamic array)
          alternate_executors: formData.alternate_executors || [],
          
          // Power of Attorney (dynamic arrays)
          financial_poa: formData.financial_poa || [],
          healthcare_proxies: formData.healthcare_proxies || [],
          other_poa: formData.other_poa || [],
          
          // Personal Safes (dynamic array)
          safes: formData.safes || [],
          
          // Safe Deposit Boxes (dynamic array)
          safe_deposit_boxes: formData.safe_deposit_boxes || [],
          
          // Supporting Legal Documents
          trust_exists: formData.trust_exists || 'No',
          trust_name: formData.trust_name || null,
          trust_date: formData.trust_date || null,
          trust_location: formData.trust_location || null,
          living_will: formData.living_will || 'No',
          living_will_date: formData.living_will_date || null,
          living_will_location: formData.living_will_location || null,
          healthcare_proxy: formData.healthcare_proxy || 'No',
          healthcare_proxy_name: formData.healthcare_proxy_name || null,
          healthcare_proxy_date: formData.healthcare_proxy_date || null,
          healthcare_proxy_location: formData.healthcare_proxy_location || null,
          
          // Additional Notes
          additional_notes: formData.additional_notes || null
        };
        
        console.log('Legal estate data to save:', legalEstateData);
        await saveLegalEstate(userId, legalEstateData);
        break;

      case 'financeBusinessData':
        console.log('Processing financeBusinessData...');
        
        // Save finance & business information to a dedicated finance_business table
        const financeBusinessData = {
          // Bank Accounts (stored as JSON array)
          bank_accounts: formData.bankAccounts || [],
          
          // Cash on Hand (stored as JSON array)
          cash_on_hand: formData.cashOnHand || [],
          
          // Investments (stored as JSON array)
          investments: formData.investments || [],
          
          // Retirement Plans (stored as JSON array)
          retirement_plans: formData.retirementPlans || [],
          
          // Crypto & Metals (stored as JSON array)
          crypto_metals: formData.cryptoMetals || [],
          
          // Income Sources (stored as JSON array)
          income_sources: formData.incomeSources || [],
          
          // Liabilities (stored as JSON array)
          liabilities: formData.liabilities || [],
          
          // Vehicles (stored as JSON array)
          vehicles: formData.vehicles || [],
          
          // Properties (stored as JSON array)
          properties: formData.properties || [],
          
          // Business Ownership (stored as JSON array)
          businesses: formData.businesses || [],
          
          // Financial Advisor
          advisor_name: formData.advisorName || null,
          advisor_phone: formData.advisorPhone || null,
          advisor_email: formData.advisorEmail || null,
          
          // Statement Access
          statement_storage: formData.statementStorage || null,
          storage_location: formData.storageLocation || null
        };
        
        console.log('Finance business data to save:', financeBusinessData);
        await saveFinanceBusiness(userId, financeBusinessData);
        break;

      case 'beneficiariesInheritanceData':
        console.log('Processing beneficiariesInheritanceData...');
        
        // Save beneficiaries & inheritance information to a dedicated beneficiaries_inheritance table
        const beneficiariesInheritanceData = {
          // Life and Health Insurance Policies (stored as JSON array)
          insurance_policies: formData.insurancePolicies || [],
          
          // Employee Benefits (stored as JSON array)
          employee_benefits: formData.employeeBenefits || [],
          
          // Social Security (stored as JSON array)
          social_security_benefits: formData.socialSecurityBenefits || [],
          
          // Retirement (stored as JSON array)
          retirement_benefits: formData.retirementBenefits || [],
          
          // Veteran's Benefits (stored as JSON array)
          veteran_benefits: formData.veteranBenefits || [],
          
          // Primary & Contingent Beneficiaries (stored as JSON array)
          beneficiary_groups: formData.beneficiaryGroups || [],
          
          // Assigned Beneficiaries on Accounts (stored as JSON array)
          assigned_beneficiaries: formData.assignedBeneficiaries || [],
          
          // Specific Bequests (stored as JSON array)
          specific_bequests: formData.specificBequests || [],
          
          // Messages or Letters for Beneficiaries (stored as JSON array)
          beneficiary_messages: formData.beneficiaryMessages || [],
          
          // Notes on Disinheritance or Special Instructions
          disinheritance_notes: formData.disinheritanceNotes || null,
          
          // Document Locations & Keys (stored as JSON array)
          document_locations: formData.documentLocations || []
        };
        
        console.log('Beneficiaries inheritance data to save:', beneficiariesInheritanceData);
        await saveBeneficiariesInheritance(userId, beneficiariesInheritanceData);
        break;

      case 'personalPropertyRealEstateData':
        console.log('Processing personalPropertyRealEstateData...');
        
        // Save personal property & real estate information to a dedicated personal_property_real_estate table
        const personalPropertyRealEstateData = {
          // Primary Residence
          primary_residence_address: formData.primaryResidenceAddress || null,
          primary_residence_co_owners: formData.primaryResidenceCoOwners || null,
          primary_residence_security: formData.primaryResidenceSecurity || null,
          primary_residence_mortgage: formData.primaryResidenceMortgage || null,
          
          // Additional Properties (stored as JSON array)
          additional_properties: formData.additionalProperties || [],
          
          // Deeds & Tax Info
          deeds_tax_info_location: formData.deedsTaxInfoLocation || null,
          
          // Storage Units & Garages (stored as JSON array)
          storage_units: formData.storageUnits || [],
          
          // High-Value Items & Appraisals (stored as JSON array)
          high_value_items: formData.highValueItems || [],
          
          // Photo Albums & Family Keepsakes
          photo_albums_location: formData.photoAlbumsLocation || null,
          
          // Home Contents & Distribution Plan
          home_contents_plan: formData.homeContentsPlan || null,
          home_contents_special_instructions: formData.homeContentsSpecialInstructions || null,
          
          // Firearms (stored as JSON array)
          firearms: formData.firearms || [],
          
          // Other Property
          other_property_details: formData.otherPropertyDetails || null,
          other_property_special_instructions: formData.otherPropertySpecialInstructions || null,
          
          // Asset Distribution Plan
          distribution_executor: formData.distributionExecutor || null,
          distribution_timeline: formData.distributionTimeline || null,
          distribution_instructions: formData.distributionInstructions || null
        };
        
        console.log('Personal property real estate data to save:', personalPropertyRealEstateData);
        await savePersonalPropertyRealEstate(userId, personalPropertyRealEstateData);
        break;

      case 'digitalLifeData':
        console.log('Processing digitalLifeData...');
        
        // Save digital life information to a dedicated digital_life table
        const digitalLifeData = {
          // Password Manager
          password_manager_used: formData.passwordManagerUsed || null,
          password_manager_service: formData.passwordManagerService || null,
          password_manager_access: formData.passwordManagerAccess || null,
          
          // Two-Factor Authentication
          two_factor_devices: formData.twoFactorDevices || null,
          backup_codes_location: formData.backupCodesLocation || null,
          
          // Cancelation Instructions
          cancelation_instructions: formData.cancelationInstructions || null,
          
          // USBs & External Storage
          usb_storage_location: formData.usbStorageLocation || null,
          
          // Digital Executor
          digital_executor_name: formData.digitalExecutorName || null,
          digital_executor_location: formData.digitalExecutorLocation || null,
          
          // Repeatable sections (stored as JSON arrays)
          email_accounts: formData.emailAccounts || [],
          website_logins: formData.websiteLogins || [],
          blog_websites: formData.blogWebsites || [],
          email_providers: formData.emailProviders || [],
          social_media_accounts: formData.socialMediaAccounts || [],
          cloud_storage_accounts: formData.cloudStorageAccounts || [],
          streaming_accounts: formData.streamingAccounts || [],
          devices: formData.devices || []
        };
        
        console.log('Digital life data to save:', digitalLifeData);
        await saveDigitalLife(userId, digitalLifeData);
        break;

      case 'keyContactsData':
        console.log('Processing keyContactsData...');
        
        // Save key contacts information to a dedicated key_contacts table
        const keyContactsData = {
          // Repeatable sections (stored as JSON arrays)
          family_members: formData.familyMembers || [],
          friends_contacts: formData.friendsContacts || [],
          professional_contacts: formData.professionalContacts || [],
          healthcare_contacts: formData.healthcareContacts || [],
          household_contacts: formData.householdContacts || [],
          pet_contacts: formData.petContacts || [],
          notification_contacts: formData.notificationContacts || []
        };
        
        console.log('Key contacts data to save:', keyContactsData);
        await saveKeyContacts(userId, keyContactsData);
        break;

      case 'funeralFinalArrangementsData':
        console.log('Processing funeralFinalArrangementsData...');
        
        // Save funeral final arrangements information to a dedicated funeral_final_arrangements table
        const funeralFinalArrangementsData = {
          // Map all formData fields to database columns
          ...formData
        };
        
        console.log('Funeral final arrangements data to save:', funeralFinalArrangementsData);
        await saveFuneralFinalArrangements(userId, funeralFinalArrangementsData);
        break;

      case 'accountsMembershipsData':
        console.log('Processing accountsMembershipsData...');
        
        // Save accounts & memberships information to a dedicated accounts_memberships table
        const accountsMembershipsData = {
          // Map all formData fields to database columns
          ...formData
        };
        
        console.log('Accounts memberships data to save:', accountsMembershipsData);
        await saveAccountsMemberships(userId, accountsMembershipsData);
        break;

      case 'petsAnimalCareData':
        console.log('Processing petsAnimalCareData...');
        
        // Save pets & animal care information to a dedicated pets_animal_care table
        const petsAnimalCareData = {
          // Map all formData fields to database columns
          ...formData
        };
        
        console.log('Pets animal care data to save:', petsAnimalCareData);
        await savePetsAnimalCare(userId, petsAnimalCareData);
        break;

      case 'shortLettersData':
        console.log('Processing shortLettersData...');
        
        // Save short letters information to a dedicated short_letters table
        const shortLettersData = {
          // Map all formData fields to database columns
          ...formData
        };
        
        console.log('Short letters data to save:', shortLettersData);
        await saveShortLetters(userId, shortLettersData);
        break;

      case 'finalWishesLegacyPlanningData':
        console.log('Processing finalWishesLegacyPlanningData...');
        
        // Save final wishes & legacy planning information to a dedicated final_wishes_legacy_planning table
        const finalWishesLegacyPlanningData = {
          // Map all formData fields to database columns
          ...formData
        };
        
        console.log('Final wishes legacy planning data to save:', finalWishesLegacyPlanningData);
        await saveFinalWishesLegacyPlanning(userId, finalWishesLegacyPlanningData);
        break;

      case 'bucketListUnfinishedBusinessData':
        console.log('Processing bucketListUnfinishedBusinessData...');
        
        // Save bucket list & unfinished business information to a dedicated bucket_list_unfinished_business table
        // Map the form data to the correct JSONB structure expected by the database
        const bucketListUnfinishedBusinessData = {
          bucket_list: {
            placesToVisit: formData.placesToVisit || [],
            projectsToComplete: formData.projectsToComplete || []
          },
          unfinished_business: {
            messagesUnsaid: formData.messagesUnsaid || [],
            hopesForFamily: formData.hopesForFamily || [],
            timeSensitiveEvents: formData.timeSensitiveEvents || []
          },
          goals_dreams: {
            farewellLetterWritten: formData.farewellLetterWritten || '',
            farewellLetterLocation: formData.farewellLetterLocation || '',
            additionalReflections: formData.additionalReflections || ''
          }
        };
        
        console.log('Bucket list unfinished business data to save:', bucketListUnfinishedBusinessData);
        await saveBucketListUnfinishedBusiness(userId, bucketListUnfinishedBusinessData);
        break;

      case 'formalLettersData':
        console.log('Processing formalLettersData...');
        
        // Save formal letters information to a dedicated formal_letters table
        // Map the form data to the correct JSONB structure expected by the database
        const formalLettersData = {
          formal_letters: {
            letterToExecutor: formData.letterToExecutor || '',
            letterToLegalFinancialAdvisor: formData.letterToLegalFinancialAdvisor || '',
            letterToHealthcareProxy: formData.letterToHealthcareProxy || '',
            letterToFamilyLovedOnes: formData.letterToFamilyLovedOnes || '',
            familyLetters: formData.familyLetters || []
          },
          legal_letters: {
            // Additional legal-specific letters if any
          },
          business_letters: {
            // Additional business-specific letters if any
          }
        };
        
        console.log('Formal letters data to save:', formalLettersData);
        await saveFormalLetters(userId, formalLettersData);
        break;

      case 'fileUploadsMultimediaData':
        console.log('Processing fileUploadsMultimediaData...');
        
        // Save file uploads & multimedia information to a dedicated file_uploads_multimedia table
        const fileUploadsMultimediaData = {
          // Map all formData fields to database columns
          ...formData
        };
        
        console.log('File uploads multimedia data to save:', fileUploadsMultimediaData);
        await saveFileUploadsMultimedia(userId, fileUploadsMultimediaData);
        break;

      case 'conclusionData':
        console.log('Processing conclusionData...');
        
        // Save conclusion information to a dedicated conclusion table
        const conclusionData = {
          // Map all formData fields to database columns
          ...formData
        };
        
        console.log('Conclusion data to save:', conclusionData);
        await saveConclusion(userId, conclusionData);
        break;

      // Add more form types as needed
      default:
        console.log(`No database sync handler for form type: ${formType}`);
    }

    console.log('=== Database Sync Completed Successfully ===');
    return { success: true };
  } catch (error) {
    console.error('=== Database Sync Failed ===');
    console.error('Database sync error:', error);
    return { success: false, error };
  }
};

// Hook to automatically sync form data
export const useDatabaseSync = () => {
  const syncForm = async (userEmail: string, formType: string, formData: any) => {
    return await syncFormDataToDatabase({ userEmail, formType, formData });
  };

  return { syncForm };
};