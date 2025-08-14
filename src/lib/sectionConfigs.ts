// Section configurations for The Grand Finale full-book PDF
export interface SectionConfig {
  section_number: number;
  section_title: string;
  subsections: SubsectionConfig[];
}

export interface SubsectionConfig {
  title: string;
  type: 'list' | 'table' | 'paragraph';
  key: string;
  fields?: FieldConfig[];
  columns?: string[];
}

export interface FieldConfig {
  label: string;
  key: string;
}

// Complete section configurations
export const SECTION_CONFIGS: SectionConfig[] = [
  {
    section_number: 1,
    section_title: "Personal Information",
    subsections: [
      {
        title: "Basic Information",
        type: "list",
        key: "basic_information",
        fields: [
          { label: "First Name", key: "firstName" },
          { label: "Middle Name", key: "middleName" },
          { label: "Last Name", key: "lastName" },
          { label: "Nickname", key: "nickname" },
          { label: "Date of Birth", key: "dateOfBirth" },
          { label: "Gender", key: "gender" },
          { label: "Preferred Pronouns", key: "pronouns" },
          { label: "Country of Birth", key: "countryOfBirth" },
          { label: "Province/State of Birth", key: "provinceOfBirth" },
          { label: "City of Birth", key: "cityOfBirth" },
          { label: "Citizenship(s)", key: "citizenships" },
          { label: "Primary Language", key: "primaryLanguage" },
          { label: "Secondary Language", key: "secondaryLanguage" }
        ]
      },
      {
        title: "Contact Information",
        type: "list",
        key: "contact_information",
        fields: [
          { label: "Phone Numbers", key: "phones" },
          { label: "Addresses", key: "addresses" },
          { label: "Emergency Contacts", key: "contacts" }
        ]
      },
      {
        title: "Family Information",
        type: "list",
        key: "family_information",
        fields: [
          { label: "Father's Name", key: "fatherName" },
          { label: "Mother's Name", key: "motherName" },
          { label: "Stepfather's Name", key: "stepfatherName" },
          { label: "Stepmother's Name", key: "stepmotherName" },
          { label: "Relationship Status", key: "relationshipStatus" },
          { label: "Spouse Name", key: "spouseName" },
          { label: "Spouse Contact", key: "spouseContact" },
          { label: "Children/Dependents", key: "children" }
        ]
      },
      {
        title: "Government ID Information",
        type: "list",
        key: "government_id",
        fields: [
          { label: "Social Security Number", key: "ssn" },
          { label: "Passports", key: "passports" },
          { label: "Driver's License", key: "license" },
          { label: "License Expiry", key: "licenseExpiry" },
          { label: "License Province/State", key: "licenseProvince" }
        ]
      },
      {
        title: "Religious & Spiritual Preferences",
        type: "list",
        key: "religious_information",
        fields: [
          { label: "Religious Affiliation", key: "religiousAffiliation" },
          { label: "Place of Worship", key: "placeOfWorship" },
          { label: "Clergy Name", key: "clergyName" },
          { label: "Clergy Phone", key: "clergyPhone" },
          { label: "Clergy Email", key: "clergyEmail" },
          { label: "Last Rites Preferences", key: "lastRites" },
          { label: "Clergy Present", key: "clergyPresent" },
          { label: "Scripture Preferences", key: "scripturePreferences" },
          { label: "Prayer Style", key: "prayerStyle" },
          { label: "Burial Rituals", key: "burialRituals" }
        ]
      },
      {
        title: "Work & Career Information",
        type: "list",
        key: "work_information",
        fields: [
          { label: "Employment Status", key: "employmentStatus" },
          { label: "Occupation", key: "occupation" },
          { label: "Employer", key: "employer" },
          { label: "Employer Address", key: "employerAddress" },
          { label: "Work Phone", key: "workPhone" },
          { label: "Supervisor Name", key: "supervisorName" },
          { label: "Work Notes", key: "workNotes" }
        ]
      },
      {
        title: "Security & Digital Access",
        type: "list",
        key: "security_information",
        fields: [
          { label: "Will Location", key: "willLocation" },
          { label: "Unlock Code", key: "unlockCode" },
          { label: "Password Manager", key: "passwordManager" },
          { label: "Backup Code Storage", key: "backupCodeStorage" },
          { label: "Key Accounts", key: "keyAccounts" },
          { label: "Digital Documents Location", key: "digitalDocsLocation" }
        ]
      },
      {
        title: "Critical Documents & Key Locations",
        type: "list",
        key: "documents_information",
        fields: [
          { label: "Critical Documents", key: "criticalDocs" },
          { label: "Document Locations", key: "criticalDocLocations" }
        ]
      },
      {
        title: "Education History",
        type: "list",
        key: "education_information",
        fields: [
          { label: "Schools", key: "schools" }
        ]
      },
      {
        title: "Additional Notes",
        type: "paragraph",
        key: "additional_notes"
      }
    ]
  },
  {
    section_number: 2,
    section_title: "Medical Information",
    subsections: [
      {
        title: "Physician Information",
        type: "list",
        key: "physicians",
        fields: [
          { label: "Physicians", key: "physicians" }
        ]
      },
      {
        title: "Health Insurance & ID",
        type: "paragraph",
        key: "insuranceNotes"
      },
      {
        title: "Medications",
        type: "table",
        key: "medications",
        columns: ["Medication Name", "Dosage", "Frequency", "Reason"]
      },
      {
        title: "Supplements & Vitamins",
        type: "list",
        key: "supplements",
        fields: [
          { label: "Supplements", key: "supplements" }
        ]
      },
      {
        title: "Pharmacy Information",
        type: "list",
        key: "pharmacy",
        fields: [
          { label: "Pharmacy Name", key: "pharmacyName" },
          { label: "Pharmacy Phone", key: "pharmacyPhone" }
        ]
      },
      {
        title: "Allergies & Reactions",
        type: "list",
        key: "allergies",
        fields: [
          { label: "Allergies", key: "allergies" },
          { label: "Reactions", key: "reactions" }
        ]
      },
      {
        title: "Chronic Illnesses",
        type: "list",
        key: "chronicIllnesses",
        fields: [
          { label: "Chronic Conditions", key: "chronicIllnesses" }
        ]
      },
      {
        title: "Surgeries",
        type: "list",
        key: "surgeries",
        fields: [
          { label: "Surgical History", key: "surgeries" }
        ]
      },
      {
        title: "Hospitalizations",
        type: "list",
        key: "hospitalizations",
        fields: [
          { label: "Hospitalization History", key: "hospitalizations" }
        ]
      },
      {
        title: "Organ Donation",
        type: "list",
        key: "organ_donation",
        fields: [
          { label: "Organ Donor Status", key: "organDonor" },
          { label: "Organ Donor State", key: "organDonorState" },
          { label: "Organ Donor Location", key: "organDonorLocation" }
        ]
      },
      {
        title: "Advance Directives",
        type: "list",
        key: "advance_directives",
        fields: [
          { label: "Living Will", key: "livingWill" },
          { label: "Living Will Date", key: "livingWillDate" },
          { label: "Living Will Location", key: "livingWillLocation" },
          { label: "DNR Status", key: "dnr" },
          { label: "DNR Date", key: "dnrDate" },
          { label: "DNR Location", key: "dnrLocation" }
        ]
      },
      {
        title: "Healthcare Proxy",
        type: "list",
        key: "healthcare_proxy",
        fields: [
          { label: "Proxy Name", key: "proxyName" },
          { label: "Proxy Relationship", key: "proxyRelationship" },
          { label: "Proxy Phone", key: "proxyPhone" },
          { label: "Proxy Email", key: "proxyEmail" },
          { label: "Proxy Location", key: "proxyLocation" }
        ]
      },
      {
        title: "Insurance Information",
        type: "list",
        key: "insurance",
        fields: [
          { label: "Primary Provider", key: "primaryProvider" },
          { label: "Policy Number", key: "policyNumber" },
          { label: "Policyholder", key: "policyholder" },
          { label: "Insurance Phone", key: "insurancePhone" },
          { label: "Secondary Coverage", key: "secondaryCoverage" }
        ]
      },
      {
        title: "Emergency & Hospital Preferences",
        type: "list",
        key: "emergency_preferences",
        fields: [
          { label: "Nearest ER", key: "nearestER" },
          { label: "Preferred Hospital", key: "preferredHospital" }
        ]
      },
      {
        title: "Additional Medical Notes",
        type: "paragraph",
        key: "additionalNotes"
      }
    ]
  },
  {
    section_number: 3,
    section_title: "Legal & Estate Planning",
    subsections: [
      {
        title: "Will Information",
        type: "list",
        key: "will_information",
        fields: [
          { label: "Has Will", key: "has_will" },
          { label: "Will Location", key: "will_location" },
          { label: "Last Updated", key: "will_updated" }
        ]
      },
      {
        title: "Executor Information",
        type: "list",
        key: "executor",
        fields: [
          { label: "Executor Name", key: "executor_name" },
          { label: "Relationship", key: "executor_relationship" },
          { label: "Phone Number", key: "executor_phone" },
          { label: "Email Address", key: "executor_email" }
        ]
      },
      {
        title: "Legal Documents",
        type: "table",
        key: "legal_documents",
        columns: ["Document Type", "Location", "Date Created"]
      }
    ]
  },
  {
    section_number: 4,
    section_title: "Financial Information",
    subsections: [
      {
        title: "Bank Accounts",
        type: "table",
        key: "bank_accounts",
        columns: ["Bank Name", "Account Type", "Account Number", "Notes"]
      },
      {
        title: "Investment Accounts",
        type: "table",
        key: "investment_accounts",
        columns: ["Institution", "Account Type", "Account Number", "Notes"]
      },
      {
        title: "Insurance Policies",
        type: "table",
        key: "insurance_policies",
        columns: ["Policy Type", "Provider", "Policy Number", "Beneficiary"]
      }
    ]
  },
  {
    section_number: 5,
    section_title: "Digital Life & Passwords",
    subsections: [
      {
        title: "Email Accounts",
        type: "table",
        key: "email_accounts",
        columns: ["Provider", "Username", "Recovery Email"]
      },
      {
        title: "Social Media",
        type: "table",
        key: "social_media",
        columns: ["Platform", "Username", "Profile URL"]
      },
      {
        title: "Password Manager",
        type: "list",
        key: "password_manager",
        fields: [
          { label: "Service Used", key: "service" },
          { label: "Master Password Location", key: "master_password_location" },
          { label: "Recovery Information", key: "recovery_information" }
        ]
      }
    ]
  },
  {
    section_number: 6,
    section_title: "Personal Property & Real Estate",
    subsections: [
      {
        title: "Primary Residence",
        type: "list",
        key: "primary_residence",
        fields: [
          { label: "Address", key: "address" },
          { label: "Mortgage Information", key: "mortgage_information" },
          { label: "Insurance", key: "insurance" },
          { label: "Utilities", key: "utilities" }
        ]
      },
      {
        title: "Additional Properties",
        type: "table",
        key: "additional_properties",
        columns: ["Address", "Property Type", "Estimated Value", "Notes"]
      },
      {
        title: "High-Value Items",
        type: "table",
        key: "high_value_items",
        columns: ["Item Description", "Location", "Estimated Value", "Insurance"]
      }
    ]
  },
  {
    section_number: 7,
    section_title: "Funeral & Final Arrangements",
    subsections: [
      {
        title: "Service Preferences",
        type: "list",
        key: "service_preferences",
        fields: [
          { label: "Service Type", key: "service_type" },
          { label: "Location Preference", key: "location_preference" },
          { label: "Religious Considerations", key: "religious_considerations" }
        ]
      },
      {
        title: "Disposition Preferences",
        type: "list",
        key: "disposition",
        fields: [
          { label: "Burial or Cremation", key: "disposition_type" },
          { label: "Location", key: "disposition_location" },
          { label: "Pre-arranged Services", key: "pre_arranged" }
        ]
      }
    ]
  },
  {
    section_number: 8,
    section_title: "Accounts & Memberships",
    subsections: [
      {
        title: "Club Memberships",
        type: "table",
        key: "club_memberships",
        columns: ["Club Name", "Membership Number", "Annual Fee", "Contact"]
      },
      {
        title: "Streaming Services",
        type: "table",
        key: "streaming_services",
        columns: ["Service Name", "Username", "Password Location", "Billing"]
      },
      {
        title: "Professional Memberships",
        type: "table",
        key: "professional_memberships",
        columns: ["Organization", "Member Since", "Membership Level", "Contact"]
      }
    ]
  },
  {
    section_number: 9,
    section_title: "Pets & Animal Care",
    subsections: [
      {
        title: "Pet Information",
        type: "table",
        key: "pets",
        columns: ["Pet Name", "Species/Breed", "Age", "Special Needs"]
      },
      {
        title: "Care Instructions",
        type: "list",
        key: "pet_care",
        fields: [
          { label: "Veterinarian", key: "veterinarian" },
          { label: "Feeding Schedule", key: "feeding_schedule" },
          { label: "Medications", key: "medications" },
          { label: "Caregiver Arrangements", key: "caregiver_arrangements" }
        ]
      }
    ]
  },
  {
    section_number: 10,
    section_title: "Key Contacts",
    subsections: [
      {
        title: "Emergency Contacts",
        type: "table",
        key: "emergency_contacts",
        columns: ["Name", "Relationship", "Phone", "Email"]
      },
      {
        title: "Professional Contacts",
        type: "table",
        key: "professional_contacts",
        columns: ["Name", "Profession", "Phone", "Email"]
      },
      {
        title: "Family Contacts",
        type: "table",
        key: "family_contacts",
        columns: ["Name", "Relationship", "Phone", "Email"]
      }
    ]
  },
  {
    section_number: 11,
    section_title: "Short Letters to Loved Ones",
    subsections: [
      {
        title: "Personal Messages",
        type: "paragraph",
        key: "personal_messages"
      }
    ]
  },
  {
    section_number: 12,
    section_title: "Final Wishes & Legacy Planning",
    subsections: [
      {
        title: "Legacy Wishes",
        type: "paragraph",
        key: "legacy_wishes"
      },
      {
        title: "Memorial Preferences",
        type: "list",
        key: "memorial_preferences",
        fields: [
          { label: "Memorial Type", key: "memorial_type" },
          { label: "Location Preference", key: "memorial_location" },
          { label: "Special Requests", key: "special_requests" }
        ]
      }
    ]
  },
  {
    section_number: 13,
    section_title: "Bucket List & Unfinished Business",
    subsections: [
      {
        title: "Bucket List Items",
        type: "table",
        key: "bucket_list",
        columns: ["Item", "Priority", "Estimated Cost", "Notes"]
      },
      {
        title: "Unfinished Business",
        type: "paragraph",
        key: "unfinished_business"
      }
    ]
  },
  {
    section_number: 14,
    section_title: "Formal Letters",
    subsections: [
      {
        title: "Legal Letters",
        type: "paragraph",
        key: "legal_letters"
      },
      {
        title: "Business Letters",
        type: "paragraph",
        key: "business_letters"
      }
    ]
  },
  {
    section_number: 15,
    section_title: "Transition Notes",
    subsections: [
      {
        title: "Important Information",
        type: "paragraph",
        key: "transition_notes"
      }
    ]
  },
  {
    section_number: 16,
    section_title: "File Uploads & Multimedia",
    subsections: [
      {
        title: "Important Documents",
        type: "table",
        key: "important_documents",
        columns: ["Document Type", "File Name", "Location", "Notes"]
      },
      {
        title: "Photos & Videos",
        type: "table",
        key: "photos_videos",
        columns: ["Description", "File Name", "Location", "Notes"]
      }
    ]
  },
  {
    section_number: 17,
    section_title: "Final Checklist",
    subsections: [
      {
        title: "Completion Checklist",
        type: "list",
        key: "final_checklist",
        fields: [
          { label: "Will Updated", key: "will_updated" },
          { label: "Power of Attorney", key: "power_of_attorney" },
          { label: "Healthcare Proxy", key: "healthcare_proxy" },
          { label: "Life Insurance", key: "life_insurance" },
          { label: "Digital Assets", key: "digital_assets" },
          { label: "Funeral Arrangements", key: "funeral_arrangements" }
        ]
      }
    ]
  },
  {
    section_number: 18,
    section_title: "Additional Notes",
    subsections: [
      {
        title: "Miscellaneous Information",
        type: "paragraph",
        key: "additional_notes"
      }
    ]
  }
];

// Helper function to get section config by number
export const getSectionConfig = (sectionNumber: number): SectionConfig | undefined => {
  return SECTION_CONFIGS.find(section => section.section_number === sectionNumber);
};

// Helper function to get all sections that have data
export const getSectionsWithData = (userData: any): SectionConfig[] => {
  return SECTION_CONFIGS.filter(section => {
    // Check if any subsection has data
    return section.subsections.some(subsection => {
      const data = userData[subsection.key];
      return data && (Array.isArray(data) ? data.length > 0 : data);
    });
  });
}; 