import React, { useState } from 'react';
import FullBookPDFExport from './FullBookPDFExport';

// Sample user data for testing
const sampleUserData = {
  // Basic user info
  firstName: 'John',
  lastName: 'Doe',
  
  // Section 1: Personal Information
  basic_info: {
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'Doe',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    pronouns: 'He/Him',
    countryOfBirth: 'United States',
    provinceOfBirth: 'California',
    cityOfBirth: 'Los Angeles',
    citizenships: 'US Citizen'
  },
  contact_info: {
    primaryPhone: '(555) 123-4567',
    secondaryPhone: '(555) 987-6543',
    email: 'john.doe@email.com',
    currentAddress: '123 Main Street, Anytown, CA 90210'
  },
  emergency_contacts: [
    {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 111-2222',
      email: 'jane.doe@email.com'
    },
    {
      name: 'Robert Smith',
      relationship: 'Brother',
      phone: '(555) 333-4444',
      email: 'robert.smith@email.com'
    }
  ],

  // Section 2: Medical Information
  physicians: [
    {
      physician_name: 'Dr. Sarah Johnson',
      specialty: 'Primary Care',
      clinic_name: 'Anytown Medical Center',
      physician_phone: '(555) 555-1234'
    },
    {
      physician_name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      clinic_name: 'Heart Care Associates',
      physician_phone: '(555) 555-5678'
    }
  ],
  medications: [
    {
      medication_name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      reason: 'High blood pressure'
    },
    {
      medication_name: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily',
      reason: 'High cholesterol'
    },
    {
      medication_name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      reason: 'Type 2 diabetes'
    }
  ],
  allergies: [
    {
      allergen: 'Penicillin',
      reaction: 'Hives and difficulty breathing'
    },
    {
      allergen: 'Shellfish',
      reaction: 'Swelling of lips and throat'
    }
  ],
  medical_history: {
    chronic_conditions: 'Type 2 diabetes, hypertension',
    surgeries: 'Appendectomy (2010), Knee arthroscopy (2018)',
    hospitalizations: 'Pneumonia (2015), Heart attack (2020)'
  },
  insurance: {
    primary_provider: 'Blue Cross Blue Shield',
    policy_number: 'BCBS123456789',
    group_number: 'GRP987654321'
  },

  // Section 3: Legal & Estate Planning
  will_info: {
    has_will: 'Yes',
    will_location: 'Safe deposit box at First National Bank',
    will_updated: '2023-01-15'
  },
  executor: {
    executor_name: 'Jane Doe',
    executor_relationship: 'Spouse',
    executor_phone: '(555) 111-2222',
    executor_email: 'jane.doe@email.com'
  },
  legal_documents: [
    {
      document_type: 'Living Will',
      location: 'Home safe',
      date_created: '2023-01-15'
    },
    {
      document_type: 'Power of Attorney',
      location: 'Attorney office',
      date_created: '2023-01-15'
    },
    {
      document_type: 'Healthcare Proxy',
      location: 'Home safe',
      date_created: '2023-01-15'
    }
  ],

  // Section 4: Financial Information
  bank_accounts: [
    {
      bank_name: 'First National Bank',
      account_type: 'Checking',
      account_number: '****1234',
      notes: 'Primary account'
    },
    {
      bank_name: 'First National Bank',
      account_type: 'Savings',
      account_number: '****5678',
      notes: 'Emergency fund'
    }
  ],
  investment_accounts: [
    {
      institution: 'Vanguard',
      account_type: '401(k)',
      account_number: '****9012',
      notes: 'Employer retirement plan'
    },
    {
      institution: 'Fidelity',
      account_type: 'IRA',
      account_number: '****3456',
      notes: 'Personal retirement account'
    }
  ],
  insurance_policies: [
    {
      policy_type: 'Life Insurance',
      provider: 'MetLife',
      policy_number: 'LIFE789012',
      beneficiary: 'Jane Doe'
    },
    {
      policy_type: 'Auto Insurance',
      provider: 'State Farm',
      policy_number: 'AUTO345678',
      beneficiary: 'N/A'
    }
  ],

  // Section 5: Digital Life & Passwords
  email_accounts: [
    {
      provider: 'Gmail',
      username: 'john.doe@gmail.com',
      recovery_email: 'jane.doe@gmail.com'
    },
    {
      provider: 'Outlook',
      username: 'john.doe@outlook.com',
      recovery_email: 'jane.doe@outlook.com'
    }
  ],
  social_media: [
    {
      platform: 'Facebook',
      username: 'john.doe',
      profile_url: 'facebook.com/john.doe'
    },
    {
      platform: 'LinkedIn',
      username: 'john-doe-123',
      profile_url: 'linkedin.com/in/john-doe-123'
    }
  ],
  password_manager: {
    service: '1Password',
    master_password_location: 'Physical safe at home',
    recovery_info: 'Recovery key stored in bank safe deposit box'
  },

  // Section 6: Personal Property & Real Estate
  primary_residence: {
    address: '123 Main Street, Anytown, CA 90210',
    mortgage_info: 'Wells Fargo, $250,000 remaining, 3.5% interest',
    insurance: 'State Farm, $300,000 coverage',
    utilities: 'Electric: Southern California Edison, Gas: SoCal Gas'
  },
  additional_properties: [
    {
      address: '456 Beach Road, Malibu, CA 90265',
      property_type: 'Vacation home',
      estimated_value: '$750,000',
      notes: 'Rental property'
    }
  ],
  high_value_items: [
    {
      item_description: 'Diamond engagement ring',
      location: 'Home safe',
      estimated_value: '$15,000',
      insurance: 'Jewelers Mutual'
    },
    {
      item_description: 'Vintage Rolex watch',
      location: 'Home safe',
      estimated_value: '$8,000',
      insurance: 'Homeowners policy'
    }
  ],

  // Section 7: Funeral & Final Arrangements
  service_preferences: {
    service_type: 'Memorial service',
    location_preference: 'Local funeral home or church',
    religious_considerations: 'Non-denominational service'
  },
  disposition: {
    disposition_type: 'Cremation',
    disposition_location: 'Scatter ashes at favorite beach',
    pre_arranged: 'Yes, arrangements made with local funeral home'
  },

  // Section 8: Accounts & Memberships
  club_memberships: [
    {
      club_name: 'Anytown Golf Club',
      membership_number: 'GC123456',
      annual_fee: '$2,400',
      contact: '(555) 777-8888'
    }
  ],
  streaming_services: [
    {
      service_name: 'Netflix',
      username: 'john.doe@gmail.com',
      password_location: '1Password',
      billing: 'Monthly $15.99'
    },
    {
      service_name: 'Spotify',
      username: 'john.doe@gmail.com',
      password_location: '1Password',
      billing: 'Monthly $9.99'
    }
  ],
  professional_memberships: [
    {
      organization: 'American Bar Association',
      member_since: '2010',
      membership_level: 'Regular member',
      contact: 'aba@americanbar.org'
    }
  ],

  // Section 9: Pets & Animal Care
  pets: [
    {
      pet_name: 'Buddy',
      species_breed: 'Golden Retriever',
      age: '5 years',
      special_needs: 'None'
    }
  ],
  pet_care: {
    veterinarian: 'Dr. Emily Wilson, Anytown Animal Hospital',
    feeding_schedule: 'Twice daily, 7am and 6pm',
    medications: 'None currently',
    caregiver_arrangements: 'Neighbor Sarah will care for Buddy if needed'
  },

  // Section 10: Key Contacts
  professional_contacts: [
    {
      name: 'Attorney Robert Brown',
      profession: 'Estate Planning Attorney',
      phone: '(555) 999-0000',
      email: 'robert.brown@lawfirm.com'
    }
  ],
  family_contacts: [
    {
      name: 'Mary Doe',
      relationship: 'Mother',
      phone: '(555) 222-3333',
      email: 'mary.doe@email.com'
    }
  ],

  // Section 11: Short Letters to Loved Ones
  personal_messages: [
    {
      recipient: 'Jane',
      message: 'My dearest Jane, you have been my rock and my joy for all these years. I want you to know how much I love you and how grateful I am for every moment we shared together. Please remember to take care of yourself and know that I will always be with you in spirit.'
    },
    {
      recipient: 'Children',
      message: 'To my wonderful children, I am so proud of the people you have become. Remember that I love you unconditionally and that you have the strength to overcome any challenge. Stay true to yourselves and always support each other.'
    }
  ],

  // Section 12: Final Wishes & Legacy Planning
  legacy_wishes: 'I hope to be remembered as someone who was kind, generous, and always willing to help others. I want my legacy to inspire others to live with compassion and integrity.',
  memorial_preferences: {
    memorial_type: 'Simple memorial service',
    memorial_location: 'Local community center',
    special_requests: 'Please play my favorite song "What a Wonderful World" by Louis Armstrong'
  },

  // Section 13: Bucket List & Unfinished Business
  bucket_list: [
    {
      item: 'Visit the Grand Canyon',
      priority: 'High',
      estimated_cost: '$2,000',
      notes: 'Always wanted to see this natural wonder'
    },
    {
      item: 'Learn to play guitar',
      priority: 'Medium',
      estimated_cost: '$500',
      notes: 'Take lessons and practice regularly'
    }
  ],
  unfinished_business: 'I want to make sure all my family members know how much I love them and that I have made peace with any past conflicts. I also want to ensure that my estate is properly organized to minimize stress for my loved ones.',

  // Section 14: Formal Letters
  legal_letters: 'I hereby authorize my spouse, Jane Doe, to make all necessary decisions regarding my medical care and financial affairs in the event of my incapacity. I trust her completely to act in my best interests.',
  business_letters: 'To my colleagues and business associates, I want to express my gratitude for the professional relationships we have built together. Please continue to support my family during this transition period.',

  // Section 15: Transition Notes
  transition_notes: 'Important: The password to my 1Password account is stored in the physical safe at home. The combination is Jane\'s birthday. All important documents are organized in the filing cabinet in my home office.',

  // Section 16: File Uploads & Multimedia
  important_documents: [
    {
      document_type: 'Birth Certificate',
      file_name: 'birth_certificate.pdf',
      location: 'Home safe',
      notes: 'Original document'
    },
    {
      document_type: 'Marriage Certificate',
      file_name: 'marriage_certificate.pdf',
      location: 'Home safe',
      notes: 'Original document'
    }
  ],
  photos_videos: [
    {
      description: 'Family vacation photos',
      file_name: 'family_vacation_2023.zip',
      location: 'Cloud storage (Google Photos)',
      notes: 'Backed up to external hard drive'
    }
  ],

  // Section 17: Final Checklist
  final_checklist: {
    will_updated: 'Yes',
    power_of_attorney: 'Yes',
    healthcare_proxy: 'Yes',
    life_insurance: 'Yes',
    digital_assets: 'Yes',
    funeral_arrangements: 'Yes'
  },

  // Section 18: Additional Notes
  additional_notes: 'I want to express my deepest gratitude to all the healthcare workers who cared for me during my illness. Their compassion and professionalism made a difficult time more bearable. I also want to thank my friends and family for their unwavering support.'
};

const PDFExportTest: React.FC = () => {
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Full Book PDF Export Test
          </h1>
          <p className="text-gray-600">
            This component demonstrates the full-book PDF export functionality for The Grand Finale.
            It includes sample data for all 18 sections to test the complete PDF generation.
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowExport(!showExport)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showExport ? 'Hide PDF Export' : 'Show PDF Export'}
          </button>
        </div>

        {showExport && (
          <FullBookPDFExport
            userData={sampleUserData}
            onExportStart={() => console.log('Export started')}
            onExportComplete={() => console.log('Export completed')}
            onError={(error) => console.error('Export error:', error)}
          />
        )}

        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sample Data Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(sampleUserData).map((key) => (
              <div key={key} className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 text-sm">{key}</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {typeof sampleUserData[key] === 'object' 
                    ? Array.isArray(sampleUserData[key]) 
                      ? `${sampleUserData[key].length} items`
                      : 'Object data'
                    : 'String data'
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExportTest; 