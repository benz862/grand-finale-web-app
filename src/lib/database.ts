import { supabase } from '@/lib/supabase';

export interface UserData {
  id?: string;
  email: string;
}

export interface PersonalInfo {
  // Basic identity fields
  legal_first_name: string;
  legal_last_name: string;
  legal_middle_name?: string;
  preferred_name?: string;
  nickname?: string;
  date_of_birth: string;
  
  // Gender and pronouns
  gender?: 'Male' | 'Female' | 'Non-Binary' | 'Prefer not to say';
  pronouns?: 'He/Him' | 'She/Her' | 'They/Them' | 'Other';
  custom_pronoun?: string;
  
  // Birth information
  place_of_birth?: string;
  country_of_birth?: string;
  province_of_birth?: string;
  city_of_birth?: string;
  
  // Citizenship and language
  country_of_citizenship?: string;
  citizenships?: string;
  citizenship_countries?: string;
  language_spoken?: string;
  primary_language?: string;
  secondary_language?: string;
  
  // Government documents
  ssn_sin?: string;
  drivers_license_number?: string;
  drivers_license_expiry?: string;
  drivers_license_province?: string;
  
  // Family information
  father_name?: string;
  mother_name?: string;
  stepfather_name?: string;
  stepmother_name?: string;
  relationship_status?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Common Law' | 'Separated';
  spouse_name?: string;
  spouse_contact?: string;
  
  // Religious and spiritual information
  religious_affiliation?: string;
  place_of_worship?: string;
  clergy_name?: string;
  clergy_phone?: string;
  clergy_email?: string;
  last_rites_desired?: boolean;
  clergy_present_desired?: boolean;
  scripture_preferences?: string;
  prayer_style?: string;
  burial_rituals?: string;
  
  // Employment information
  employment_status?: 'Employed' | 'Unemployed' | 'Self-Employed' | 'Retired' | 'Entrepreneur';
  
  // Data integrity
  has_immutable_data?: boolean;
  immutable_data_locked_at?: string;
  additional_notes?: string;
}

export interface Address {
  address_type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_primary: boolean;
}

export interface Phone {
  phone_type: string;
  phone_number: string;
  is_primary: boolean;
}

export interface Email {
  email: string;
  email_type: string;
  is_primary: boolean;
}

export interface EmergencyContact {
  full_name: string;
  relationship: string;
  custom_relationship?: string;
  phone: string;
  phone_alt?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  is_primary: boolean;
  notes?: string;
}

export interface LegalDocument {
  document_type: string;
  has_document: string;
  location?: string;
  notes?: string;
}

export interface Child {
  child_name: string;
  child_gender?: 'M' | 'F' | 'Other';
  child_dob?: string;
  relationship_to_child?: string;
  child_contact?: string;
}

export interface Passport {
  country: string;
  number: string;
  expiry?: string;
}

export interface Education {
  school_name: string;
  degree?: string;
  field_of_study?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  graduation_date?: string;
  gpa?: number;
  honors_awards?: string;
  activities_extracurricular?: string;
  notes?: string;
}

export const savePersonalInfo = async (userId: string, data: PersonalInfo) => {
  console.log('Saving personal info for user:', userId, data);
  
  // First, check if a record already exists for this user
  const { data: existingRecord, error: selectError } = await supabase
    .from('personal_info')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking existing record:', selectError);
    throw selectError;
  }
  
  let result;
  if (existingRecord) {
    // Update existing record
    console.log('Updating existing personal info record:', existingRecord.id);
    result = await supabase
      .from('personal_info')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else {
    // Insert new record
    console.log('Creating new personal info record');
    result = await supabase
      .from('personal_info')
      .insert({ user_id: userId, ...data });
  }
  
  if (result.error) {
    console.error('Personal info save error:', result.error);
    throw result.error;
  }
  
  console.log('Personal info saved successfully');
};

export const saveAddresses = async (userId: string, addresses: Address[]) => {
  console.log('Saving addresses for user:', userId, addresses);
  
  // First delete existing addresses
  const { error: deleteError } = await supabase
    .from('addresses')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing addresses:', deleteError);
    throw deleteError;
  }

  // Then insert new addresses
  if (addresses.length > 0) {
    const { error } = await supabase
      .from('addresses')
      .insert(addresses.map(addr => ({ user_id: userId, ...addr })));
    if (error) {
      console.error('Addresses save error:', error);
      throw error;
    }
  }
  console.log('Addresses saved successfully');
};

export const savePhones = async (userId: string, phones: Phone[]) => {
  console.log('Saving phones for user:', userId, phones);
  
  // First delete existing phones
  const { error: deleteError } = await supabase
    .from('phones')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing phones:', deleteError);
    throw deleteError;
  }

  // Then insert new phones
  if (phones.length > 0) {
    const { error } = await supabase
      .from('phones')
      .insert(phones.map(phone => ({ user_id: userId, ...phone })));
    if (error) {
      console.error('Phones save error:', error);
      throw error;
    }
  }
  console.log('Phones saved successfully');
};

export const saveEmails = async (userId: string, emails: Email[]) => {
  console.log('Saving emails for user:', userId, emails);
  
  // First delete existing emails
  const { error: deleteError } = await supabase
    .from('emails')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing emails:', deleteError);
    throw deleteError;
  }

  // Then insert new emails
  if (emails.length > 0) {
    const { error } = await supabase
      .from('emails')
      .insert(emails.map(email => ({ user_id: userId, ...email })));
    if (error) {
      console.error('Emails save error:', error);
      throw error;
    }
  }
  console.log('Emails saved successfully');
};

export const saveEmergencyContacts = async (userId: string, contacts: EmergencyContact[]) => {
  console.log('Saving emergency contacts for user:', userId, contacts);
  
  // First delete existing contacts
  const { error: deleteError } = await supabase
    .from('emergency_contacts')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing emergency contacts:', deleteError);
    throw deleteError;
  }

  // Then insert new contacts
  if (contacts.length > 0) {
    const { error } = await supabase
      .from('emergency_contacts')
      .insert(contacts.map(contact => ({ user_id: userId, ...contact })));
    if (error) {
      console.error('Emergency contacts save error:', error);
      throw error;
    }
  }
  console.log('Emergency contacts saved successfully');
};

export const saveLegalDocuments = async (userId: string, documents: LegalDocument[]) => {
  await supabase.from('legal_documents').delete().eq('user_id', userId);
  const { error } = await supabase
    .from('legal_documents')
    .insert(documents.map(doc => ({ user_id: userId, ...doc })));
  if (error) throw error;
};

export const saveChildren = async (userId: string, children: Child[]) => {
  console.log('Saving children for user:', userId, children);
  
  // First delete existing children
  const { error: deleteError } = await supabase
    .from('children')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing children:', deleteError);
    throw deleteError;
  }

  // Then insert new children
  if (children.length > 0) {
    const { error } = await supabase
      .from('children')
      .insert(children.map(child => ({ user_id: userId, ...child })));
    if (error) {
      console.error('Children save error:', error);
      throw error;
    }
  }
  console.log('Children saved successfully');
};

export const savePassports = async (userId: string, passports: Passport[]) => {
  console.log('Saving passports for user:', userId, passports);
  // First delete existing passports
  const { error: deleteError } = await supabase
    .from('passports')
    .delete()
    .eq('user_id', userId);
  if (deleteError) {
    console.error('Error deleting existing passports:', deleteError);
    throw deleteError;
  }
  // Then insert new passports
  if (passports.length > 0) {
    const { error } = await supabase
      .from('passports')
      .insert(passports.map(passport => ({
        user_id: userId,
        country: passport.country,
        number: passport.number,
        expiry: passport.expiry || null
      })));
    if (error) {
      console.error('Passports save error:', error);
      throw error;
    }
  }
  console.log('Passports saved successfully');
};

export const saveEducation = async (userId: string, education: Education[]) => {
  console.log('Saving education for user:', userId, education);
  
  // First delete existing education records
  const { error: deleteError } = await supabase
    .from('education')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing education records:', deleteError);
    throw deleteError;
  }

  // Then insert new education records
  if (education.length > 0) {
    const { error } = await supabase
      .from('education')
      .insert(education.map(edu => ({ user_id: userId, ...edu })));
    if (error) {
      console.error('Education save error:', error);
      throw error;
    }
  }
  console.log('Education saved successfully');
};

// Additional interfaces for new tables
export interface DocumentStorage {
  document_type: string;
  has_document: boolean;
  location?: string;
  notes?: string;
}

export interface WorkCareer {
  occupation?: string;
  employer?: string;
  employer_address?: string;
  work_phone?: string;
  supervisor_name?: string;
  work_notes?: string;
}

export interface SecurityDigitalAccess {
  will_location?: string;
  unlock_code?: string;
  password_manager?: string;
  backup_code_storage?: string;
  key_accounts?: string;
  digital_docs_location?: string;
}

// Save functions for new tables
export const saveDocumentStorage = async (userId: string, documents: DocumentStorage[]) => {
  console.log('Saving document storage for user:', userId, documents);
  
  // First delete existing document storage records
  const { error: deleteError } = await supabase
    .from('document_storage')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing document storage records:', deleteError);
    throw deleteError;
  }

  // Then insert new document storage records
  if (documents.length > 0) {
    const { error } = await supabase
      .from('document_storage')
      .insert(documents.map(doc => ({ user_id: userId, ...doc })));
    if (error) {
      console.error('Document storage save error:', error);
      throw error;
    }
  }
  console.log('Document storage saved successfully');
};

export const saveWorkCareer = async (userId: string, workCareer: WorkCareer) => {
  console.log('Saving work career for user:', userId, workCareer);
  
  // First delete existing work career record
  const { error: deleteError } = await supabase
    .from('work_career')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing work career record:', deleteError);
    throw deleteError;
  }

  // Then insert new work career record
  const { error } = await supabase
    .from('work_career')
    .insert({ user_id: userId, ...workCareer });
  if (error) {
    console.error('Work career save error:', error);
    throw error;
  }
  console.log('Work career saved successfully');
};

export const saveSecurityDigitalAccess = async (userId: string, securityAccess: SecurityDigitalAccess) => {
  console.log('Saving security digital access for user:', userId, securityAccess);
  
  // First delete existing security digital access record
  const { error: deleteError } = await supabase
    .from('security_digital_access')
    .delete()
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing security digital access record:', deleteError);
    throw deleteError;
  }

  // Then insert new security digital access record
  const { error } = await supabase
    .from('security_digital_access')
    .insert({ user_id: userId, ...securityAccess });
  if (error) {
    console.error('Security digital access save error:', error);
    throw error;
  }
  console.log('Security digital access saved successfully');
};

export interface MedicalInfo {
  // Physician Information
  physicians?: any[];
  
  // Health Insurance & ID
  insurance_notes?: string;
  
  // Medications
  medications?: any[];
  supplements?: string;
  
  // Pharmacy Info
  pharmacy_name?: string;
  pharmacy_phone?: string;
  
  // Allergies & Reactions
  allergies?: string;
  reactions?: string;
  
  // Medical History
  chronic_illnesses?: any[];
  surgeries?: any[];
  hospitalizations?: any[];
  
  // Organ Donation & Advance Directives
  organ_donor?: string;
  organ_donor_state?: string;
  organ_donor_location?: string;
  living_will?: string;
  living_will_date?: string;
  living_will_location?: string;
  dnr?: string;
  dnr_date?: string;
  dnr_location?: string;
  
  // Healthcare Proxy
  proxy_name?: string;
  proxy_relationship?: string;
  proxy_phone?: string;
  proxy_email?: string;
  proxy_location?: string;
  
  // Insurance Details
  primary_provider?: string;
  policy_number?: string;
  policyholder?: string;
  insurance_phone?: string;
  secondary_coverage?: string;
  
  // Preferred Facilities
  nearest_er?: string;
  preferred_hospital?: string;
  
  // Additional Notes
  additional_notes?: string;
}

export const saveMedicalInfo = async (userId: string, data: MedicalInfo) => {
  console.log('Saving medical info for user:', userId, data);
  
  // First, check if a record already exists for this user
  const { data: existingRecord, error: selectError } = await supabase
    .from('medical_info')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking existing medical record:', selectError);
    throw selectError;
  }
  
  let result;
  if (existingRecord) {
    // Update existing record
    console.log('Updating existing medical info record:', existingRecord.id);
    result = await supabase
      .from('medical_info')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else {
    // Insert new record
    console.log('Creating new medical info record');
    result = await supabase
      .from('medical_info')
      .insert({ user_id: userId, ...data });
  }
  
  if (result.error) {
    console.error('Medical info save error:', result.error);
    throw result.error;
  }
  
  console.log('Medical info saved successfully');
};

export interface LegalEstate {
  // Will & Estate Overview
  will_exists?: string;
  will_location?: string;
  will_date?: string;
  estate_value?: string;
  estate_notes?: string;
  
  // Lawyer Information (stored as JSON array)
  lawyers?: any[];
  
  // Legal and Financial Contacts
  legal_contacts?: string;
  financial_contacts?: string;
  accountant_name?: string;
  accountant_phone?: string;
  accountant_email?: string;
  
  // Executor Details
  executor_name?: string;
  executor_phone?: string;
  executor_email?: string;
  executor_address?: string;
  executor_relationship?: string;
  executor_notes?: string;
  
  // Alternate Executors (stored as JSON array)
  alternate_executors?: any[];
  
  // Power of Attorney (POA)
  poa_exists?: string;
  poa_type?: string;
  poa_name?: string;
  poa_phone?: string;
  poa_email?: string;
  poa_address?: string;
  poa_relationship?: string;
  poa_date?: string;
  poa_location?: string;
  
  // Supporting Legal Documents
  trust_exists?: string;
  trust_name?: string;
  trust_date?: string;
  trust_location?: string;
  living_will?: string;
  living_will_date?: string;
  living_will_location?: string;
  healthcare_proxy?: string;
  healthcare_proxy_name?: string;
  healthcare_proxy_date?: string;
  healthcare_proxy_location?: string;
  
  // Personal Safe Details
  safe_exists?: string;
  safe_location?: string;
  safe_combination?: string;
  safe_contents?: string;
  
  // Safe Deposit Box
  deposit_box_exists?: string;
  deposit_box_bank?: string;
  deposit_box_location?: string;
  deposit_box_number?: string;
  deposit_box_key_location?: string;
  deposit_box_contents?: string;
  
  // Additional Notes
  additional_notes?: string;
}

export const saveLegalEstate = async (userId: string, data: LegalEstate) => {
  console.log('Saving legal estate for user:', userId, data);
  
  // First, check if a record already exists for this user
  const { data: existingRecord, error: selectError } = await supabase
    .from('legal_estate')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking existing legal estate record:', selectError);
    throw selectError;
  }
  
  let result;
  if (existingRecord) {
    // Update existing record
    console.log('Updating existing legal estate record:', existingRecord.id);
    result = await supabase
      .from('legal_estate')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else {
    // Insert new record
    console.log('Creating new legal estate record');
    result = await supabase
      .from('legal_estate')
      .insert({ user_id: userId, ...data });
  }
  
  if (result.error) {
    console.error('Legal estate save error:', result.error);
    throw result.error;
  }
  
  console.log('Legal estate saved successfully');
};

export interface FinanceBusiness {
  // Bank Accounts (stored as JSON array)
  bank_accounts?: any[];
  
  // Cash on Hand (stored as JSON array)
  cash_on_hand?: any[];
  
  // Investments (stored as JSON array)
  investments?: any[];
  
  // Retirement Plans (stored as JSON array)
  retirement_plans?: any[];
  
  // Crypto & Metals (stored as JSON array)
  crypto_metals?: any[];
  
  // Income Sources (stored as JSON array)
  income_sources?: any[];
  
  // Liabilities (stored as JSON array)
  liabilities?: any[];
  
  // Vehicles (stored as JSON array)
  vehicles?: any[];
  
  // Properties (stored as JSON array)
  properties?: any[];
  
  // Business Ownership (stored as JSON array)
  businesses?: any[];
  
  // Financial Advisor
  advisor_name?: string;
  advisor_phone?: string;
  advisor_email?: string;
  
  // Statement Access
  statement_storage?: string;
  storage_location?: string;
}

export const saveFinanceBusiness = async (userId: string, data: FinanceBusiness) => {
  console.log('Saving finance business for user:', userId, data);
  
  // First, check if a record already exists for this user
  const { data: existingRecord, error: selectError } = await supabase
    .from('finance_business')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking existing finance business record:', selectError);
    throw selectError;
  }
  
  let result;
  if (existingRecord) {
    // Update existing record
    console.log('Updating existing finance business record:', existingRecord.id);
    result = await supabase
      .from('finance_business')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else {
    // Insert new record
    console.log('Creating new finance business record');
    result = await supabase
      .from('finance_business')
      .insert({ user_id: userId, ...data });
  }
  
  if (result.error) {
    console.error('Finance business save error:', result.error);
    throw result.error;
  }
  
  console.log('Finance business saved successfully');
};

export interface BeneficiariesInheritance {
  // Life and Health Insurance Policies (stored as JSON array)
  insurance_policies?: any[];
  
  // Employee Benefits (stored as JSON array)
  employee_benefits?: any[];
  
  // Social Security (stored as JSON array)
  social_security_benefits?: any[];
  
  // Retirement (stored as JSON array)
  retirement_benefits?: any[];
  
  // Veteran's Benefits (stored as JSON array)
  veteran_benefits?: any[];
  
  // Primary & Contingent Beneficiaries (stored as JSON array)
  beneficiary_groups?: any[];
  
  // Assigned Beneficiaries on Accounts (stored as JSON array)
  assigned_beneficiaries?: any[];
  
  // Specific Bequests (stored as JSON array)
  specific_bequests?: any[];
  
  // Messages or Letters for Beneficiaries (stored as JSON array)
  beneficiary_messages?: any[];
  
  // Notes on Disinheritance or Special Instructions
  disinheritance_notes?: string;
  
  // Document Locations & Keys (stored as JSON array)
  document_locations?: any[];
}

export const saveBeneficiariesInheritance = async (userId: string, data: BeneficiariesInheritance) => {
  console.log('Saving beneficiaries inheritance for user:', userId, data);
  
  // First, check if a record already exists for this user
  const { data: existingRecord, error: selectError } = await supabase
    .from('beneficiaries_inheritance')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking existing beneficiaries inheritance record:', selectError);
    throw selectError;
  }
  
  let result;
  if (existingRecord) {
    // Update existing record
    console.log('Updating existing beneficiaries inheritance record:', existingRecord.id);
    result = await supabase
      .from('beneficiaries_inheritance')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else {
    // Insert new record
    console.log('Creating new beneficiaries inheritance record');
    result = await supabase
      .from('beneficiaries_inheritance')
      .insert({ user_id: userId, ...data });
  }
  
  if (result.error) {
    console.error('Beneficiaries inheritance save error:', result.error);
    throw result.error;
  }
  
  console.log('Beneficiaries inheritance saved successfully');
};

export interface PersonalPropertyRealEstate {
  // Primary Residence
  primary_residence_address?: string;
  primary_residence_co_owners?: string;
  primary_residence_security?: string;
  primary_residence_mortgage?: string;
  
  // Additional Properties (stored as JSON array)
  additional_properties?: any[];
  
  // Deeds & Tax Info
  deeds_tax_info_location?: string;
  
  // Storage Units & Garages (stored as JSON array)
  storage_units?: any[];
  
  // High-Value Items & Appraisals (stored as JSON array)
  high_value_items?: any[];
  
  // Photo Albums & Family Keepsakes
  photo_albums_location?: string;
  
  // Home Contents & Distribution Plan
  home_contents_plan?: string;
  home_contents_special_instructions?: string;
  
  // Firearms (stored as JSON array)
  firearms?: any[];
  
  // Other Property
  other_property_details?: string;
  other_property_special_instructions?: string;
  
  // Asset Distribution Plan
  distribution_executor?: string;
  distribution_timeline?: string;
  distribution_instructions?: string;
}

export const savePersonalPropertyRealEstate = async (userId: string, data: PersonalPropertyRealEstate) => {
  console.log('Saving personal property real estate for user:', userId, data);
  
  // First, check if a record already exists for this user
  const { data: existingRecord, error: selectError } = await supabase
    .from('personal_property_real_estate')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking existing personal property real estate record:', selectError);
    throw selectError;
  }
  
  let result;
  if (existingRecord) {
    // Update existing record
    console.log('Updating existing personal property real estate record:', existingRecord.id);
    result = await supabase
      .from('personal_property_real_estate')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else {
    // Insert new record
    console.log('Creating new personal property real estate record');
    result = await supabase
      .from('personal_property_real_estate')
      .insert({ user_id: userId, ...data });
  }
  
  if (result.error) {
    console.error('Personal property real estate save error:', result.error);
    throw result.error;
  }
  
  console.log('Personal property real estate saved successfully');
};

export interface DigitalLife {
  // Password Manager
  password_manager_used?: string;
  password_manager_service?: string;
  password_manager_access?: string;
  
  // Two-Factor Authentication
  two_factor_devices?: string;
  backup_codes_location?: string;
  
  // Cancelation Instructions
  cancelation_instructions?: string;
  
  // USBs & External Storage
  usb_storage_location?: string;
  
  // Digital Executor
  digital_executor_name?: string;
  digital_executor_location?: string;
  
  // Repeatable sections (stored as JSON arrays)
  email_accounts?: any[];
  website_logins?: any[];
  blog_websites?: any[];
  email_providers?: any[];
  social_media_accounts?: any[];
  cloud_storage_accounts?: any[];
  streaming_accounts?: any[];
  devices?: any[];
}

export const saveDigitalLife = async (userId: string, data: DigitalLife) => {
  console.log('Saving digital life for user:', userId, data);
  
  // First, check if a record already exists for this user
  const { data: existingRecord, error: selectError } = await supabase
    .from('digital_life')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking existing digital life record:', selectError);
    throw selectError;
  }
  
  let result;
  if (existingRecord) {
    // Update existing record
    console.log('Updating existing digital life record:', existingRecord.id);
    result = await supabase
      .from('digital_life')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else {
    // Insert new record
    console.log('Creating new digital life record');
    result = await supabase
      .from('digital_life')
      .insert({ user_id: userId, ...data });
  }
  
  if (result.error) {
    console.error('Digital life save error:', result.error);
    throw result.error;
  }
  
  console.log('Digital life saved successfully');
};

export interface KeyContacts {
  // Repeatable sections (stored as JSON arrays)
  family_members?: any[];
  friends_contacts?: any[];
  professional_contacts?: any[];
  healthcare_contacts?: any[];
  household_contacts?: any[];
  pet_contacts?: any[];
  notification_contacts?: any[];
}

export const saveKeyContacts = async (userId: string, data: KeyContacts) => {
  console.log('Saving key contacts for user:', userId, data);
  
  // First, check if a record already exists for this user
  const { data: existingRecord, error: selectError } = await supabase
    .from('key_contacts')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking existing key contacts record:', selectError);
    throw selectError;
  }
  
  let result;
  if (existingRecord) {
    // Update existing record
    console.log('Updating existing key contacts record:', existingRecord.id);
    result = await supabase
      .from('key_contacts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  } else {
    // Insert new record
    console.log('Creating new key contacts record');
    result = await supabase
      .from('key_contacts')
      .insert({ user_id: userId, ...data });
  }
  
  if (result.error) {
    console.error('Key contacts save error:', result.error);
    throw result.error;
  }
  
  console.log('Key contacts saved successfully');
};

// Generic save function for all remaining forms
const createGenericSaveFunction = (tableName: string) => {
  return async (userId: string, data: any) => {
    console.log(`Saving ${tableName} for user:`, userId, data);
    
    // First, check if a record already exists for this user
    const { data: existingRecord, error: selectError } = await supabase
      .from(tableName)
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error(`Error checking existing ${tableName} record:`, selectError);
      throw selectError;
    }
    
    let result;
    if (existingRecord) {
      // Update existing record
      console.log(`Updating existing ${tableName} record:`, existingRecord.id);
      result = await supabase
        .from(tableName)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    } else {
      // Insert new record
      console.log(`Creating new ${tableName} record`);
      result = await supabase
        .from(tableName)
        .insert({ user_id: userId, ...data });
    }
    
    if (result.error) {
      console.error(`${tableName} save error:`, result.error);
      throw result.error;
    }
    
    console.log(`${tableName} saved successfully`);
  };
};

// Create save functions for all remaining forms
export const saveFuneralFinalArrangements = createGenericSaveFunction('funeral_final_arrangements');
export const saveAccountsMemberships = createGenericSaveFunction('accounts_memberships');
export const savePetsAnimalCare = createGenericSaveFunction('pets_animal_care');
export const saveShortLetters = createGenericSaveFunction('short_letters');
export const saveFinalWishesLegacyPlanning = createGenericSaveFunction('final_wishes_legacy_planning');
export const saveBucketListUnfinishedBusiness = createGenericSaveFunction('bucket_list_unfinished_business');
export const saveFormalLetters = createGenericSaveFunction('formal_letters');
export const saveFileUploadsMultimedia = createGenericSaveFunction('file_uploads_multimedia');
export const saveConclusion = createGenericSaveFunction('conclusion');