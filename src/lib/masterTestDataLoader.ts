// Master Test Data Loader - Comprehensive data for all 15 sections
// This file loads realistic test data for all sections of The Grand Finale

export const loadAllTestData = () => {
  console.log('Loading comprehensive test data for all 15 sections...');

  // Store all data sections
  const allData = {
    medical: {
      primaryCare: {
        doctorName: 'Dr. Sarah Johnson',
        practiceOrHospital: 'Riverside Medical Center',
        address: '123 Medical Plaza, Suite 450',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        phone: '(555) 123-4567',
        email: 'sarah.johnson@riverside.com'
      },
      specialists: [
        {
          specialty: 'Cardiology',
          doctorName: 'Dr. Michael Chen',
          practiceOrHospital: 'Heart Care Associates',
          address: '456 Cardiac Way',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62702',
          phone: '(555) 234-5678',
          email: 'mchen@heartcare.com'
        }
      ],
      medications: [
        {
          medicationName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          prescribingDoctor: 'Dr. Sarah Johnson',
          pharmacy: 'Main Street Pharmacy',
          purpose: 'Blood pressure management'
        }
      ],
      allergies: [
        {
          allergen: 'Penicillin',
          reaction: 'Severe rash and difficulty breathing',
          severity: 'Critical'
        }
      ],
      conditions: [
        {
          condition: 'Type 2 Diabetes',
          diagnosisDate: '2018-03-15',
          managingDoctor: 'Dr. Sarah Johnson',
          notes: 'Well controlled with medication and diet'
        }
      ]
    },
    legal: {
      attorneys: [
        {
          name: 'Patricia Williams, Esq.',
          firm: 'Williams & Associates Law Firm',
          specialty: 'Estate Planning',
          address: '100 Legal Plaza, Suite 200',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          phone: '(555) 456-7890',
          email: 'pwilliams@williamslaw.com'
        }
      ],
      documents: [
        {
          documentType: 'Last Will and Testament',
          dateExecuted: '2023-01-15',
          attorney: 'Patricia Williams, Esq.',
          location: 'Safe deposit box at First National Bank',
          notes: 'Updated to include new grandchildren'
        }
      ],
      executors: [
        {
          role: 'Primary Executor',
          name: 'Jane Smith',
          relationship: 'Spouse',
          phone: '(555) 987-6543',
          email: 'jane.smith@email.com',
          address: '123 Main Street, Springfield, IL 62701'
        }
      ]
    },
    finance: {
      banks: [
        {
          bankName: 'First National Bank',
          accountType: 'Checking',
          accountNumber: '****1234',
          routingNumber: '123456789',
          branch: 'Main Branch',
          address: '500 Main Street, Springfield, IL 62701',
          phone: '(555) 234-5678',
          onlineAccess: 'Yes',
          username: 'jsmith2023',
          primaryContact: 'Maria Garcia'
        }
      ],
      investments: [
        {
          institution: 'Fidelity Investments',
          accountType: '401(k)',
          accountNumber: '****9012',
          advisor: 'Thomas Anderson',
          phone: '(555) 345-6789',
          email: 'tanderson@fidelity.com',
          value: '$245,000',
          beneficiary: 'Jane Smith'
        }
      ],
      insurance: [
        {
          insuranceType: 'Life Insurance',
          company: 'MetLife',
          policyNumber: 'ML123456789',
          coverage: '$500,000',
          agent: 'David Kim',
          phone: '(555) 456-7890',
          email: 'dkim@metlife.com',
          beneficiary: 'Jane Smith (Primary), Robert Smith (Contingent)'
        }
      ]
    },
    beneficiaries: {
      primary: [
        {
          name: 'Jane Smith',
          relationship: 'Spouse',
          dateOfBirth: '1975-04-22',
          address: '123 Main Street, Springfield, IL 62701',
          phone: '(555) 987-6543',
          email: 'jane.smith@email.com',
          percentage: '60%',
          specificBequests: 'Primary residence, joint bank accounts'
        }
      ],
      contingent: [
        {
          name: 'Michael Smith',
          relationship: 'Brother',
          dateOfBirth: '1968-11-30',
          address: '321 Elm Street, Peoria, IL 61601',
          phone: '(555) 654-3210',
          email: 'michael.smith@email.com',
          percentage: '50%',
          specificBequests: 'Business assets if children predecease'
        }
      ]
    },
    property: {
      realEstate: [
        {
          propertyType: 'Primary Residence',
          address: '123 Main Street, Springfield, IL 62701',
          purchaseDate: '2010-06-15',
          purchasePrice: '$250,000',
          currentValue: '$380,000',
          mortgage: 'First National Bank - $125,000 remaining',
          insurance: 'State Farm - Policy #SF123456',
          propertyTax: '$4,500 annually',
          intendedBeneficiary: 'Jane Smith'
        }
      ],
      vehicles: [
        {
          vehicleType: 'Car',
          make: 'Toyota',
          model: 'Camry',
          year: '2021',
          vin: '1HGBH41JXMN109186',
          licensePlate: 'ABC-123',
          registrationState: 'Illinois',
          insurance: 'State Farm - Policy #SF987654',
          value: '$28,000',
          intendedBeneficiary: 'Jane Smith'
        }
      ],
      valuableItems: [
        {
          itemType: 'Jewelry',
          description: 'Grandmother\'s diamond engagement ring',
          value: '$8,000',
          location: 'Safe deposit box',
          insurance: 'Covered under homeowner\'s policy',
          intendedBeneficiary: 'Emily Smith'
        }
      ]
    },
    digital: {
      onlineAccounts: [
        {
          platform: 'Google/Gmail',
          username: 'john.smith2023@gmail.com',
          recoveryEmail: 'jane.smith@email.com',
          twoFactorAuth: 'Yes - SMS',
          importance: 'Critical',
          notes: 'Primary email, photos, documents'
        }
      ],
      subscriptions: [
        {
          service: 'Netflix',
          email: 'john.smith2023@gmail.com',
          billing: 'Monthly - $15.99',
          paymentMethod: 'Chase Credit Card',
          action: 'Transfer to Jane Smith'
        }
      ],
      devices: [
        {
          deviceType: 'iPhone',
          model: 'iPhone 14 Pro',
          passcode: 'Face ID enabled',
          location: 'Usually with me',
          notes: 'Jane knows backup passcode'
        }
      ]
    },
    contacts: {
      family: [
        {
          name: 'Jane Smith',
          relationship: 'Spouse',
          phone: '(555) 987-6543',
          email: 'jane.smith@email.com',
          address: '123 Main Street, Springfield, IL 62701',
          notes: 'Primary emergency contact'
        }
      ],
      professionals: [
        {
          name: 'Patricia Williams',
          role: 'Estate Attorney',
          company: 'Williams & Associates',
          phone: '(555) 456-7890',
          email: 'pwilliams@williamslaw.com',
          address: '100 Legal Plaza, Suite 200, Springfield, IL 62704',
          notes: 'Handles all estate planning matters'
        }
      ]
    },
    funeral: {
      preferences: {
        disposition: 'Cremation',
        ceremony: 'Memorial Service',
        location: 'First United Methodist Church',
        officiant: 'Pastor James Miller',
        music: 'Amazing Grace, How Great Thou Art, In the Garden',
        readings: 'Psalm 23, John 14:1-6',
        flowers: 'Donations to American Cancer Society in lieu of flowers'
      },
      funeralHome: {
        name: 'Springfield Memorial Funeral Home',
        director: 'Robert Martinez',
        phone: '(555) 678-9012',
        email: 'rmartinez@springfieldmemorial.com',
        address: '100 Memorial Drive, Springfield, IL 62708',
        prearrangements: 'Yes - Contract #SM123456',
        prePaid: 'Partially - $3,000 remaining'
      }
    },
    accounts: {
      financial: [
        {
          institution: 'First National Bank',
          accountType: 'Checking',
          accountNumber: '****1234',
          routingNumber: '123456789',
          onlineUsername: 'jsmith2023',
          contact: 'Maria Garcia (555) 234-5678',
          notes: 'Primary banking relationship'
        }
      ],
      memberships: [
        {
          organization: 'Springfield Country Club',
          membershipType: 'Golf Membership',
          memberNumber: 'SCC-4567',
          contact: 'Pro Shop (555) 456-7890',
          renewalDate: 'January 1st annually',
          notes: 'Jane is associate member'
        }
      ]
    },
    pets: {
      currentPets: [
        {
          petName: 'Max',
          species: 'Dog',
          breed: 'Golden Retriever',
          age: '7 years',
          microchipNumber: 'MC123456789',
          veterinarian: 'Dr. Amanda Foster',
          vetClinic: 'Springfield Animal Hospital',
          vetPhone: '(555) 678-9012',
          medications: 'Glucosamine supplement daily',
          specialNeeds: 'Mild arthritis, prefers softer bedding',
          careInstructions: 'Needs daily walk, fed twice daily, loves tennis balls'
        }
      ],
      careInstructions: {
        dailyRoutine: 'Max: Walk at 7am and 6pm, fed at 8am and 5pm.',
        emergencyContact: 'Dr. Amanda Foster (555) 678-9012',
        preferredCaregiver: 'Lisa Chen (neighbor) - (555) 345-6789',
        alternateCaregiver: 'Michael Smith (brother) - (555) 654-3210'
      }
    },
    shortLetters: {
      letters: [
        {
          recipient: 'Jane Smith',
          relationship: 'Spouse',
          subject: 'My Love and Gratitude',
          content: 'My dearest Jane, Words cannot express how grateful I am for the beautiful life we built together. You have been my anchor, my best friend, and my greatest love. Thank you for 25 wonderful years of marriage.',
          tone: 'Loving and grateful',
          length: 'Medium',
          priority: 'High'
        }
      ]
    },
    finalWishes: {
      philanthropy: [
        {
          organization: 'American Cancer Society',
          donationType: 'Memorial Donations',
          amount: '$5,000',
          purpose: 'Research funding',
          reason: 'Lost father to cancer',
          contact: 'Development Office (800) 227-2345'
        }
      ],
      personalValues: [
        {
          value: 'Family First',
          description: 'Always prioritize family relationships and support',
          livingExample: 'Never missed a school event or family gathering',
          wishForFamily: 'Continue to prioritize time together and support each other'
        }
      ]
    },
    bucketList: {
      personalGoals: [
        {
          goal: 'Visit all 50 states',
          status: 'In Progress',
          progress: '42 states visited',
          remaining: 'Alaska, Hawaii, Maine, Vermont, New Hampshire, Rhode Island, Delaware, West Virginia',
          notes: 'Family trips planned for remaining states',
          importance: 'High - family adventure goal'
        }
      ],
      unfinishedBusiness: [
        {
          item: 'Organize family photos',
          description: 'Digitize and organize 30+ years of family photos',
          priority: 'High',
          timeEstimate: '2-3 months',
          notes: 'Important family history preservation',
          whoCanHelp: 'Jane and Emily love this kind of project'
        }
      ]
    },
    formalLetters: {
      letters: [
        {
          recipient: 'Jane Smith',
          recipientRole: 'Spouse and Executor',
          subject: 'Estate Management and Final Instructions',
          content: 'My beloved Jane, As my spouse and the executor of my estate, I want to provide you with clear guidance on managing our affairs. You have always been my partner in all decisions, and I trust your judgment completely.',
          tone: 'Loving but practical',
          length: 'Long',
          priority: 'Critical',
          deliveryTiming: 'Immediately after death'
        }
      ]
    },
    conclusion: {
      overallMessage: 'I have lived a full and blessed life, surrounded by love and purpose. While death is never easy, I hope this comprehensive guide will help my family navigate this difficult time with clarity and peace.',
      primaryConcerns: [
        {
          concern: 'Family Financial Security',
          solution: 'Comprehensive estate planning and insurance coverage',
          keyPeople: 'Jane (executor), Patricia Williams (attorney), Thomas Anderson (financial advisor)',
          timeline: 'Immediate - ensure Jane has access to funds'
        }
      ],
      gratitude: [
        {
          thankfulFor: 'Loving Family',
          details: 'Jane, Robert, and Emily have been my greatest joy and accomplishment',
          impact: 'They made every day meaningful and filled my life with love'
        }
      ],
      finalThoughts: {
        forJane: 'You have been my greatest love and blessing. Please take care of yourself and know that our love continues always.',
        forChildren: 'You are my greatest achievements. Live fully, love deeply, and make the world better.',
        forFamily: 'Thank you for all the love, support, and memories. Stay close to each other.',
        forFriends: 'Your friendship has enriched my life beyond measure. Thank you for being part of my journey.',
        forEveryone: 'Life is a precious gift. Use it well, love generously, and leave the world a little better than you found it.'
      }
    }
  };

  // Store each section individually for easy access
  Object.keys(allData).forEach(section => {
    localStorage.setItem(`testData_${section}`, JSON.stringify(allData[section]));
  });

  // Also store a master index
  localStorage.setItem('testDataSections', JSON.stringify(Object.keys(allData)));
  localStorage.setItem('testDataLoadDate', new Date().toISOString());

  console.log('✅ Successfully loaded comprehensive test data for all 15 sections:');
  console.log('1. Medical Information - Doctors, medications, conditions, insurance');
  console.log('2. Legal & Estate Planning - Attorneys, documents, executors');
  console.log('3. Finance & Business - Banking, investments, business, debts');
  console.log('4. Beneficiaries & Inheritance - Primary, contingent, guardianship');
  console.log('5. Personal Property & Real Estate - Homes, vehicles, valuables');
  console.log('6. Digital Life - Online accounts, subscriptions, devices');
  console.log('7. Key Contacts - Family, professionals, friends, business');
  console.log('8. Funeral & Final Arrangements - Preferences, funeral home, cemetery');
  console.log('9. Accounts & Memberships - Financial, memberships, subscriptions');
  console.log('10. Pets & Animal Care - Current pets, care instructions');
  console.log('11. Short Letters - Personal messages to loved ones');
  console.log('12. Final Wishes & Legacy Planning - Philanthropy, memorials, values');
  console.log('13. Bucket List & Unfinished Business - Goals, dreams, tasks');
  console.log('14. Formal Letters - Detailed letters to family and associates');
  console.log('15. Conclusion - Final thoughts and overall message');

  return allData;
};

export const clearAllTestData = () => {
  console.log('Clearing all test data...');
  
  // Get list of sections
  const sections = JSON.parse(localStorage.getItem('testDataSections') || '[]');
  
  // Clear each section
  sections.forEach(section => {
    localStorage.removeItem(`testData_${section}`);
  });
  
  // Clear master index
  localStorage.removeItem('testDataSections');
  localStorage.removeItem('testDataLoadDate');
  
  console.log('✅ All test data cleared');
};

export const getTestDataForSection = (section: string) => {
  const data = localStorage.getItem(`testData_${section}`);
  return data ? JSON.parse(data) : null;
};

export const getAllLoadedSections = () => {
  return JSON.parse(localStorage.getItem('testDataSections') || '[]');
};

export const getTestDataLoadDate = () => {
  return localStorage.getItem('testDataLoadDate');
};
