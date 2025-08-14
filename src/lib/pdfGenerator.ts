  // Always show page number, e.g. "Page 2 of 5"

// Helper for 'Page X of Y' style numbering
const addPageNumberWithTotal = (doc: jsPDF, pageIndex: number, pageCount: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  const pageNumberY = pageHeight - 7;
  doc.setFontSize(10);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'bold');
  doc.text(`Page ${pageIndex + 1} of ${pageCount}`, centerX, pageNumberY, { align: 'center' });
};
import jsPDF from 'jspdf';

export interface PDFData {
  sectionTitle: string;
  data: Record<string, any>;
  formType: 'personal' | 'medical' | 'legal' | 'complete' | 'finance' | 'beneficiaries' | 'personalProperty' | 'digitalLife' | 'keyContacts' | 'funeral' | 'accounts' | 'pets' | 'shortLetters' | 'finalWishes' | 'bucketList' | 'formalLetters' | 'transitionNotes' | 'fileUploads' | 'idDocuments';
  userTier?: string;
  isTrial?: boolean;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

// Helper function to safely get data from localStorage
const getLocalStorageData = (key: string): any => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing localStorage data for ${key}:`, error);
    return null;
  }
};

  // Helper function to add "No information added" text
  const addNoInformationText = (doc: jsPDF, margin: number, y: number, contentWidth: number): number => {
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128); // Gray color
    doc.setFont('helvetica', 'italic');
    const noInfoText = 'No information added';
    doc.text(noInfoText, margin, y + 5);
    return y + 15; // Return new Y position
  };

  // Helper function to generate QR code for a file
  const generateQRCodeForFile = async (fileUrl: string, fileName?: string, fileType?: string): Promise<string> => {
    try {
      // Create structured data for the QR code
      const qrData = {
        fileUrl: fileUrl,
        fileName: fileName || 'Document',
        fileType: fileType || 'document',
        timestamp: new Date().toISOString(),
        type: 'legacy-document',
        source: 'The Grand Finale'
      };
      
      // Convert to JSON string
      const qrDataString = JSON.stringify(qrData);
      
      const QRCode = (await import('qrcode')).default;
      return await QRCode.toDataURL(qrDataString, {
        width: 100,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

// Helper function to add logo to any page with section context
const addLogoToPage = (doc: jsPDF, margin: number, pageNumber?: number, options?: { 
  isFirstPageOfSection?: boolean, 
  sectionTitle?: string,
  skipLogo?: boolean,
  userInfo?: { firstName?: string; lastName?: string; email?: string }
}) => {
  const { isFirstPageOfSection = true, sectionTitle = '', skipLogo = false } = options || {};
  
  // Only show logo on first page of each section or if explicitly requested
  if (!skipLogo && isFirstPageOfSection) {
    try {
      // Try to add the SkillBinder logo image - maintain proper aspect ratio (302×250 pixels)
      const logoHeight = 25; // Height in mm
      const logoWidth = logoHeight * (302/250); // Maintain exact aspect ratio: 302/250 = 1.208
      doc.addImage('/skillbinder_logo_with_guides.jpg', 'JPEG', margin, 10, logoWidth, logoHeight);
      
      // Get page width for centering calculations
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add "The Grand Finale" in gold to the right of the logo, centered on page
      doc.setFontSize(26);
      doc.setTextColor(228, 182, 74); // Gold color
      doc.setFont('times', 'bold');
      const titleText = 'The Grand Finale';
      const titleWidth = doc.getTextWidth(titleText);
      const titleX = (pageWidth - titleWidth) / 2; // Center on page
      doc.text(titleText, titleX, 20);
      
      // Add tagline "A well planned goodbye" in blue, centered under the title
      doc.setFontSize(14);
      doc.setTextColor(21, 58, 75); // Dark blue
      doc.setFont('helvetica', 'normal');
      const taglineText = 'A well planned goodbye';
      const taglineWidth = doc.getTextWidth(taglineText);
      const taglineX = (pageWidth - taglineWidth) / 2; // Center on page
      doc.text(taglineText, taglineX, 28);
      
      // Add decorative line from margin to margin
      doc.setDrawColor(228, 182, 74); // Gold color
      doc.setLineWidth(1);
      doc.line(margin, 40, pageWidth - margin, 40);
      
    } catch (error) {
      console.warn('Could not load logo image, falling back to text-based logo:', error);
      
      // Fallback to text-based logo - make it very compact
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add "The Grand Finale" in gold, centered on page
      doc.setFontSize(26);
      doc.setTextColor(228, 182, 74); // Gold color
      doc.setFont('times', 'bold');
      const titleText = 'The Grand Finale';
      const titleWidth = doc.getTextWidth(titleText);
      const titleX = (pageWidth - titleWidth) / 2; // Center on page
      doc.text(titleText, titleX, 20);
      
      // Add tagline "A well planned goodbye" in blue, centered under the title
      doc.setFontSize(14);
      doc.setTextColor(21, 58, 75); // Dark blue
      doc.setFont('helvetica', 'normal');
      const taglineText = 'A well planned goodbye';
      const taglineWidth = doc.getTextWidth(taglineText);
      const taglineX = (pageWidth - taglineWidth) / 2; // Center on page
      doc.text(taglineText, taglineX, 28);
      
      // Add decorative line from margin to margin
      doc.setDrawColor(228, 182, 74); // Gold color
      doc.setLineWidth(1);
      doc.line(margin, 40, pageWidth - margin, 40);
    }
  }
  
  // Add page number and footer if provided
  if (typeof pageNumber !== 'undefined') {
    addPageNumber(doc, pageNumber);
    addFooter(doc, options?.userInfo);
  }
};

// Add page number to the current page
const addPageNumber = (doc: jsPDF, pageIndex: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  const pageNumberY = pageHeight - 7;
  doc.setFontSize(10);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'bold');
  doc.text(`Page ${pageIndex + 1}`, centerX, pageNumberY, { align: 'center' });
};

// Add footer with generation date to the current page
const addFooter = (doc: jsPDF, userInfo?: { firstName?: string; lastName?: string; email?: string }) => {
  // Always show centered footer, no background
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const footerY = pageHeight - 13; // 13mm from bottom edge
  doc.setFontSize(10);
  doc.setTextColor(21, 58, 75); // Dark blue
  doc.setFont('helvetica', 'normal');
  
  // Get user name and email for footer
  let userName = '';
  let userEmail = '';
  
  // Use provided user info if available
  if (userInfo) {
    if (userInfo.firstName && userInfo.lastName) {
      userName = `${userInfo.firstName} ${userInfo.lastName}`;
    }
    if (userInfo.email) {
      userEmail = userInfo.email;
    }
  }
  
  // Fallback to localStorage if no user info provided
  if (!userName || !userEmail) {
    try {
      // Try multiple possible localStorage keys for user data
      const possibleKeys = [
        'personalContactData',
        'personalInfo',
        'basicInfo',
        'userData',
        'formData'
      ];
      
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            if (!userName && parsed.firstName && parsed.lastName) {
              userName = `${parsed.firstName} ${parsed.lastName}`;
            }
            if (!userEmail && parsed.email && parsed.email.includes('@')) {
              userEmail = parsed.email;
            }
          } catch (e) {
            continue;
          }
        }
      }
      
      // Get user email from multiple possible sources if still not found
      if (!userEmail) {
        const emailSources = [
          localStorage.getItem('userEmail'),
          JSON.parse(localStorage.getItem('authUser') || '{}')?.email,
          JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.currentSession?.user?.email,
          JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.access_token ? 
            JSON.parse(atob(JSON.parse(localStorage.getItem('supabase.auth.token') || '{}')?.access_token.split('.')[1]))?.email : null
        ];
        
        // Find the first valid email
        for (const email of emailSources) {
          if (email && typeof email === 'string' && email.includes('@')) {
            userEmail = email;
            break;
          }
        }
      }
      
      // If no name found, use email prefix as name and format it properly
      if (!userName && userEmail && userEmail.includes('@')) {
        const emailPrefix = userEmail.split('@')[0];
        // Convert email prefix to proper name format (e.g., "glenn.donnelly" -> "Glenn Donnelly")
        userName = emailPrefix
          .split('.')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');
      }
    } catch (e) {
      if (!userName) userName = 'User';
      if (!userEmail) userEmail = 'No email available';
    }
  }
  
  // Format current date and time with timezone
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Get timezone abbreviation (EDT, EST, etc.)
  const timezone = now.toLocaleTimeString('en-US', { 
    timeZoneName: 'short' 
  }).split(' ').pop() || 'EDT';
  
  // Footer: Generated for: Name | Email: email | Generated on: date @ time timezone
  const footerText = `Generated for: ${userName} | Email: ${userEmail} | Generated on: ${dateStr} @ ${timeStr} hrs ${timezone}`;
  doc.text(footerText, pageWidth / 2, footerY, { align: 'center' });
};

// Add watermark to pages for trial and lite users
const addWatermark = (doc: jsPDF, hasWatermark: boolean, isTrial?: boolean) => {
  if (!hasWatermark) return;
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Add watermark
  doc.setFontSize(50);
  doc.setTextColor(240, 240, 240); // Very light gray - more transparent
  doc.setFont('helvetica', 'bold');
  
  // Add watermark text diagonally across the page - adjust Y position for rotated text
  // When text is rotated, the Y position refers to the baseline, so we need to adjust
  const adjustedCenterY = centerY + 15; // Move down to account for rotated text baseline
  const watermarkText = isTrial ? 'TRIAL VERSION' : 'LITE EDITION';
  doc.text(watermarkText, centerX, adjustedCenterY, { 
    align: 'center',
    angle: -45
  });
  
  // Add smaller watermark at bottom
  doc.setFontSize(12);
  doc.setTextColor(180, 180, 180); // Lighter gray - more transparent
  doc.setFont('helvetica', 'normal');
  doc.text('Upgrade to remove watermark - skillbinder.com', centerX, pageHeight - 25, { 
    align: 'center'
  });
};

// Helper function to create a professional title page
const createTitlePage = (doc: jsPDF, margin: number, userName?: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;
  
  try {
    // Add the SkillBinder logo image - larger on title page with proper aspect ratio (302×250 pixels)
    const logoHeight = 50; // Larger for title page
    const logoWidth = logoHeight * (302/250); // Maintain exact aspect ratio: 302/250 = 1.208
    const logoX = (pageWidth - logoWidth) / 2; // Center the logo
    doc.addImage('/skillbinder_logo_with_guides.jpg', 'JPEG', logoX, 60, logoWidth, logoHeight);
    
    // Add "The Grand Finale" title - larger and prominent
    doc.setFontSize(36);
    doc.setTextColor(228, 182, 74); // Gold color
    doc.setFont('times', 'bold');
    const titleText = 'The Grand Finale';
    doc.text(titleText, centerX, 130, { align: 'center' });
    
    // Add tagline
    doc.setFontSize(18);
    doc.setTextColor(21, 58, 75); // Dark blue
    doc.setFont('helvetica', 'normal');
    const taglineText = 'A well planned goodbye';
    doc.text(taglineText, centerX, 150, { align: 'center' });
    
    // Add personalized "Produced for" text if user name is available
    if (userName && userName.trim()) {
      doc.setFontSize(16);
      doc.setTextColor(21, 58, 75);
      doc.setFont('helvetica', 'bold');
      doc.text('Produced for', centerX, 190, { align: 'center' });
      
      doc.setFontSize(20);
      doc.setTextColor(228, 182, 74); // Gold color
      doc.setFont('times', 'bold');
      doc.text(userName, centerX, 210, { align: 'center' });
    }
    
    // Add generation date at bottom
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, centerX, pageHeight - 30, { align: 'center' });
    
    // Add decorative border
    doc.setDrawColor(228, 182, 74); // Gold color
    doc.setLineWidth(2);
    doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2));
    
  } catch (error) {
    console.warn('Could not load logo image for title page, falling back to text-based design:', error);
    
    // Fallback design without logo
    doc.setFontSize(42);
    doc.setTextColor(228, 182, 74); // Gold color
    doc.setFont('times', 'bold');
    const titleText = 'The Grand Finale';
    doc.text(titleText, centerX, 120, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(21, 58, 75); // Dark blue
    doc.setFont('helvetica', 'normal');
    const taglineText = 'A well planned goodbye';
    doc.text(taglineText, centerX, 150, { align: 'center' });
    
    if (userName && userName.trim()) {
      doc.setFontSize(16);
      doc.setTextColor(21, 58, 75);
      doc.setFont('helvetica', 'bold');
      doc.text('Produced for', centerX, 190, { align: 'center' });
      
      doc.setFontSize(22);
      doc.setTextColor(228, 182, 74); // Gold color
      doc.setFont('times', 'bold');
      doc.text(userName, centerX, 210, { align: 'center' });
    }
    
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, centerX, pageHeight - 30, { align: 'center' });
    
    // Add decorative border
    doc.setDrawColor(228, 182, 74); // Gold color
    doc.setLineWidth(2);
    doc.rect(margin, margin, pageWidth - (margin * 2), pageHeight - (margin * 2));
  }
};

// Helper function to create section title pages
const createSectionTitlePage = (doc: jsPDF, sectionTitle: string, margin: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Add small logo at top
  addLogoToPage(doc, margin, undefined, { isFirstPageOfSection: true, sectionTitle });
  
  // Add large section title in center
  doc.setFontSize(32);
  doc.setTextColor(228, 182, 74); // Gold color
  doc.setFont('times', 'bold');
  doc.text(sectionTitle, centerX, centerY, { align: 'center' });
  
  // Add decorative elements
  doc.setDrawColor(228, 182, 74); // Gold color
  doc.setLineWidth(1);
  const lineLength = 100;
  
  // Draw decorative lines above and below title
  doc.line(centerX - lineLength/2, centerY - 20, centerX + lineLength/2, centerY - 20);
  doc.line(centerX - lineLength/2, centerY + 20, centerX + lineLength/2, centerY + 20);
};

// Helper function to add page header with section awareness
const addPageHeader = (doc: jsPDF, title: string, margin: number, pageNumber?: number, isFirstPageOfSection: boolean = true) => {
  addLogoToPage(doc, margin, pageNumber, { 
    isFirstPageOfSection, 
    sectionTitle: title 
  });
  
  // Only add section title if logo is shown (first page of section)
  if (isFirstPageOfSection) {
    // Add section title with proper spacing from logo
    doc.setFontSize(20);
    doc.setTextColor(228, 182, 74); // Gold color
    doc.setFont('helvetica', 'bold');
    
    // Calculate center position for the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;
    doc.text(title, centerX, 55, { align: 'center' });
    
    return 65; // Return starting Y position for content - adjusted for much smaller logo
  } else {
    // For continuation pages, start content higher up since no logo/title
    return 30;
  }
};

// Helper function to check if there's enough space for content
const hasEnoughSpace = (y: number, estimatedHeight: number): boolean => {
  return y + estimatedHeight <= 270;
};

// Helper function to estimate space needed for a complete subsection
const estimateSubsectionSpace = (data: any, sectionType: string): number => {
  switch (sectionType) {
    case 'legal_biographical':
      return 80; // 10 fields * 8 lines
    case 'government_id':
      return 48; // 6 fields * 8 lines
    case 'phone_numbers':
      return data.phones ? data.phones.length * 8 : 0;
    case 'address_history':
      return data.addresses ? data.addresses.length * 32 : 0;
    case 'emergency_contacts':
      return data.contacts ? data.contacts.length * 48 : 0;
    case 'family_info':
      return 32; // 4 fields * 8 lines
    case 'relationship_status':
      return 24; // 3 fields * 8 lines
    case 'children_dependents':
      return data.children ? data.children.length * 24 : 0;
    case 'religious_preferences':
      return 64; // 8 fields * 8 lines
    case 'work_career':
      return 56; // 7 fields * 8 lines
    case 'security_digital':
      return 48; // 6 fields * 8 lines
    case 'critical_documents':
      return data.criticalDocs ? data.criticalDocs.length * 8 : 0;
    case 'education_history':
      return data.schools ? data.schools.length * 40 : 0;
    case 'additional_notes':
      return 8; // 1 field * 8 lines
    case 'physician_info':
      return data.doctors ? data.doctors.length * 48 : 0;
    case 'medications':
      return data.medications ? data.medications.length * 32 : 0;
    case 'organ_donation':
      return 72; // 9 fields * 8 lines
    case 'healthcare_proxy':
      return 40; // 5 fields * 8 lines
    case 'insurance_details':
      return 40; // 5 fields * 8 lines
    case 'pharmacy_info':
      return 16; // 2 fields * 8 lines
    case 'allergies_reactions':
      return 16; // 2 fields * 8 lines
    case 'medical_history':
      return 24; // 3 fields * 8 lines
    case 'preferred_facilities':
      return 16; // 2 fields * 8 lines
    case 'will_estate':
      return 32; // 4 fields * 8 lines
    case 'executor_details':
      return 56; // 7 fields * 8 lines
    case 'executor_notes':
      return 40; // 5 fields * 8 lines
    case 'legal_contacts':
      return 48; // 6 fields * 8 lines
    case 'power_of_attorney':
      return 40; // 5 fields * 8 lines
    case 'lawyer_info':
      return 32; // 4 fields * 8 lines
    case 'supporting_docs':
      return 16; // 2 fields * 8 lines
    case 'safe_details':
      return 16; // 2 fields * 8 lines
    case 'safe_deposit':
      return 24; // 3 fields * 8 lines
    case 'alternate_executors':
      return data.alternateExecutors ? data.alternateExecutors.length * 32 : 0;
    case 'primary_residence':
      return 48; // 6 fields * 8 lines
    case 'additional_properties':
      return data.properties ? data.properties.length * 40 : 0;
    case 'storage_units':
      return data.storageUnits ? data.storageUnits.length * 32 : 0;
    case 'high_value_items':
      return data.highValueItems ? data.highValueItems.length * 24 : 0;
    case 'firearms':
      return data.firearms ? data.firearms.length * 32 : 0;
    case 'business_info':
      return 32; // 4 fields * 8 lines
    case 'bank_accounts':
      return data.bankAccounts ? data.bankAccounts.length * 32 : 0;
    case 'investments':
      return data.investments ? data.investments.length * 32 : 0;
    case 'password_manager':
      return 16; // 2 fields * 8 lines
    case 'two_factor':
      return 16; // 2 fields * 8 lines
    case 'email_providers':
      return data.emailProviders ? data.emailProviders.length * 16 : 0;
    case 'social_media':
      return data.socialMedia ? data.socialMedia.length * 16 : 0;
    case 'emergency_contacts_key':
      return data.emergencyContacts ? data.emergencyContacts.length * 32 : 0;
    case 'key_professionals':
      return data.professionals ? data.professionals.length * 32 : 0;
    case 'service_preferences':
      return 16; // 2 fields * 8 lines
    case 'disposition_preferences':
      return 16; // 2 fields * 8 lines
    case 'clubs_memberships':
      return data.clubs ? data.clubs.length * 16 : 0;
    case 'streaming_subscriptions':
      return data.subscriptions ? data.subscriptions.length * 16 : 0;
    case 'pet_info':
      return data.pets ? data.pets.length * 32 : 0;
    case 'caregiver_info':
      return data.caregivers ? data.caregivers.length * 32 : 0;
    case 'bucket_list':
      return data.bucketList ? data.bucketList.length * 16 : 0;
    case 'unfinished_business':
      return data.unfinishedBusiness ? data.unfinishedBusiness.length * 16 : 0;
    case 'formal_letters':
      return data.letters ? data.letters.length * 40 : 0;
    case 'short_letters':
      return data.letters ? data.letters.length * 24 : 0;
    case 'final_wishes':
      return data.wishes ? data.wishes.length * 24 : 0;
    default:
      return 50; // Default estimate
  }
};

// Helper function to add section header
const addSectionHeader = (doc: jsPDF, title: string, margin: number, y: number, pageNumber?: number): number => {
  // Add spacing before the header unless at top of content area
  if (y > 65) {
    y += 25; // Increased spacing before headers for better visual separation
  }
  // Check if we need a new page
  if (y > 270) {
    doc.addPage();
    y = 65; // Start content well below the logo area - adjusted for much smaller logo
    addLogoToPage(doc, margin, pageNumber);
  }
  doc.setFontSize(18);
  doc.setTextColor(228, 182, 74); // Gold color
  doc.setFont('times', 'normal');
  doc.text(title, margin, y);
  return y + 18; // Increased spacing after header for better visual separation
};

// Helper function to add field with automatic page breaks and section awareness
const addField = (doc: jsPDF, label: string, value: string, margin: number, y: number, contentWidth: number, pageNumber?: number, sectionTitle?: string): number => {
  if (!value || value.trim() === '') return y;
  
  // Ensure proper font settings
  doc.setFontSize(11);
  doc.setTextColor(21, 58, 75); // Dark blue
  doc.setFont('helvetica', 'normal');
  
  // Add label (bold)
  doc.setFont('helvetica', 'bold');
  const labelText = `${label}:`;
  
  // Calculate positioning
  const labelX = margin + 25;
  const valueX = margin + 80;
  const maxWidth = contentWidth - 80;
  
  // Split long text into multiple lines
  const lines = doc.splitTextToSize(value, maxWidth);
  const lineHeight = 5;
  const totalHeight = (lines.length * lineHeight) + 3;
  
  // Check if we need a new page BEFORE adding content
  if (y + totalHeight > 270) {
    doc.addPage();
    y = 65; // Start content higher on continuation pages (no logo)
    // Don't add logo to continuation pages within the same section
    addLogoToPage(doc, margin, pageNumber, { 
      isFirstPageOfSection: false, 
      sectionTitle: sectionTitle || '',
      skipLogo: true 
    });
  }
  
  // Now add the content with proper font settings
  doc.setFontSize(11);
  doc.setTextColor(21, 58, 75); // Dark blue
  
  // Add label
  doc.setFont('helvetica', 'bold');
  doc.text(labelText, labelX, y);
  
  // Add value
  doc.setFont('helvetica', 'normal');
  doc.text(lines, valueX, y);
  
  return y + totalHeight;
};

// Helper function to add list items with section awareness
const addListItems = (doc: jsPDF, items: any[], margin: number, y: number, contentWidth: number, pageNumber?: number, sectionTitle?: string): number => {
  items.forEach((item, index) => {
    if (y > 270) {
      doc.addPage();
      y = 30; // Start content higher on continuation pages (no logo)
      // Don't add logo to continuation pages within the same section
      addLogoToPage(doc, margin, pageNumber, { 
        isFirstPageOfSection: false, 
        sectionTitle: sectionTitle || '',
        skipLogo: true 
      });
    }
    
    // Ensure proper font settings after page break
    doc.setFontSize(11);
    doc.setTextColor(21, 58, 75);
    doc.setFont('helvetica', 'normal');
    
    const itemText = typeof item === 'string' ? item : JSON.stringify(item);
    const lines = doc.splitTextToSize(`• ${itemText}`, contentWidth - 20);
    doc.text(lines, margin + 10, y);
    
    y += (lines.length * 5) + 2;
  });
  
  return y;
};

// Collect all data from all forms
const collectAllData = () => {
  const allData: Record<string, any> = {};
  
  // Personal Information (Section 1)
  allData.personalInfo = getLocalStorageData('personalContactData') || {};
  
  // Medical Information (Section 2)
  allData.medicalInfo = getLocalStorageData('medicalInfoData') || {};
  allData.insuranceInfo = getLocalStorageData('insuranceInfo') || {};
  
  // Legal & Estate Planning (Section 3)
  allData.legalEstate = getLocalStorageData('legalEstateForm') || {};
  
  // Finance & Business (Section 4)
  allData.financeBusiness = getLocalStorageData('financeBusinessInfo') || {};
  
  // Beneficiaries & Inheritance (Section 5)
  allData.beneficiariesInheritance = getLocalStorageData('beneficiariesInheritanceData') || {};
  
  // Personal Property & Real Estate (Section 6)
  allData.personalPropertyRealEstate = getLocalStorageData('personalPropertyRealEstateData') || {};
  
  // Digital Life, Subscriptions, & Passwords (Section 7)
  allData.digitalLife = getLocalStorageData('digitalLifeData') || {};
  allData.digitalAssets = getLocalStorageData('digitalAssetsData') || {};
  
  // Key Contacts (Section 8)
  allData.keyContacts = getLocalStorageData('keyContactsData') || {};
  
  // Funeral & Final Arrangements (Section 9)
  allData.funeralFinalArrangements = getLocalStorageData('funeralFinalArrangementsData') || {};
  allData.funeralPreferences = getLocalStorageData('funeral_preferences') || {};
  
  // Accounts & Memberships (Section 10)
  allData.accountsMemberships = getLocalStorageData('accountsMembershipsData') || {};
  
  // Pets & Animal Care (Section 11)
  allData.petsAnimalCare = getLocalStorageData('petsAnimalCareData') || {};
  allData.petCare = getLocalStorageData('petCareData') || {};
  
  // Short Letters to Loved Ones (Section 12)
  allData.shortLetters = getLocalStorageData('shortLettersData') || {};
  
  // Final Wishes & Legacy Planning (Section 13)
  allData.finalWishes = getLocalStorageData('finalWishesLegacyPlanningData') || {};
  allData.legacyWishes = getLocalStorageData('legacy_wishes') || {};
  
  // Bucket List & Unfinished Business (Section 14)
  allData.bucketList = getLocalStorageData('bucketListUnfinishedBusinessData') || {};
  
  // Formal Letters (Section 15)
  allData.formalLetters = getLocalStorageData('formalLettersData') || {};
  
  // Debug: Log what we found
  console.log('=== Complete PDF Data Collection Debug ===');
  console.log('All collected data:', allData);
  
  // Check which sections have actual data
  const sectionsWithData = [];
  Object.entries(allData).forEach(([key, value]) => {
    if (value && typeof value === 'object' && Object.keys(value).length > 0) {
      sectionsWithData.push(`${key}: ${Object.keys(value).length} fields`);
    }
  });
  console.log('Sections with data:', sectionsWithData);
  
  // Check localStorage for any keys we might have missed
  const allKeys = Object.keys(localStorage);
  const relevantKeys = allKeys.filter(key => 
    key.includes('Data') || 
    key.includes('Form') || 
    key.includes('Info') ||
    key.includes('Preferences') ||
    key.includes('Letters') ||
    key.includes('Wishes') ||
    key.includes('Contacts') ||
    key.includes('Business') ||
    key.includes('Estate') ||
    key.includes('Property') ||
    key.includes('Digital') ||
    key.includes('Funeral') ||
    key.includes('Accounts') ||
    key.includes('Pets') ||
    key.includes('Bucket') ||
    key.includes('Legacy')
  );
  console.log('Relevant localStorage keys found:', relevantKeys);
  
  return allData;
};

// Generate complete legacy planning book with enhanced structure
const generateCompleteBook = (doc: jsPDF, allData: Record<string, any>) => {
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);
  let y = 20;
  let currentPage = 1;
  
  // Debug: Log what data we have
  console.log('PDF Generator - Collected Data:', allData);
  
  // Debug: Check which sections have data
  const sectionsWithData = [];
  if (allData.personalInfo && Object.keys(allData.personalInfo).length > 0) sectionsWithData.push('Personal Information');
  if (allData.medicalInfo && Object.keys(allData.medicalInfo).length > 0) sectionsWithData.push('Medical Information');
  if (allData.legalEstate && Object.keys(allData.legalEstate).length > 0) sectionsWithData.push('Legal & Estate Planning');
  if (allData.financeBusiness && Object.keys(allData.financeBusiness).length > 0) sectionsWithData.push('Finance & Business');
  if (allData.beneficiariesInheritance && Object.keys(allData.beneficiariesInheritance).length > 0) sectionsWithData.push('Beneficiaries & Inheritance');
  if (allData.personalPropertyRealEstate && Object.keys(allData.personalPropertyRealEstate).length > 0) sectionsWithData.push('Personal Property & Real Estate');
  if (allData.digitalLife && Object.keys(allData.digitalLife).length > 0) sectionsWithData.push('Digital Life, Subscriptions, & Passwords');
  if (allData.keyContacts && Object.keys(allData.keyContacts).length > 0) sectionsWithData.push('Key Contacts');
  if (allData.funeralFinalArrangements && Object.keys(allData.funeralFinalArrangements).length > 0) sectionsWithData.push('Funeral & Final Arrangements');
  if (allData.accountsMemberships && Object.keys(allData.accountsMemberships).length > 0) sectionsWithData.push('Accounts & Memberships');
  if (allData.petsAnimalCare && Object.keys(allData.petsAnimalCare).length > 0) sectionsWithData.push('Pets & Animal Care');
  if (allData.shortLetters && Object.keys(allData.shortLetters).length > 0) sectionsWithData.push('Short Letters to Loved Ones');
  if (allData.finalWishes && Object.keys(allData.finalWishes).length > 0) sectionsWithData.push('Final Wishes & Legacy Planning');
  if (allData.bucketList && Object.keys(allData.bucketList).length > 0) sectionsWithData.push('Bucket List & Unfinished Business');
  if (allData.formalLetters && Object.keys(allData.formalLetters).length > 0) sectionsWithData.push('Formal Letters');
  
  console.log('Sections with data:', sectionsWithData);
  
  // Extract user name for personalization
  const personalInfo = allData.personalInfo || {};
  const userName = personalInfo.firstName && personalInfo.lastName 
    ? `${personalInfo.firstName} ${personalInfo.lastName}` 
    : '';
  
  // Professional Title Page
  createTitlePage(doc, margin, userName);
  
  // Table of Contents Page
  doc.addPage();
  currentPage++;
  y = addPageHeader(doc, 'Table of Contents', margin, currentPage, true);
  
  const sections = [
    'Personal Information',
    'Medical Information',
    'Legal & Estate Planning',
    'Finance & Business',
    'Beneficiaries & Inheritance',
    'Personal Property & Real Estate',
    'Digital Life, Subscriptions, & Passwords',
    'Key Contacts',
    'Funeral & Final Arrangements',
    'Accounts & Memberships',
    'Pets & Animal Care',
    'Short Letters to Loved Ones',
    'Final Wishes & Legacy Planning',
    'Bucket List & Unfinished Business',
    'Formal Letters'
  ];
  
  sections.forEach((section, index) => {
    doc.setFontSize(12);
    doc.setTextColor(21, 58, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(`${index + 1}. ${section}`, margin, y);
    y += 8;
  });
  
  // Personal Information Section with Title Page
  doc.addPage();
  createSectionTitlePage(doc, 'Personal Information', margin);
  
  doc.addPage();
  currentPage++;
  y = addPageHeader(doc, 'Personal Information', margin, currentPage, true);
  const currentSectionTitle = 'Personal Information';
  
  // Basic Information
  if (personalInfo.firstName || personalInfo.dob) {
    const estimatedSpace = estimateSubsectionSpace(personalInfo, 'legal_biographical');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = addPageHeader(doc, currentSectionTitle, margin, undefined, false);
    }
    
    y = addSectionHeader(doc, 'Basic Information', margin, y);
    y = addField(doc, 'First Name', personalInfo.firstName || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Middle Name', personalInfo.middleName || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Last Name', personalInfo.lastName || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Nickname', personalInfo.nickname || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Date of Birth', personalInfo.dob || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Gender', personalInfo.gender || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Preferred Pronouns', personalInfo.pronouns || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Country of Birth', personalInfo.countryOfBirth || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Province/State of Birth', personalInfo.provinceOfBirth || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'City of Birth', personalInfo.cityOfBirth || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Citizenship(s)', personalInfo.citizenships || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Primary Language', personalInfo.primaryLanguage || '', margin, y, contentWidth, undefined, currentSectionTitle);
    y = addField(doc, 'Secondary Language', personalInfo.secondaryLanguage || '', margin, y, contentWidth, undefined, currentSectionTitle);
  }
  
  // Medical Information Section with Title Page
  if (allData.medicalInfo && Object.keys(allData.medicalInfo).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Medical Information', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Medical Information', margin, undefined, true);
    
    const medicalInfo = allData.medicalInfo || {};
    const insuranceInfo = allData.insuranceInfo || {};
    
    // Add medical content with section awareness
    y = addMedicalInfoContent(doc, medicalInfo, margin, y, contentWidth);
  }
  
  // Continue pattern for all other sections...
  // Each section gets: Section Title Page → Content Pages (with optimized logo placement)
  
  // Legal & Estate Planning Section
  if (allData.legalEstate && Object.keys(allData.legalEstate).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Legal & Estate Planning', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Legal & Estate Planning', margin, undefined, true);
    y = addLegalInfoContent(doc, allData.legalEstate, margin, y, contentWidth);
  }
  
  // Finance & Business Section
  if (allData.financeBusiness && Object.keys(allData.financeBusiness).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Finance & Business', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Finance & Business', margin, undefined, true);
    y = addFinanceContent(doc, allData.financeBusiness, margin, y, contentWidth);
  }
  
  // Beneficiaries & Inheritance Section
  if (allData.beneficiariesInheritance && Object.keys(allData.beneficiariesInheritance).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Beneficiaries & Inheritance', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Beneficiaries & Inheritance', margin, undefined, true);
    y = addBeneficiariesContent(doc, allData.beneficiariesInheritance, margin, y, contentWidth);
  }
  
  // Personal Property & Real Estate Section
  if (allData.personalPropertyRealEstate && Object.keys(allData.personalPropertyRealEstate).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Personal Property & Real Estate', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Personal Property & Real Estate', margin, undefined, true);
    y = addPersonalPropertyContent(doc, allData.personalPropertyRealEstate, margin, y, contentWidth);
  }
  
  // Digital Life Section
  if (allData.digitalLife && Object.keys(allData.digitalLife).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Digital Life, Subscriptions, & Passwords', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Digital Life, Subscriptions, & Passwords', margin, undefined, true);
    y = addDigitalLifeContent(doc, allData.digitalLife, margin, y, contentWidth);
  }
  
  // Key Contacts Section
  if (allData.keyContacts && Object.keys(allData.keyContacts).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Key Contacts', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Key Contacts', margin, undefined, true);
    y = addKeyContactsContent(doc, allData.keyContacts, margin, y, contentWidth);
  }
  
  // Funeral & Final Arrangements Section
      if (allData.funeralFinalArrangements && Object.keys(allData.funeralFinalArrangements).length > 0) {
      doc.addPage();
              createSectionTitlePage(doc, 'Funeral & Final Arrangements', margin);
      
      doc.addPage();
    y = addPageHeader(doc, 'Funeral & Final Arrangements', margin, undefined, true);
    y = addFuneralContent(doc, allData.funeralFinalArrangements, margin, y, contentWidth);
  }
  
  // Accounts & Memberships Section
      if (allData.accountsMemberships && Object.keys(allData.accountsMemberships).length > 0) {
      doc.addPage();
              createSectionTitlePage(doc, 'Accounts & Memberships', margin);
      
      doc.addPage();
    y = addPageHeader(doc, 'Accounts & Memberships', margin, undefined, true);
    y = addAccountsContent(doc, allData.accountsMemberships, margin, y, contentWidth);
  }
  
  // Pets & Animal Care Section
  if (allData.petsAnimalCare && Object.keys(allData.petsAnimalCare).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Pets & Animal Care', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Pets & Animal Care', margin, undefined, true);
    y = addPetsContent(doc, allData.petsAnimalCare, margin, y, contentWidth);
  }
  
  // Short Letters Section
  if (allData.shortLetters && Object.keys(allData.shortLetters).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Short Letters to Loved Ones', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Short Letters to Loved Ones', margin, undefined, true);
    y = addShortLettersContent(doc, allData.shortLetters, margin, y, contentWidth);
  }
  
  // Final Wishes Section
  if (allData.finalWishes && Object.keys(allData.finalWishes).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Final Wishes & Legacy Planning', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Final Wishes & Legacy Planning', margin, undefined, true);
    y = addFinalWishesContent(doc, allData.finalWishes, margin, y, contentWidth);
  }
  
  // Bucket List Section
  if (allData.bucketList && Object.keys(allData.bucketList).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Bucket List & Unfinished Business', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Bucket List & Unfinished Business', margin, undefined, true);
    y = addBucketListContent(doc, allData.bucketList, margin, y, contentWidth);
  }
  
  // Formal Letters Section
  if (allData.formalLetters && Object.keys(allData.formalLetters).length > 0) {
    doc.addPage();
    createSectionTitlePage(doc, 'Formal Letters', margin);
    
    doc.addPage();
    y = addPageHeader(doc, 'Formal Letters', margin, undefined, true);
    y = addFormalLettersContent(doc, allData.formalLetters, margin, y, contentWidth);
  }
  
  // Final Thank You Page
  doc.addPage();
  y = 50;
  
  doc.setFontSize(18);
  doc.setTextColor(228, 182, 74);
  doc.setFont('times', 'normal');
  doc.text('Thank You', margin, y);
  
  y += 20;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  const thankYouText = [
    'This document represents your thoughtful planning and care for your loved ones.',
    'It contains the information, wishes, and messages that will guide them through',
    'difficult times and help them honor your memory.',
    '',
    'Remember to review and update this information regularly as circumstances change.',
    'Your legacy planning is a gift of love that will continue to give for generations.'
  ];
  
  thankYouText.forEach(line => {
    doc.text(line, margin, y);
    y += 8;
  });
};

export const generatePDF = async (pdfData: PDFData) => {
  try {
    console.log('Starting PDF generation with data:', pdfData);
    const doc = new jsPDF('p', 'mm', 'a4');
    console.log('jsPDF instance created successfully');

    // Determine if watermark should be added based on user tier
    // Only Trial and Lite users get watermarks, Standard users get no watermark
    const shouldAddWatermark = pdfData.userTier === 'Trial' || pdfData.userTier === 'Lite';

    if (pdfData.formType === 'complete') {
      // Generate complete legacy planning book
      const allData = collectAllData();
      generateCompleteBook(doc, allData);
    } else {
      // Generate single section PDF (existing functionality)
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // Add logo and header
      addLogoToPage(doc, margin);
      
      // Add watermark BEHIND the content (before any text is added)
      addWatermark(doc, shouldAddWatermark, pdfData.isTrial);
      
      // Add section title with proper spacing from logo
      doc.setFontSize(20);
      doc.setTextColor(228, 182, 74);
      doc.setFont('helvetica', 'bold');
      // Calculate center position for the page
      const centerX = pageWidth / 2;
      doc.text(pdfData.sectionTitle, centerX, 55, { align: 'center' }); // Adjusted for much smaller logo
      // Add content based on form type
      let yPosition = 65; // Adjusted for much smaller logo
      switch (pdfData.formType) {
        case 'personal':
          if (pdfData.sectionTitle === 'Formal Letters') {
            yPosition = addFormalLettersContent(doc, pdfData.data, margin, yPosition, contentWidth);
          } else if (pdfData.sectionTitle === 'Personal Property & Real Estate') {
            yPosition = addPersonalPropertyContent(doc, pdfData.data, margin, yPosition, contentWidth);
          } else {
            yPosition = await addPersonalInfoContent(doc, pdfData.data, margin, yPosition, contentWidth);
          }
          break;
        case 'medical':
          yPosition = addMedicalInfoContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'legal':
          yPosition = addLegalInfoContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'finance':
          yPosition = addFinanceContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'beneficiaries':
          yPosition = addBeneficiariesContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'personalProperty':
          yPosition = addPersonalPropertyContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'digitalLife':
          yPosition = addDigitalLifeContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'keyContacts':
          yPosition = addKeyContactsContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'funeral':
          yPosition = addFuneralContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'accounts':
          yPosition = addAccountsContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'pets':
          yPosition = addPetsContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'shortLetters':
          yPosition = addShortLettersContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'finalWishes':
          yPosition = addFinalWishesContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'bucketList':
          yPosition = addBucketListContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'formalLetters':
          yPosition = addFormalLettersContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'fileUploads':
          yPosition = await addFileUploadsContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        case 'idDocuments':
          yPosition = await addIdDocumentsContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
        default:
          // Fallback for any forms that still use 'personal' type
          yPosition = addGenericContent(doc, pdfData.data, margin, yPosition, contentWidth);
          break;
      }
    }

    // --- Add footer and page number to every page ---
    const pageCount = doc.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
      doc.setPage(i + 1);
      addFooter(doc, pdfData.userInfo);
      addPageNumber(doc, i);
    }
    // --- End footer/page number loop ---

    // Save the PDF
    const filename = pdfData.formType === 'complete' 
      ? `Complete_Legacy_Planning_Document_${new Date().toISOString().split('T')[0]}.pdf`
      : `${pdfData.sectionTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Saving PDF with filename:', filename);
    doc.save(filename);
    console.log('PDF saved successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Debug function to check what data is available
export const debugLocalStorageData = () => {
  console.log('=== DEBUG: LocalStorage Data ===');
  
  const keys = [
    'legalBiographicalData',
    'personalContactData', 
    'emergencyContacts',
    'passportCitizenshipData',
    'insuranceInfo',
    'funeral_preferences',
    'funeralFinalArrangementsData',
    'legalDocumentsForm',
    'legalEstateForm',
    'keyDocumentsForm',
    'financeBusinessInfo',
    'financeBusinessData',
    'beneficiariesInheritanceData',
    'personalPropertyRealEstateData',
    'digitalAssetsData',
    'digitalLifeData',
    'accountsMembershipsData',
    'petCareData',
    'petsAnimalCareData',
    'survivorNotesData',
    'personal_messages',
    'shortLettersData',
    'final_letters',
    'final_message',
    'finalWishesLegacyPlanningData',
    'legacy_wishes',
    'bucketListUnfinishedBusinessData',
    'formalLettersData',
    'transition_notes',
    'keyContactsData',
    'children_dependents',
    'final_checklist'
  ];
  
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`${key}:`, parsed);
      } catch (e) {
        console.log(`${key}: [Parse Error]`, data);
      }
    } else {
      console.log(`${key}: [Not Found]`);
    }
  });
  
  console.log('=== END DEBUG ===');
};

// Add ID Documents content
const addIdDocumentsContent = async (doc: jsPDF, idDocuments: any, margin: number, y: number, contentWidth: number): Promise<number> => {
  if (!idDocuments || Object.keys(idDocuments).length === 0) {
    return y;
  }

  // Check if we need a new page
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }

  y = addSectionHeader(doc, 'ID Document Uploads', margin, y);

  const documentTypes = [
    { key: 'nationalId', label: 'National ID Documents' },
    { key: 'passport', label: 'Passport Documents' },
    { key: 'driverLicense', label: 'Driver\'s License Documents' },
    { key: 'greenCard', label: 'Green Card & Immigration Documents' },
    { key: 'immigrationDoc', label: 'Other Immigration Documents' }
  ];

  for (const docType of documentTypes) {
    const documents = idDocuments[docType.key];
    if (documents && documents.files && documents.files.length > 0) {
      // Check if we need a new page
      if (!hasEnoughSpace(y, 150)) {
        doc.addPage();
        y = 65;
        addLogoToPage(doc, margin);
      }

      // Add subsection header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 51, 51);
      doc.text(docType.label, margin, y);
      y += 20;

      // Add files with QR codes
      for (let i = 0; i < documents.files.length; i++) {
        const file = documents.files[i];
        const fileUrl = documents.fileUrls?.[i] || `file://${file.name}`; // Fallback URL

        // Check if we need a new page
        if (!hasEnoughSpace(y, 120)) {
          doc.addPage();
          y = 65;
          addLogoToPage(doc, margin);
        }

        // File info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(51, 51, 51);
        
        const fileName = file.name;
        const fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
        const fileType = file.type || 'Unknown';
        
        doc.text(`File: ${fileName}`, margin, y);
        y += 12;
        doc.text(`Size: ${fileSize} | Type: ${fileType}`, margin, y);
        y += 12;

        // Generate and add QR code
        try {
          const qrCodeDataUrl = await generateQRCodeForFile(fileUrl);
          if (qrCodeDataUrl) {
            const qrCodeSize = 60;
            const qrCodeX = margin + contentWidth - qrCodeSize - 10;
            const qrCodeY = y - 24; // Position above the file info
            
            doc.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
            
            // Add QR code label
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text('Scan to view document', qrCodeX, qrCodeY + qrCodeSize + 5);
          }
        } catch (error) {
          console.error('Error adding QR code for file:', file.name, error);
        }

        y += 40; // Space after each file
      }

      y += 10; // Space after each document type
    }
  }

  return y;
};

// Keep existing helper functions for backward compatibility
const addPersonalInfoContent = async (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number, pageNumber?: number): Promise<number> => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Legal & Biographical Information
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Legal & Biographical Information', margin, y);
  if (data.firstName || data.lastName || data.dob || data.gender || data.pronouns || data.countryOfBirth || data.provinceOfBirth || data.cityOfBirth || data.citizenships || data.primaryLanguage || data.secondaryLanguage) {
    if (data.firstName || data.lastName) {
      y = addField(doc, 'Full Name', `${data.firstName || ''} ${data.middleName || ''} ${data.lastName || ''}`.trim(), margin, y, contentWidth);
    }
    if (data.nickname) {
      y = addField(doc, 'Nickname', data.nickname, margin, y, contentWidth);
    }
    if (data.dob) {
      y = addField(doc, 'Date of Birth', data.dob, margin, y, contentWidth);
    }
    if (data.gender) {
      y = addField(doc, 'Gender', data.gender, margin, y, contentWidth);
    }
    if (data.pronouns) {
      y = addField(doc, 'Pronouns', data.pronouns, margin, y, contentWidth);
    }
    if (data.countryOfBirth) {
      y = addField(doc, 'Country of Birth', data.countryOfBirth, margin, y, contentWidth);
    }
    if (data.provinceOfBirth) {
      y = addField(doc, 'Province/State of Birth', data.provinceOfBirth, margin, y, contentWidth);
    }
    if (data.cityOfBirth) {
      y = addField(doc, 'City of Birth', data.cityOfBirth, margin, y, contentWidth);
    }
    if (data.citizenships) {
      y = addField(doc, 'Citizenships', data.citizenships, margin, y, contentWidth);
    }
    if (data.primaryLanguage) {
      y = addField(doc, 'Primary Language', data.primaryLanguage, margin, y, contentWidth);
    }
    if (data.secondaryLanguage) {
      y = addField(doc, 'Secondary Language', data.secondaryLanguage, margin, y, contentWidth);
    }
  } else {
    y = addNoInformationText(doc, margin, y, contentWidth);
  }
  y += 16; // Add spacing after subsection
  
  // Government ID Information
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Government ID Information', margin, y);
  
  // Handle Social Security Number / SIN / National ID
  if (data.ssn || data.socialSecurityNumber || data.sinSsn) {
    const ssnValue = data.ssn || data.socialSecurityNumber || data.sinSsn;
    const userCountry = data.countryOfBirth || data.countryOfCitizenship || 'United States';
    // Import the country identification function
    const countryIdentification = await import('./countryIdentification');
    const idLabel = countryIdentification.getIdentificationLabel(userCountry);
    y = addField(doc, idLabel, ssnValue, margin, y, contentWidth);
  }
  
  // Handle national IDs array (if exists)
  if (data.nationalIds && data.nationalIds.length > 0) {
    data.nationalIds.forEach((nationalId: any, index: number) => {
      if (nationalId.country && nationalId.type && nationalId.number) {
        y = addField(doc, `${nationalId.country} - ${nationalId.type}`, nationalId.number, margin, y, contentWidth);
      }
    });
  }
  
  // Handle government ID fields from biographical data
  if (data.govIdType && data.govIdNumber) {
    const govIdLabel = data.govIdType.charAt(0).toUpperCase() + data.govIdType.slice(1).replace(/_/g, ' ');
    y = addField(doc, govIdLabel, data.govIdNumber, margin, y, contentWidth);
    if (data.govIdIssuer) {
      y = addField(doc, 'Issuing Authority', data.govIdIssuer, margin, y, contentWidth);
    }
    if (data.govIdExpiry) {
      y = addField(doc, 'Expiry Date', data.govIdExpiry, margin, y, contentWidth);
    }
  }
  
  if (data.passports && data.passports.length > 0) {
    data.passports.forEach((passport: any, index: number) => {
      if (passport.country && passport.number) {
        const passportInfo = `${passport.country} Passport`;
        const passportDetails = passport.expiry ? `${passport.number} (Expires: ${passport.expiry})` : passport.number;
        y = addField(doc, passportInfo, passportDetails, margin, y, contentWidth);
      }
    });
  }
  if (data.license || data.licenseExpiry || data.licenseProvince || data.driversLicenseNumber) {
    const licenseNumber = data.license || data.driversLicenseNumber;
    if (licenseNumber) {
      y = addField(doc, 'Driver\'s License Number', licenseNumber, margin, y, contentWidth);
    }
    if (data.licenseExpiry) {
      y = addField(doc, 'License Expiry Date', data.licenseExpiry, margin, y, contentWidth);
    }
    if (data.licenseProvince) {
      y = addField(doc, 'License Issuing Province/State', data.licenseProvince, margin, y, contentWidth);
    }
  }
  if (!data.ssn && !data.socialSecurityNumber && !data.sinSsn && !data.nationalIds?.length && !data.passports?.length && !data.license && !data.driversLicenseNumber && !data.govIdType) {
    y = addNoInformationText(doc, margin, y, contentWidth);
  }
  y += 16; // Add spacing after subsection
  
  // Phone Numbers
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Phone Numbers', margin, y);
  if (data.phones && data.phones.length > 0) {
    data.phones.forEach((phone: any, index: number) => {
      // Check if individual phone field would break across pages
      if (y + 16 > 270) {
        doc.addPage();
        y = 65;
        addLogoToPage(doc, margin);
      }
      y = addField(doc, `${phone.type || 'Phone'} ${index + 1}`, phone.number || '', margin, y, contentWidth);
    });
  } else {
    y = addNoInformationText(doc, margin, y, contentWidth);
  }
  y += 16; // Add spacing after subsection
  
  // Address History
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Address History', margin, y);
  if (data.addresses && data.addresses.length > 0) {
    data.addresses.forEach((address: any, index: number) => {
      if (address.street || address.city) {
        const addressText = `${address.type || 'Address'} ${index + 1}: ${address.street || ''}, ${address.city || ''}, ${address.province || ''} ${address.postal || ''}, ${address.country || ''}`;
        y = addField(doc, `Address ${index + 1}`, addressText, margin, y, contentWidth);
        if (address.start) {
          y = addField(doc, `  Start Date`, address.start, margin, y, contentWidth);
        }
        if (address.end) {
          y = addField(doc, `  End Date`, address.end, margin, y, contentWidth);
        }
      }
    });
  } else {
    y = addNoInformationText(doc, margin, y, contentWidth);
  }
  
  // Emergency Contacts
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Emergency Contacts', margin, y);
  if (data.contacts && data.contacts.length > 0) {
    data.contacts.forEach((contact: any, index: number) => {
      if (contact.name || contact.phone) {
        y = addField(doc, `Contact ${index + 1} - Name`, contact.name || '', margin, y, contentWidth);
        y = addField(doc, `  Relationship`, contact.relationship || '', margin, y, contentWidth);
        y = addField(doc, `  Phone`, contact.phone || '', margin, y, contentWidth);
        y = addField(doc, `  Email`, contact.email || '', margin, y, contentWidth);
        y = addField(doc, `  Authorized for Decisions`, contact.authorized || '', margin, y, contentWidth);
        y = addField(doc, `  Emergency Contact`, contact.emergency || '', margin, y, contentWidth);
      }
    });
  } else {
    y = addNoInformationText(doc, margin, y, contentWidth);
  }
  y += 16; // Add spacing after subsection
  
  // Family Information
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Family Information', margin, y);
  if (data.fatherName || data.motherName || data.stepfatherName || data.stepmotherName) {
    if (data.fatherName) {
      y = addField(doc, 'Father\'s Name', data.fatherName, margin, y, contentWidth);
    }
    if (data.motherName) {
      y = addField(doc, 'Mother\'s Name', data.motherName, margin, y, contentWidth);
    }
    if (data.stepfatherName) {
      y = addField(doc, 'Stepfather\'s Name', data.stepfatherName, margin, y, contentWidth);
    }
    if (data.stepmotherName) {
      y = addField(doc, 'Stepmother\'s Name', data.stepmotherName, margin, y, contentWidth);
    }
  } else {
    y = addNoInformationText(doc, margin, y, contentWidth);
  }
  y += 16; // Add spacing after subsection
  
  // Relationship Status
  if (data.relationshipStatus || data.spouseName || data.spouseContact) {
    // Estimate space needed for this section (approximately 3 fields * 8 lines each = 24)
    if (!hasEnoughSpace(y, 24)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Relationship Status', margin, y);
    if (data.relationshipStatus) {
      y = addField(doc, 'Status', data.relationshipStatus, margin, y, contentWidth);
    }
    if (data.spouseName) {
      y = addField(doc, 'Partner/Spouse Name', data.spouseName, margin, y, contentWidth);
    }
    if (data.spouseContact) {
      y = addField(doc, 'Partner/Spouse Contact', data.spouseContact, margin, y, contentWidth);
    }
    y += 16; // Add spacing after subsection
  }
  
  // Children/Dependents
  if (data.children && data.children.length > 0) {
    // Estimate space needed for this section (approximately 2 children * 3 fields each * 8 lines = 48)
    const estimatedSpace = data.children.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Children/Dependents', margin, y);
    data.children.forEach((child: any, index: number) => {
      if (child.name) {
        y = addField(doc, `Child ${index + 1} - Name`, child.name || '', margin, y, contentWidth);
        y = addField(doc, `  Gender`, child.gender || '', margin, y, contentWidth);
        y = addField(doc, `  Age`, child.age || '', margin, y, contentWidth);
      }
    });
    y += 16; // Add spacing after subsection
  }
  
  // Religious & Spiritual Preferences
  if (data.religiousAffiliation || data.placeOfWorship || data.clergyName) {
    // Estimate space needed for this section (approximately 10 fields * 8 lines each = 80)
    if (!hasEnoughSpace(y, 80)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Religious & Spiritual Preferences', margin, y);
    if (data.religiousAffiliation) {
      y = addField(doc, 'Religious Affiliation', data.religiousAffiliation, margin, y, contentWidth);
    }
    if (data.placeOfWorship) {
      y = addField(doc, 'Place of Worship', data.placeOfWorship, margin, y, contentWidth);
    }
    if (data.clergyName) {
      y = addField(doc, 'Clergy Name', data.clergyName, margin, y, contentWidth);
    }
    if (data.clergyPhone) {
      y = addField(doc, 'Clergy Phone', data.clergyPhone, margin, y, contentWidth);
    }
    if (data.clergyEmail) {
      y = addField(doc, 'Clergy Email', data.clergyEmail, margin, y, contentWidth);
    }
    if (data.lastRites) {
      y = addField(doc, 'Last Rites Preferred', data.lastRites ? 'Yes' : 'No', margin, y, contentWidth);
    }
    if (data.clergyPresent) {
      y = addField(doc, 'Clergy Present Preferred', data.clergyPresent ? 'Yes' : 'No', margin, y, contentWidth);
    }
    if (data.scripturePreferences) {
      y = addField(doc, 'Scripture Preferences', data.scripturePreferences, margin, y, contentWidth);
    }
    if (data.prayerStyle) {
      y = addField(doc, 'Prayer Style', data.prayerStyle, margin, y, contentWidth);
    }
    if (data.burialRituals) {
      y = addField(doc, 'Burial Rituals', data.burialRituals, margin, y, contentWidth);
    }
    y += 16; // Add spacing after subsection
  }
  
  // Work & Career Information
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Work & Career Information', margin, y);
  if (data.employmentStatus || data.occupation || data.employer) {
    if (data.employmentStatus) {
      y = addField(doc, 'Employment Status', data.employmentStatus, margin, y, contentWidth);
    }
    if (data.occupation) {
      y = addField(doc, 'Current Occupation', data.occupation, margin, y, contentWidth);
    }
    if (data.employer) {
      y = addField(doc, 'Employer Name', data.employer, margin, y, contentWidth);
    }
    if (data.employerAddress) {
      y = addField(doc, 'Employer Address', data.employerAddress, margin, y, contentWidth);
    }
    if (data.workPhone) {
      y = addField(doc, 'Work Phone', data.workPhone, margin, y, contentWidth);
    }
    if (data.supervisorName) {
      y = addField(doc, 'Supervisor/Contact', data.supervisorName, margin, y, contentWidth);
    }
    if (data.workNotes) {
      y = addField(doc, 'Work Notes', data.workNotes, margin, y, contentWidth);
    }
  }
  y += 16; // Add spacing after subsection
  
  // Security & Digital Access
  if (data.willLocation || data.unlockCode || data.passwordManager) {
    // Estimate space needed for this section (approximately 6 fields * 8 lines each = 48)
    if (!hasEnoughSpace(y, 48)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Security & Digital Access', margin, y);
    if (data.willLocation) {
      y = addField(doc, 'Will Location', data.willLocation, margin, y, contentWidth);
    }
    if (data.unlockCode) {
      y = addField(doc, 'Phone Unlock Code', data.unlockCode, margin, y, contentWidth);
    }
    if (data.passwordManager) {
      y = addField(doc, 'Password Manager Info', data.passwordManager, margin, y, contentWidth);
    }
    if (data.backupCodeStorage) {
      y = addField(doc, 'Backup Code Storage', data.backupCodeStorage, margin, y, contentWidth);
    }
    if (data.keyAccounts) {
      y = addField(doc, 'Key Online Accounts', data.keyAccounts, margin, y, contentWidth);
    }
    if (data.digitalDocsLocation) {
      y = addField(doc, 'Digital Docs Location', data.digitalDocsLocation, margin, y, contentWidth);
    }
  }
  
  // Critical Documents & Key Locations
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Critical Documents & Key Locations', margin, y);
  if (data.criticalDocs && data.criticalDocs.length > 0) {
    data.criticalDocs.forEach((docName: string) => {
      const location = data.criticalDocLocations && data.criticalDocLocations[docName] ? data.criticalDocLocations[docName] : 'Location not specified';
      y = addField(doc, docName, location, margin, y, contentWidth);
    });
  }
  
  // Education History
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Education History', margin, y);
  if (data.schools && data.schools.length > 0) {
    data.schools.forEach((school: any, index: number) => {
      // Estimate space needed for a school (5 fields * 8 = 40)
      if (!hasEnoughSpace(y, 40)) {
        doc.addPage();
        y = 65;
        addLogoToPage(doc, margin);
      }
      if (school.name) {
        y = addField(doc, `School ${index + 1} - Name`, school.name || '', margin, y, contentWidth);
        y = addField(doc, 'Degree/Program', school.degree || '', margin, y, contentWidth);
        y = addField(doc, 'Location', school.location || '', margin, y, contentWidth);
        y = addField(doc, 'Start Date', school.start || '', margin, y, contentWidth);
        y = addField(doc, 'End Date', school.end || '', margin, y, contentWidth);
      }
    });
  }
  
  // Additional Notes
  if (data.additionalNotes) {
    // Estimate space needed for this section (approximately 1 field * 8 lines each = 8)
    if (!hasEnoughSpace(y, 8)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Additional Notes', margin, y);
    y = addField(doc, 'Notes', data.additionalNotes, margin, y, contentWidth);
  }
  
  return y;
};

const addMedicalInfoContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Physician Information
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Physician Information', margin, y);
  if (data.physicians && data.physicians.length > 0) {
    data.physicians.forEach((doctor: any, index: number) => {
      if (doctor.fullName || doctor.specialty || doctor.clinic) {
        y = addField(doc, `Doctor ${index + 1} - Name`, doctor.fullName || '', margin, y, contentWidth);
        y = addField(doc, 'Specialty', doctor.specialty || '', margin, y, contentWidth);
        y = addField(doc, 'Clinic/Hospital', doctor.clinic || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', doctor.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', doctor.email || '', margin, y, contentWidth);
        y = addField(doc, 'Emergency Contact', doctor.emergencyContact || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Medical History
  if (data.chronicIllnesses || data.surgeries || data.hospitalizations) {
    // Estimate space needed for medical history sections
    const estimatedSpace = 100; // Conservative estimate
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Medical History', margin, y);
    
    // Chronic Illnesses/Diagnoses
    if (data.chronicIllnesses && data.chronicIllnesses.length > 0) {
      y = addSectionHeader(doc, 'Chronic Illnesses/Diagnoses', margin, y);
      data.chronicIllnesses.forEach((illness: any, index: number) => {
        if (illness.condition) {
          y = addField(doc, `Condition ${index + 1}`, illness.condition, margin, y, contentWidth);
          y = addField(doc, 'Diagnosis Date', illness.diagnosisDate || '', margin, y, contentWidth);
          y = addField(doc, 'Treatment', illness.treatment || '', margin, y, contentWidth);
          y += 5;
        }
      });
    }
    
    // Surgeries
    if (data.surgeries && data.surgeries.length > 0) {
      y = addSectionHeader(doc, 'Surgeries', margin, y);
      data.surgeries.forEach((surgery: any, index: number) => {
        if (surgery.procedure) {
          y = addField(doc, `Surgery ${index + 1} - Procedure`, surgery.procedure, margin, y, contentWidth);
          y = addField(doc, 'Date', surgery.date || '', margin, y, contentWidth);
          y = addField(doc, 'Hospital/Clinic', surgery.hospital || '', margin, y, contentWidth);
          y = addField(doc, 'Surgeon', surgery.surgeon || '', margin, y, contentWidth);
          y += 5;
        }
      });
    }
    
    // Hospitalizations
    if (data.hospitalizations && data.hospitalizations.length > 0) {
      y = addSectionHeader(doc, 'Hospitalizations', margin, y);
      data.hospitalizations.forEach((hospitalization: any, index: number) => {
        if (hospitalization.reason) {
          y = addField(doc, `Hospitalization ${index + 1} - Reason`, hospitalization.reason, margin, y, contentWidth);
          y = addField(doc, 'Date', hospitalization.date || '', margin, y, contentWidth);
          y = addField(doc, 'Hospital', hospitalization.hospital || '', margin, y, contentWidth);
          y = addField(doc, 'Duration', hospitalization.duration || '', margin, y, contentWidth);
          y += 5;
        }
      });
    }
  }
  
  // Health Insurance & ID
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Health Insurance & ID', margin, y);
  if (data.insuranceNotes) {
    y = addField(doc, 'Insurance Notes', data.insuranceNotes, margin, y, contentWidth);
  }
  
  // Medications
  if (data.medications && data.medications.length > 0) {
    // Estimate space needed for this section (approximately 3 medications * 4 fields each * 8 lines = 96)
    const estimatedSpace = data.medications.length * 32;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Medications', margin, y);
    data.medications.forEach((med: any, index: number) => {
      if (med.name || med.dosage || med.frequency) {
        y = addField(doc, `Medication ${index + 1} - Name`, med.name || '', margin, y, contentWidth);
        y = addField(doc, 'Dosage', med.dosage || '', margin, y, contentWidth);
        y = addField(doc, 'Frequency', med.frequency || '', margin, y, contentWidth);
        y = addField(doc, 'Reason', med.reason || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  if (data.supplements) {
    y = addField(doc, 'Supplements/OTC', data.supplements, margin, y, contentWidth);
  }
  
  // Pharmacy Info
  if (data.pharmacyName || data.pharmacyPhone) {
    // Estimate space needed for this section
    const estimatedSpace = estimateSubsectionSpace(data, 'pharmacy_info');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Pharmacy Info', margin, y);
    y = addField(doc, 'Pharmacy Name & Location', data.pharmacyName || '', margin, y, contentWidth);
    y = addField(doc, 'Pharmacy Phone', data.pharmacyPhone || '', margin, y, contentWidth);
  }
  
  // Allergies & Reactions
  if (data.allergies || data.reactions) {
    // Estimate space needed for this section
    const estimatedSpace = estimateSubsectionSpace(data, 'allergies_reactions');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Allergies & Reactions', margin, y);
    y = addField(doc, 'Known Allergies', data.allergies || '', margin, y, contentWidth);
    y = addField(doc, 'Reactions and Treatments', data.reactions || '', margin, y, contentWidth);
  }
  
  // Medical History - Updated for Add Format
  if ((data.chronicIllnesses && data.chronicIllnesses.length > 0) || 
      (data.surgeries && data.surgeries.length > 0) || 
      (data.hospitalizations && data.hospitalizations.length > 0)) {
    
    // Calculate total space needed for all medical history sections
    const chronicIllnessesSpace = data.chronicIllnesses ? data.chronicIllnesses.length * 24 : 0;
    const surgeriesSpace = data.surgeries ? data.surgeries.length * 32 : 0;
    const hospitalizationsSpace = data.hospitalizations ? data.hospitalizations.length * 32 : 0;
    const totalSpace = chronicIllnessesSpace + surgeriesSpace + hospitalizationsSpace + 50; // Extra space for headers
    
    if (!hasEnoughSpace(y, totalSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Medical History', margin, y);
    
    // Chronic Illnesses/Diagnoses
    if (data.chronicIllnesses && data.chronicIllnesses.length > 0) {
      y = addSectionHeader(doc, 'Chronic Illnesses/Diagnoses', margin, y);
      data.chronicIllnesses.forEach((illness: any, index: number) => {
        if (illness.condition) {
          y = addField(doc, `Condition ${index + 1}`, illness.condition, margin, y, contentWidth);
          if (illness.diagnosedDate) {
            y = addField(doc, 'Date Diagnosed', illness.diagnosedDate, margin, y, contentWidth);
          }
          if (illness.notes) {
            y = addField(doc, 'Notes', illness.notes, margin, y, contentWidth);
          }
          y += 3;
        }
      });
    }
    
    // Surgeries & Procedures
    if (data.surgeries && data.surgeries.length > 0) {
      y = addSectionHeader(doc, 'Surgeries & Procedures', margin, y);
      data.surgeries.forEach((surgery: any, index: number) => {
        if (surgery.procedure) {
          y = addField(doc, `Procedure ${index + 1}`, surgery.procedure, margin, y, contentWidth);
          if (surgery.date) {
            y = addField(doc, 'Date', surgery.date, margin, y, contentWidth);
          }
          if (surgery.hospital) {
            y = addField(doc, 'Hospital/Facility', surgery.hospital, margin, y, contentWidth);
          }
          if (surgery.notes) {
            y = addField(doc, 'Notes', surgery.notes, margin, y, contentWidth);
          }
          y += 3;
        }
      });
    }
    
    // Hospitalizations
    if (data.hospitalizations && data.hospitalizations.length > 0) {
      y = addSectionHeader(doc, 'Hospitalizations', margin, y);
      data.hospitalizations.forEach((hosp: any, index: number) => {
        if (hosp.reason) {
          y = addField(doc, `Hospitalization ${index + 1} - Reason`, hosp.reason, margin, y, contentWidth);
          if (hosp.date) {
            y = addField(doc, 'Date', hosp.date, margin, y, contentWidth);
          }
          if (hosp.hospital) {
            y = addField(doc, 'Hospital', hosp.hospital, margin, y, contentWidth);
          }
          if (hosp.notes) {
            y = addField(doc, 'Notes', hosp.notes, margin, y, contentWidth);
          }
          y += 3;
        }
      });
    }
  }
  
  // Organ Donation & Advance Directives
  if (data.organDonor || data.livingWill || data.dnr) {
    // Estimate space needed for this section (approximately 9 fields * 8 lines each = 72)
    if (!hasEnoughSpace(y, 72)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Organ Donation & Advance Directives', margin, y);
    y = addField(doc, 'Organ Donor', data.organDonor || '', margin, y, contentWidth);
    y = addField(doc, 'Organ Donor State', data.organDonorState || '', margin, y, contentWidth);
    y = addField(doc, 'Organ Donor Location', data.organDonorLocation || '', margin, y, contentWidth);
    y = addField(doc, 'Living Will', data.livingWill || '', margin, y, contentWidth);
    y = addField(doc, 'Living Will Date', data.livingWillDate || '', margin, y, contentWidth);
    y = addField(doc, 'Living Will Location', data.livingWillLocation || '', margin, y, contentWidth);
    y = addField(doc, 'DNR', data.dnr || '', margin, y, contentWidth);
    y = addField(doc, 'DNR Date', data.dnrDate || '', margin, y, contentWidth);
    y = addField(doc, 'DNR Location', data.dnrLocation || '', margin, y, contentWidth);
  }
  
  // Healthcare Proxy
  if (data.proxyName || data.proxyRelationship || data.proxyPhone) {
    // Estimate space needed for this section (approximately 5 fields * 8 lines each = 40)
    if (!hasEnoughSpace(y, 40)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Healthcare Proxy', margin, y);
    y = addField(doc, 'Proxy Name', data.proxyName || '', margin, y, contentWidth);
    y = addField(doc, 'Proxy Relationship', data.proxyRelationship || '', margin, y, contentWidth);
    y = addField(doc, 'Proxy Phone', data.proxyPhone || '', margin, y, contentWidth);
    y = addField(doc, 'Proxy Email', data.proxyEmail || '', margin, y, contentWidth);
    y = addField(doc, 'Proxy Location', data.proxyLocation || '', margin, y, contentWidth);
  }
  
  // Insurance Details
  if (data.primaryProvider || data.policyNumber || data.policyholder) {
    // Estimate space needed for this section (approximately 5 fields * 8 lines each = 40)
    if (!hasEnoughSpace(y, 40)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Insurance Details', margin, y);
    y = addField(doc, 'Primary Provider', data.primaryProvider || '', margin, y, contentWidth);
    y = addField(doc, 'Policy Number', data.policyNumber || '', margin, y, contentWidth);
    y = addField(doc, 'Policyholder', data.policyholder || '', margin, y, contentWidth);
    y = addField(doc, 'Insurance Phone', data.insurancePhone || '', margin, y, contentWidth);
    y = addField(doc, 'Secondary Coverage', data.secondaryCoverage || '', margin, y, contentWidth);
  }
  
  // Preferred Facilities
  if (data.nearestER || data.preferredHospital) {
    // Estimate space needed for this section
    const estimatedSpace = estimateSubsectionSpace(data, 'preferred_facilities');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Preferred Facilities', margin, y);
    y = addField(doc, 'Nearest ER', data.nearestER || '', margin, y, contentWidth);
    y = addField(doc, 'Preferred Hospital', data.preferredHospital || '', margin, y, contentWidth);
  }
  
  // Additional Notes
  if (data.additionalNotes) {
    // Estimate space needed for this section (approximately 1 field * 8 lines each = 8)
    if (!hasEnoughSpace(y, 8)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Additional Notes', margin, y);
    y = addField(doc, 'Notes', data.additionalNotes, margin, y, contentWidth);
  }
  
  return y;
};

const addLegalInfoContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Will & Estate Overview
  if (data.has_will || data.will_updated_date || data.will_location || data.other_estate_documents) {
    y = addSectionHeader(doc, 'Will & Estate Overview', margin, y);
    y = addField(doc, 'Has Will', data.has_will || '', margin, y, contentWidth);
    y = addField(doc, 'Date Last Updated', data.will_updated_date || '', margin, y, contentWidth);
    y = addField(doc, 'Location of Original Document', data.will_location || '', margin, y, contentWidth);
    y = addField(doc, 'Other Estate Documents', data.other_estate_documents || '', margin, y, contentWidth);
  }
  
  // Executor Details
  if (data.executors && data.executors.length > 0) {
    y = addSectionHeader(doc, 'Executor Details', margin, y);
    data.executors.forEach((executor: any, index: number) => {
      if (executor.full_name || executor.relationship) {
        y = addField(doc, `Executor ${index + 1} - Full Name`, executor.full_name || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', executor.relationship || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', executor.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', executor.email || '', margin, y, contentWidth);
        y = addField(doc, 'Address', executor.address || '', margin, y, contentWidth);
        y = addField(doc, 'Is Aware', executor.aware || '', margin, y, contentWidth);
        y = addField(doc, 'Has Accepted', executor.accepted || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', executor.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Executor Notes
  if (data.executor_doc_location || data.executor_compensation || data.executor_flat_fee || data.executor_hourly_rate || data.executor_notes) {
    // Estimate space needed for this section
    const estimatedSpace = estimateSubsectionSpace(data, 'executor_notes');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Executor Notes', margin, y);
    y = addField(doc, 'Document Stating Executor Role Is Located At', data.executor_doc_location || '', margin, y, contentWidth);
    y = addField(doc, 'Executor Compensation Preference', data.executor_compensation || '', margin, y, contentWidth);
    if (data.executor_compensation === 'flat-fee' && data.executor_flat_fee) {
      y = addField(doc, 'Flat Fee ($)', data.executor_flat_fee || '', margin, y, contentWidth);
    }
    if (data.executor_compensation === 'hourly' && data.executor_hourly_rate) {
      y = addField(doc, 'Hourly Rate ($)', data.executor_hourly_rate || '', margin, y, contentWidth);
    }
    y = addField(doc, 'Special Notes or Instructions', data.executor_notes || '', margin, y, contentWidth);
  }
  
  // Legal and Financial Contacts
  if (data.contacts && data.contacts.length > 0) {
    y = addSectionHeader(doc, 'Legal & Financial Contacts', margin, y);
    data.contacts.forEach((contact: any, index: number) => {
      if (contact.full_name || contact.contact_type) {
        y = addField(doc, `Contact ${index + 1} - Type`, contact.contact_type || '', margin, y, contentWidth);
        y = addField(doc, 'Full Name', contact.full_name || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', contact.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', contact.email || '', margin, y, contentWidth);
        y = addField(doc, 'Company', contact.company || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', contact.relationship || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', contact.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Power of Attorney
  if (data.financial_poa && data.financial_poa.length > 0) {
    y = addSectionHeader(doc, 'Financial Power of Attorney', margin, y);
    data.financial_poa.forEach((poa: any, index: number) => {
      if (poa.agent_name || poa.contact_info) {
        y = addField(doc, `POA ${index + 1} - Agent Name`, poa.agent_name || '', margin, y, contentWidth);
        y = addField(doc, 'Contact Info', poa.contact_info || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', poa.relationship || '', margin, y, contentWidth);
        y = addField(doc, 'Effective When', poa.effective_when || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', poa.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Healthcare Proxies
  if (data.healthcare_proxies && data.healthcare_proxies.length > 0) {
    y = addSectionHeader(doc, 'Healthcare Proxies', margin, y);
    data.healthcare_proxies.forEach((proxy: any, index: number) => {
      if (proxy.proxy_name || proxy.contact_info) {
        y = addField(doc, `Proxy ${index + 1} - Name`, proxy.proxy_name || '', margin, y, contentWidth);
        y = addField(doc, 'Alternate Proxy', proxy.alternate_proxy || '', margin, y, contentWidth);
        y = addField(doc, 'Contact Info', proxy.contact_info || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', proxy.relationship || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', proxy.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Other POA
  if (data.other_poa && data.other_poa.length > 0) {
    y = addSectionHeader(doc, 'Other Power of Attorney', margin, y);
    data.other_poa.forEach((poa: any, index: number) => {
      if (poa.role_name || poa.agent_name) {
        y = addField(doc, `POA ${index + 1} - Role`, poa.role_name || '', margin, y, contentWidth);
        y = addField(doc, 'Agent Name', poa.agent_name || '', margin, y, contentWidth);
        y = addField(doc, 'Contact Info', poa.contact_info || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', poa.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Lawyer Information
  if (data.lawyers && data.lawyers.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = estimateSubsectionSpace(data, 'lawyer_info');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Lawyer Information', margin, y);
    data.lawyers.forEach((lawyer: any, index: number) => {
      if (lawyer.lawyer_name || lawyer.lawyer_address) {
        y = addField(doc, `Lawyer ${index + 1} - Name`, lawyer.lawyer_name || '', margin, y, contentWidth);
        y = addField(doc, 'Address', lawyer.lawyer_address || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Supporting Legal Documents
  if (data.guardianship_name || data.guardianship_location || data.burial_cremation || data.burial_form_location) {
    // Estimate space needed for this section
    const estimatedSpace = estimateSubsectionSpace(data, 'supporting_docs');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Supporting Legal Documents', margin, y);
    y = addField(doc, 'Guardianship Name', data.guardianship_name || '', margin, y, contentWidth);
    y = addField(doc, 'Guardianship Location', data.guardianship_location || '', margin, y, contentWidth);
    y = addField(doc, 'Burial/Cremation', data.burial_cremation || '', margin, y, contentWidth);
    y = addField(doc, 'Signed Form Location', data.burial_form_location || '', margin, y, contentWidth);
  }
  
  // Personal Safe Details
  if (data.safes && data.safes.length > 0) {
    y = addSectionHeader(doc, 'Personal Safe Details', margin, y);
    data.safes.forEach((safe: any, index: number) => {
      if (safe.location || safe.contents) {
        y = addField(doc, `Safe ${index + 1} - Location`, safe.location || '', margin, y, contentWidth);
        y = addField(doc, 'Combination', safe.combination || '', margin, y, contentWidth);
        y = addField(doc, 'Contents', safe.contents || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', safe.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Safe Deposit Box
  if (data.safe_deposit_boxes && data.safe_deposit_boxes.length > 0) {
    y = addSectionHeader(doc, 'Safe Deposit Box', margin, y);
    data.safe_deposit_boxes.forEach((box: any, index: number) => {
      if (box.bank || box.location) {
        y = addField(doc, `Box ${index + 1} - Bank`, box.bank || '', margin, y, contentWidth);
        y = addField(doc, 'Location', box.location || '', margin, y, contentWidth);
        y = addField(doc, 'Box Number', box.box_number || '', margin, y, contentWidth);
        y = addField(doc, 'Key Location', box.key_location || '', margin, y, contentWidth);
        y = addField(doc, 'Contents', box.contents || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', box.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Alternate Executors
  if (data.alternate_executors && data.alternate_executors.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = estimateSubsectionSpace(data, 'alternate_executors');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Alternate Executors', margin, y);
    data.alternate_executors.forEach((executor: any, index: number) => {
      if (executor.alternate_executor_name || executor.alternate_executor_phone) {
        y = addField(doc, `Alternate Executor ${index + 1} - Name`, executor.alternate_executor_name || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', executor.alternate_executor_phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', executor.alternate_executor_email || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', executor.alternate_executor_relationship || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  return y;
};

const addFormalLettersContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Letter to Executor
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Letter to Executor', margin, y);
  if (data.letterToExecutor) {
    y = addField(doc, 'Content', data.letterToExecutor, margin, y, contentWidth);
  } else if (data.familyLetters && data.familyLetters.length > 0) {
    // Handle original data structure
    data.familyLetters.forEach((letter: any, index: number) => {
      if (letter.purpose && letter.purpose.toLowerCase().includes('executor')) {
        y = addField(doc, 'Recipients', letter.recipients || '', margin, y, contentWidth);
        y = addField(doc, 'Purpose', letter.purpose || '', margin, y, contentWidth);
        if (letter.letterContent) {
          y = addField(doc, 'Letter Content', letter.letterContent, margin, y, contentWidth);
        }
        y += 5;
      }
    });
  }
  
  // Letter to Legal or Financial Advisor
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Letter to Legal or Financial Advisor', margin, y);
  if (data.letterToLegalFinancialAdvisor) {
    y = addField(doc, 'Content', data.letterToLegalFinancialAdvisor, margin, y, contentWidth);
  } else if (data.familyLetters && data.familyLetters.length > 0) {
    // Handle original data structure
    data.familyLetters.forEach((letter: any, index: number) => {
      if (letter.purpose && (letter.purpose.toLowerCase().includes('legal') || letter.purpose.toLowerCase().includes('financial') || letter.purpose.toLowerCase().includes('advisor'))) {
        y = addField(doc, 'Recipients', letter.recipients || '', margin, y, contentWidth);
        y = addField(doc, 'Purpose', letter.purpose || '', margin, y, contentWidth);
        if (letter.letterContent) {
          y = addField(doc, 'Letter Content', letter.letterContent, margin, y, contentWidth);
        }
        y += 5;
      }
    });
  }
  
  // Letter to Healthcare Proxy
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Letter to Healthcare Proxy', margin, y);
  if (data.letterToHealthcareProxy) {
    y = addField(doc, 'Content', data.letterToHealthcareProxy, margin, y, contentWidth);
  } else if (data.familyLetters && data.familyLetters.length > 0) {
    // Handle original data structure
    data.familyLetters.forEach((letter: any, index: number) => {
      if (letter.purpose && (letter.purpose.toLowerCase().includes('healthcare') || letter.purpose.toLowerCase().includes('proxy') || letter.purpose.toLowerCase().includes('medical'))) {
        y = addField(doc, 'Recipients', letter.recipients || '', margin, y, contentWidth);
        y = addField(doc, 'Purpose', letter.purpose || '', margin, y, contentWidth);
        if (letter.letterContent) {
          y = addField(doc, 'Letter Content', letter.letterContent, margin, y, contentWidth);
        }
        y += 5;
      }
    });
  }
  
  // Letter to Family or Loved Ones
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Letter to Family or Loved Ones', margin, y);
  if (data.letterToFamilyLovedOnes) {
    y = addField(doc, 'Content', data.letterToFamilyLovedOnes, margin, y, contentWidth);
  } else if (data.familyLetters && data.familyLetters.length > 0) {
    // Handle original data structure
    data.familyLetters.forEach((letter: any, index: number) => {
      if (letter.purpose && (letter.purpose.toLowerCase().includes('family') || letter.purpose.toLowerCase().includes('loved') || letter.purpose.toLowerCase().includes('personal'))) {
        y = addField(doc, 'Recipients', letter.recipients || '', margin, y, contentWidth);
        y = addField(doc, 'Purpose', letter.purpose || '', margin, y, contentWidth);
        if (letter.letterContent) {
          y = addField(doc, 'Letter Content', letter.letterContent, margin, y, contentWidth);
        }
        y += 5;
      }
    });
  }
  
  return y;
};

const addPersonalPropertyContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Real Estate Properties
  if (data.primaryResidenceAddress || (data.additionalProperties && data.additionalProperties.length > 0)) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Real Estate Properties', margin, y);
    
    // Primary Residence
    if (data.primaryResidenceAddress) {
      y = addField(doc, 'Primary Residence - Address', data.primaryResidenceAddress || '', margin, y, contentWidth);
      y = addField(doc, 'Co-Owners', data.primaryResidenceCoOwners || '', margin, y, contentWidth);
      y = addField(doc, 'Security Information', data.primaryResidenceSecurity || '', margin, y, contentWidth);
      y = addField(doc, 'Mortgage Information', data.primaryResidenceMortgage || '', margin, y, contentWidth);
    }
    
    // Additional Properties
    if (data.additionalProperties && data.additionalProperties.length > 0) {
      data.additionalProperties.forEach((property: any, index: number) => {
        if (property.address || property.propertyType || property.estimatedValue) {
          y = addField(doc, `Additional Property ${index + 1} - Address`, property.address || '', margin, y, contentWidth);
          y = addField(doc, 'Property Type', property.propertyType || '', margin, y, contentWidth);
          y = addField(doc, 'Estimated Value', property.estimatedValue || '', margin, y, contentWidth);
          y = addField(doc, 'Mortgage Information', property.mortgageInfo || '', margin, y, contentWidth);
          y = addField(doc, 'Insurance Information', property.insuranceInfo || '', margin, y, contentWidth);
          y = addField(doc, 'Utility Information', property.utilityInfo || '', margin, y, contentWidth);
          y = addField(doc, 'Special Instructions', property.specialInstructions || '', margin, y, contentWidth);
          y += 5;
        }
      });
    }
  }
  
  // Storage Units & Garages
  if (data.storageUnits && data.storageUnits.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Storage Units & Garages', margin, y);
    data.storageUnits.forEach((unit: any, index: number) => {
      if (unit.location || unit.accessDetails) {
        y = addField(doc, `Storage Unit ${index + 1} - Location`, unit.location || '', margin, y, contentWidth);
        y = addField(doc, 'Access Details', unit.accessDetails || '', margin, y, contentWidth);
        y = addField(doc, 'Special Instructions', unit.specialInstructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // High-Value Items & Appraisals
  if (data.highValueItems && data.highValueItems.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'High-Value Items & Appraisals', margin, y);
    data.highValueItems.forEach((item: any, index: number) => {
      if (item.items || item.appraisalLocation) {
        y = addField(doc, `Item ${index + 1} - Description`, item.items || '', margin, y, contentWidth);
        y = addField(doc, 'Appraisal Document Location', item.appraisalLocation || '', margin, y, contentWidth);
        y = addField(doc, 'Special Instructions', item.specialInstructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Firearms
  if (data.firearms && data.firearms.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Firearms', margin, y);
    data.firearms.forEach((firearm: any, index: number) => {
      if (firearm.registrationInfo || firearm.permitInfo || firearm.legalDocuments) {
        y = addField(doc, `Firearm ${index + 1} - Registration Info`, firearm.registrationInfo || '', margin, y, contentWidth);
        y = addField(doc, 'Permit Info', firearm.permitInfo || '', margin, y, contentWidth);
        y = addField(doc, 'Legal Documents & Permit Papers', firearm.legalDocuments || '', margin, y, contentWidth);
        y = addField(doc, 'Special Instructions', firearm.specialInstructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Photo Albums & Family Keepsakes
  if (data.photoAlbums && data.photoAlbums.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Photo Albums & Family Keepsakes', margin, y);
    data.photoAlbums.forEach((album: any, index: number) => {
      if (album.description || album.location) {
        y = addField(doc, `Album ${index + 1} - Description`, album.description || '', margin, y, contentWidth);
        y = addField(doc, 'Location', album.location || '', margin, y, contentWidth);
        y = addField(doc, 'Special Instructions', album.specialInstructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Home Contents & Distribution Plan
  if (data.homeContents && data.homeContents.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Home Contents & Distribution Plan', margin, y);
    data.homeContents.forEach((item: any, index: number) => {
      if (item.description || item.assignedTo) {
        y = addField(doc, `Item ${index + 1} - Description`, item.description || '', margin, y, contentWidth);
        y = addField(doc, 'Assigned To', item.assignedTo || '', margin, y, contentWidth);
        y = addField(doc, 'Special Instructions', item.specialInstructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Other Property
  if (data.otherProperty && data.otherProperty.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Other Property', margin, y);
    data.otherProperty.forEach((item: any, index: number) => {
      if (item.description || item.location) {
        y = addField(doc, `Item ${index + 1} - Description`, item.description || '', margin, y, contentWidth);
        y = addField(doc, 'Location', item.location || '', margin, y, contentWidth);
        y = addField(doc, 'Special Instructions', item.specialInstructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Asset Distribution Plan
  if (data.assetDistributionPlan && data.assetDistributionPlan.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Asset Distribution Plan', margin, y);
    data.assetDistributionPlan.forEach((item: any, index: number) => {
      if (item.description || item.assignedTo) {
        y = addField(doc, `Item ${index + 1} - Description`, item.description || '', margin, y, contentWidth);
        y = addField(doc, 'Assigned To', item.assignedTo || '', margin, y, contentWidth);
        y = addField(doc, 'Special Instructions', item.specialInstructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  return y;
};

const addFinanceContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Bank Accounts & Balances
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Bank Accounts & Balances', margin, y);
  if (data.bankAccounts && data.bankAccounts.length > 0) {
    data.bankAccounts.forEach((account: any, index: number) => {
      if (account.bankName || account.balance) {
        y = addField(doc, `Account ${index + 1} - Bank Name`, account.bankName || '', margin, y, contentWidth);
        y = addField(doc, 'Approximate Balance', account.balance || '', margin, y, contentWidth);
        y = addField(doc, 'Account Location', account.location || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Cash on Hand
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Cash on Hand', margin, y);
  if (data.cashOnHand && data.cashOnHand.length > 0) {
    data.cashOnHand.forEach((cash: any, index: number) => {
      if (cash.amount || cash.location) {
        y = addField(doc, `Cash ${index + 1} - Amount`, cash.amount || '', margin, y, contentWidth);
        y = addField(doc, 'Location', cash.location || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Investments & Brokerages
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Investments & Brokerages', margin, y);
  if (data.investments && data.investments.length > 0) {
    data.investments.forEach((investment: any, index: number) => {
      if (investment.firmName || investment.accountInfo) {
        y = addField(doc, `Investment ${index + 1} - Firm Name`, investment.firmName || '', margin, y, contentWidth);
        y = addField(doc, 'Account Information', investment.accountInfo || '', margin, y, contentWidth);
        y = addField(doc, 'Document Location', investment.documentLocation || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Retirement Plans & Pensions
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Retirement Plans & Pensions', margin, y);
  if (data.retirementPlans && data.retirementPlans.length > 0) {
    data.retirementPlans.forEach((plan: any, index: number) => {
      if (plan.planType || plan.provider) {
        y = addField(doc, `Plan ${index + 1} - Type`, plan.planType || '', margin, y, contentWidth);
        y = addField(doc, 'Provider', plan.provider || '', margin, y, contentWidth);
        y = addField(doc, 'Document Location', plan.documentLocation || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Crypto & Precious Metals
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Crypto & Precious Metals', margin, y);
  if (data.cryptoMetals && data.cryptoMetals.length > 0) {
    data.cryptoMetals.forEach((item: any, index: number) => {
      if (item.type || item.location) {
        y = addField(doc, `Item ${index + 1} - Type`, item.type || '', margin, y, contentWidth);
        y = addField(doc, 'Location', item.location || '', margin, y, contentWidth);
        y = addField(doc, 'Value', item.value || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Income Sources
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Income Sources', margin, y);
  if (data.incomeSources && data.incomeSources.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Income Sources', margin, y);
    data.incomeSources.forEach((income: any, index: number) => {
      if (income.type || income.contactInfo) {
        y = addField(doc, `Income ${index + 1} - Type`, income.type || '', margin, y, contentWidth);
        y = addField(doc, 'Contact Information', income.contactInfo || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Liabilities & Debts
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Liabilities & Debts', margin, y);
  if (data.liabilities && data.liabilities.length > 0) {
    data.liabilities.forEach((liability: any, index: number) => {
      if (liability.creditor || liability.balance) {
        y = addField(doc, `Liability ${index + 1} - Creditor`, liability.creditor || '', margin, y, contentWidth);
        y = addField(doc, 'Balance', liability.balance || '', margin, y, contentWidth);
        y = addField(doc, 'Due Date', liability.dueDate || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Vehicles
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Vehicles', margin, y);
  if (data.vehicles && data.vehicles.length > 0) {
    data.vehicles.forEach((vehicle: any, index: number) => {
      if (vehicle.makeModel || vehicle.documentLocation) {
        y = addField(doc, `Vehicle ${index + 1} - Make/Model`, vehicle.makeModel || '', margin, y, contentWidth);
        y = addField(doc, 'Document Location', vehicle.documentLocation || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Properties
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Properties', margin, y);
  if (data.properties && data.properties.length > 0) {
    data.properties.forEach((property: any, index: number) => {
      if (property.address || property.mortgageInfo) {
        y = addField(doc, `Property ${index + 1} - Address`, property.address || '', margin, y, contentWidth);
        y = addField(doc, 'Mortgage Information', property.mortgageInfo || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Business Ownership
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Business Ownership', margin, y);
  if (data.businesses && data.businesses.length > 0) {
    data.businesses.forEach((business: any, index: number) => {
      if (business.name || business.ownershipType) {
        y = addField(doc, `Business ${index + 1} - Name`, business.name || '', margin, y, contentWidth);
        y = addField(doc, 'Ownership Type', business.ownershipType || '', margin, y, contentWidth);
        y = addField(doc, 'Successor Plan', business.successorPlan || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Financial Advisor
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Financial Advisor', margin, y);
  if (data.financialAdvisor) {
    y = addField(doc, 'Advisor Name', data.financialAdvisor.name || '', margin, y, contentWidth);
    y = addField(doc, 'Contact Information', data.financialAdvisor.contactInfo || '', margin, y, contentWidth);
    y = addField(doc, 'Firm Name', data.financialAdvisor.firmName || '', margin, y, contentWidth);
  }
  
  // Statement Access
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Statement Access', margin, y);
  if (data.statementAccess) {
    y = addField(doc, 'Access Information', data.statementAccess.accessInfo || '', margin, y, contentWidth);
    y = addField(doc, 'Login Credentials', data.statementAccess.loginCredentials || '', margin, y, contentWidth);
    y = addField(doc, 'Notes', data.statementAccess.notes || '', margin, y, contentWidth);
  }
  
  return y;
};

const addBeneficiariesContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Life and Health Insurance Policies
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Life and Health Insurance Policies', margin, y);
  if (data.insurancePolicies && data.insurancePolicies.length > 0) {
    data.insurancePolicies.forEach((policy: any, index: number) => {
      if (policy.companyName || policy.policyType) {
        y = addField(doc, `Policy ${index + 1} - Company Name`, policy.companyName || '', margin, y, contentWidth);
        y = addField(doc, 'Policy Type', policy.policyType || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', policy.accountNumber || '', margin, y, contentWidth);
        y = addField(doc, 'Contacts', policy.contacts || '', margin, y, contentWidth);
        y = addField(doc, 'Amount', policy.amount || '', margin, y, contentWidth);
        y = addField(doc, 'Beneficiary', policy.beneficiary || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', policy.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Employee Benefits
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Employee Benefits', margin, y);
  if (data.employeeBenefits && data.employeeBenefits.length > 0) {
    data.employeeBenefits.forEach((benefit: any, index: number) => {
      if (benefit.beneficiaries || benefit.accountNumber) {
        y = addField(doc, `Benefit ${index + 1} - Beneficiaries`, benefit.beneficiaries || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', benefit.accountNumber || '', margin, y, contentWidth);
        y = addField(doc, 'Contacts', benefit.contacts || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', benefit.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Social Security
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Social Security', margin, y);
  if (data.socialSecurityBenefits && data.socialSecurityBenefits.length > 0) {
    data.socialSecurityBenefits.forEach((benefit: any, index: number) => {
      if (benefit.beneficiaries || benefit.accountNumber) {
        y = addField(doc, `Benefit ${index + 1} - Beneficiaries`, benefit.beneficiaries || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', benefit.accountNumber || '', margin, y, contentWidth);
        y = addField(doc, 'Contacts', benefit.contacts || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', benefit.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Retirement
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Retirement', margin, y);
  if (data.retirementBenefits && data.retirementBenefits.length > 0) {
    data.retirementBenefits.forEach((benefit: any, index: number) => {
      if (benefit.beneficiaries || benefit.accountNumber) {
        y = addField(doc, `Benefit ${index + 1} - Beneficiaries`, benefit.beneficiaries || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', benefit.accountNumber || '', margin, y, contentWidth);
        y = addField(doc, 'Contacts', benefit.contacts || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', benefit.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Veteran's Benefits
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Veteran\'s Benefits', margin, y);
  if (data.veteranBenefits && data.veteranBenefits.length > 0) {
    data.veteranBenefits.forEach((benefit: any, index: number) => {
      if (benefit.beneficiaries || benefit.accountNumber) {
        y = addField(doc, `Benefit ${index + 1} - Beneficiaries`, benefit.beneficiaries || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', benefit.accountNumber || '', margin, y, contentWidth);
        y = addField(doc, 'Contacts', benefit.contacts || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', benefit.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Primary & Contingent Beneficiaries
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Primary & Contingent Beneficiaries', margin, y);
  if (data.beneficiaryGroups && data.beneficiaryGroups.length > 0) {
    data.beneficiaryGroups.forEach((group: any, index: number) => {
      if (group.primaryBeneficiaries || group.contingentBeneficiaries) {
        y = addField(doc, `Group ${index + 1} - Primary Beneficiaries`, group.primaryBeneficiaries || '', margin, y, contentWidth);
        y = addField(doc, 'Contingent Beneficiaries', group.contingentBeneficiaries || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Assigned Beneficiaries on Accounts
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Assigned Beneficiaries on Accounts', margin, y);
  if (data.assignedBeneficiaries && data.assignedBeneficiaries.length > 0) {
    data.assignedBeneficiaries.forEach((beneficiary: any, index: number) => {
      if (beneficiary.accountType || beneficiary.location) {
        y = addField(doc, `Account ${index + 1} - Type`, beneficiary.accountType || '', margin, y, contentWidth);
        y = addField(doc, 'Location', beneficiary.location || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Specific Bequests (Heirlooms, Gifts)
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Specific Bequests (Heirlooms, Gifts)', margin, y);
  if (data.specificBequests && data.specificBequests.length > 0) {
    data.specificBequests.forEach((bequest: any, index: number) => {
      if (bequest.item || bequest.recipientName) {
        y = addField(doc, `Bequest ${index + 1} - Item`, bequest.item || '', margin, y, contentWidth);
        y = addField(doc, 'Recipient Name', bequest.recipientName || '', margin, y, contentWidth);
        y = addField(doc, 'Bequest List Location', bequest.bequestListLocation || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Messages or Letters for Beneficiaries
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Messages or Letters for Beneficiaries', margin, y);
  if (data.beneficiaryMessages && data.beneficiaryMessages.length > 0) {
    data.beneficiaryMessages.forEach((message: any, index: number) => {
      if (message.location) {
        y = addField(doc, `Message ${index + 1} - Location`, message.location || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Notes on Disinheritance or Special Instructions
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Notes on Disinheritance or Special Instructions', margin, y);
  if (data.disinheritanceNotes) {
    y = addField(doc, 'Disinheritance Notes', data.disinheritanceNotes || '', margin, y, contentWidth);
  }
  
  // Document Locations & Keys
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Document Locations & Keys', margin, y);
  if (data.documentLocations && data.documentLocations.length > 0) {
    data.documentLocations.forEach((document: any, index: number) => {
      if (document.documentType || document.location) {
        y = addField(doc, `Document ${index + 1} - Type`, document.documentType || '', margin, y, contentWidth);
        y = addField(doc, 'Location', document.location || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  return y;
};

const addDigitalLifeContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Password Manager
  if (data.passwordManagerUsed) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Password Manager', margin, y);
    y = addField(doc, 'Used', data.passwordManagerUsed, margin, y, contentWidth);
    y = addField(doc, 'Service', data.passwordManagerService || '', margin, y, contentWidth);
    y = addField(doc, 'Access Info', data.passwordManagerAccess || '', margin, y, contentWidth);
  }
  
  // Two-Factor Authentication Devices
  if (data.twoFactorDevices) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Two-Factor Authentication Devices', margin, y);
    y = addField(doc, 'Devices Used', data.twoFactorDevices, margin, y, contentWidth);
    y = addField(doc, 'Backup Codes Location', data.backupCodesLocation || '', margin, y, contentWidth);
  }
  
  // Email Providers
  if (data.emailProviders && data.emailProviders.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Email Providers', margin, y);
    data.emailProviders.forEach((provider: any, index: number) => {
      if (provider.provider || provider.username) {
        y = addField(doc, `Provider ${index + 1}`, provider.provider || '', margin, y, contentWidth);
        y = addField(doc, 'Username', provider.username || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', provider.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Social Media Accounts
  if (data.socialMediaAccounts && data.socialMediaAccounts.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Social Media Accounts', margin, y);
    data.socialMediaAccounts.forEach((account: any, index: number) => {
      if (account.platform || account.username) {
        y = addField(doc, `Platform ${index + 1}`, account.platform || '', margin, y, contentWidth);
        y = addField(doc, 'Username', account.username || '', margin, y, contentWidth);
        y = addField(doc, 'Profile URL', account.profileUrl || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', account.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Cloud Storage Accounts
  if (data.cloudStorageAccounts && data.cloudStorageAccounts.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Cloud Storage Accounts', margin, y);
    data.cloudStorageAccounts.forEach((account: any, index: number) => {
      if (account.service || account.username) {
        y = addField(doc, `Service ${index + 1}`, account.service || '', margin, y, contentWidth);
        y = addField(doc, 'Username', account.username || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', account.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Streaming Accounts
  if (data.streamingAccounts && data.streamingAccounts.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.streamingAccounts.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Streaming Accounts', margin, y);
    data.streamingAccounts.forEach((account: any, index: number) => {
      if (account.service || account.username) {
        y = addField(doc, `Service ${index + 1}`, account.service || '', margin, y, contentWidth);
        y = addField(doc, 'Username', account.username || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', account.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // General Cancelation Instructions
  if (data.generalCancelationInstructions) {
    // Estimate space needed for this section
    const estimatedSpace = 50;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'General Cancelation Instructions', margin, y);
    y = addField(doc, 'Instructions', data.generalCancelationInstructions, margin, y, contentWidth);
  }
  
  // Mobile Devices & Laptops
  if (data.mobileDevices && data.mobileDevices.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.mobileDevices.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Mobile Devices & Laptops', margin, y);
    data.mobileDevices.forEach((device: any, index: number) => {
      if (device.deviceType || device.accessInfo) {
        y = addField(doc, `Device ${index + 1} - Type`, device.deviceType || '', margin, y, contentWidth);
        y = addField(doc, 'Access Information', device.accessInfo || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', device.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // USBs & External Storage
  if (data.usbStorage && data.usbStorage.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.usbStorage.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'USBs & External Storage', margin, y);
    data.usbStorage.forEach((storage: any, index: number) => {
      if (storage.description || storage.location) {
        y = addField(doc, `Storage ${index + 1} - Description`, storage.description || '', margin, y, contentWidth);
        y = addField(doc, 'Location', storage.location || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', storage.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Instructions for Digital Executor
  if (data.digitalExecutorInstructions) {
    // Estimate space needed for this section
    const estimatedSpace = 50;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Instructions for Digital Executor', margin, y);
    y = addField(doc, 'Instructions', data.digitalExecutorInstructions, margin, y, contentWidth);
  }
  
  // Email Accounts
  if (data.emailAccounts && data.emailAccounts.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.emailAccounts.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Email Accounts', margin, y);
    data.emailAccounts.forEach((account: any, index: number) => {
      if (account.email || account.accessInfo) {
        y = addField(doc, `Email ${index + 1}`, account.email || '', margin, y, contentWidth);
        y = addField(doc, 'Access Information', account.accessInfo || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', account.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Websites
  if (data.websites && data.websites.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.websites.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Websites', margin, y);
    data.websites.forEach((website: any, index: number) => {
      if (website.url || website.accessInfo) {
        y = addField(doc, `Website ${index + 1} - URL`, website.url || '', margin, y, contentWidth);
        y = addField(doc, 'Access Information', website.accessInfo || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', website.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Blogs
  if (data.blogs && data.blogs.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.blogs.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Blogs', margin, y);
    data.blogs.forEach((blog: any, index: number) => {
      if (blog.url || blog.accessInfo) {
        y = addField(doc, `Blog ${index + 1} - URL`, blog.url || '', margin, y, contentWidth);
        y = addField(doc, 'Access Information', blog.accessInfo || '', margin, y, contentWidth);
        y = addField(doc, 'Notes', blog.notes || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  return y;
};

const addKeyContactsContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Emergency Contacts
  if (data.emergencyContacts && data.emergencyContacts.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = estimateSubsectionSpace(data, 'emergency_contacts_key');
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Emergency Contacts', margin, y);
    data.emergencyContacts.forEach((contact: any, index: number) => {
      if (contact.name || contact.phone) {
        y = addField(doc, `Contact ${index + 1}`, contact.name || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', contact.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', contact.relationship || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Immediate Family Members
  if (data.immediateFamily && data.immediateFamily.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.immediateFamily.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Immediate Family Members', margin, y);
    data.immediateFamily.forEach((member: any, index: number) => {
      if (member.name || member.relationship) {
        y = addField(doc, `Member ${index + 1} - Name`, member.name || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', member.relationship || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', member.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', member.email || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Friends & Chosen Family
  if (data.friendsChosenFamily && data.friendsChosenFamily.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.friendsChosenFamily.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Friends & Chosen Family', margin, y);
    data.friendsChosenFamily.forEach((friend: any, index: number) => {
      if (friend.name || friend.relationship) {
        y = addField(doc, `Friend ${index + 1} - Name`, friend.name || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', friend.relationship || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', friend.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', friend.email || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Legal & Financial Professionals
  if (data.legalFinancialProfessionals && data.legalFinancialProfessionals.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.legalFinancialProfessionals.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Legal & Financial Professionals', margin, y);
    data.legalFinancialProfessionals.forEach((professional: any, index: number) => {
      if (professional.name || professional.profession) {
        y = addField(doc, `Professional ${index + 1} - Name`, professional.name || '', margin, y, contentWidth);
        y = addField(doc, 'Profession', professional.profession || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', professional.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', professional.email || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Medical Professionals
  if (data.medicalProfessionals && data.medicalProfessionals.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.medicalProfessionals.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Medical Professionals', margin, y);
    data.medicalProfessionals.forEach((professional: any, index: number) => {
      if (professional.name || professional.specialty) {
        y = addField(doc, `Professional ${index + 1} - Name`, professional.name || '', margin, y, contentWidth);
        y = addField(doc, 'Specialty', professional.specialty || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', professional.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', professional.email || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Household Helpers
  if (data.householdHelpers && data.householdHelpers.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.householdHelpers.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Household Helpers', margin, y);
    data.householdHelpers.forEach((helper: any, index: number) => {
      if (helper.name || helper.service) {
        y = addField(doc, `Helper ${index + 1} - Name`, helper.name || '', margin, y, contentWidth);
        y = addField(doc, 'Service', helper.service || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', helper.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', helper.email || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Pet Professionals
  if (data.petProfessionals && data.petProfessionals.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.petProfessionals.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Pet Professionals', margin, y);
    data.petProfessionals.forEach((professional: any, index: number) => {
      if (professional.name || professional.service) {
        y = addField(doc, `Professional ${index + 1} - Name`, professional.name || '', margin, y, contentWidth);
        y = addField(doc, 'Service', professional.service || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', professional.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', professional.email || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Notification List
  if (data.notificationList && data.notificationList.length > 0) {
    // Estimate space needed for this section
    const estimatedSpace = data.notificationList.length * 24;
    if (!hasEnoughSpace(y, estimatedSpace)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Notification List', margin, y);
    data.notificationList.forEach((contact: any, index: number) => {
      if (contact.name || contact.relationship) {
        y = addField(doc, `Contact ${index + 1} - Name`, contact.name || '', margin, y, contentWidth);
        y = addField(doc, 'Relationship', contact.relationship || '', margin, y, contentWidth);
        y = addField(doc, 'Phone', contact.phone || '', margin, y, contentWidth);
        y = addField(doc, 'Email', contact.email || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  return y;
};

const addFuneralContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Burial / Cremation / Donation Wishes
  if (data.dispositionType) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Burial / Cremation / Donation Wishes', margin, y);
    y = addField(doc, 'Disposition Type', data.dispositionType, margin, y, contentWidth);
    y = addField(doc, 'Disposition Details', data.dispositionDetails || '', margin, y, contentWidth);
    y = addField(doc, 'Burial Assets', data.hasBurialAssets || '', margin, y, contentWidth);
    y = addField(doc, 'Burial Location', data.burialLocation || '', margin, y, contentWidth);
  }
  
  // Preferred Funeral or Memorial Style
  if (data.wantsFuneralService) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Preferred Funeral or Memorial Style', margin, y);
    y = addField(doc, 'Funeral Service', data.wantsFuneralService, margin, y, contentWidth);
    y = addField(doc, 'Service Type', data.serviceType || '', margin, y, contentWidth);
    y = addField(doc, 'Other Service Type', data.otherServiceType || '', margin, y, contentWidth);
  }
  
  // Service Details
  if (data.serviceDetails) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Service Details', margin, y);
    y = addField(doc, 'Details', data.serviceDetails, margin, y, contentWidth);
  }
  
  // Guest List or Privacy Preferences
  if (data.guestListPrivacy) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Guest List or Privacy Preferences', margin, y);
    y = addField(doc, 'Preferences', data.guestListPrivacy, margin, y, contentWidth);
  }
  
  // Obituary Instructions
  if (data.obituaryInstructions) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Obituary Instructions', margin, y);
    y = addField(doc, 'Instructions', data.obituaryInstructions, margin, y, contentWidth);
  }
  
  // Headstone / Marker Preferences
  if (data.headstonePreferences) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Headstone / Marker Preferences', margin, y);
    y = addField(doc, 'Preferences', data.headstonePreferences, margin, y, contentWidth);
  }
  
  // Donations in Lieu of Flowers
  if (data.donationsInLieuOfFlowers) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Donations in Lieu of Flowers', margin, y);
    y = addField(doc, 'Donation Information', data.donationsInLieuOfFlowers, margin, y, contentWidth);
  }
  
  // Special Rituals or Tributes
  if (data.specialRitualsTributes) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Special Rituals or Tributes', margin, y);
    y = addField(doc, 'Rituals or Tributes', data.specialRitualsTributes, margin, y, contentWidth);
  }
  
  return y;
};

const addAccountsContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Clubs & Memberships
  if (data.golfClubs || data.socialClubs || data.businessClubs || data.automotiveClubs || data.otherClubs) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Clubs & Memberships', margin, y);
    y = addField(doc, 'Golf Clubs', data.golfClubs || '', margin, y, contentWidth);
    y = addField(doc, 'Social Clubs', data.socialClubs || '', margin, y, contentWidth);
    y = addField(doc, 'Business Clubs', data.businessClubs || '', margin, y, contentWidth);
    y = addField(doc, 'Automotive Clubs', data.automotiveClubs || '', margin, y, contentWidth);
    y = addField(doc, 'Other Clubs', data.otherClubs || '', margin, y, contentWidth);
  }
  
  // Streaming & Subscriptions
  if (data.streamingSubscriptions && data.streamingSubscriptions.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Streaming & Subscriptions', margin, y);
    data.streamingSubscriptions.forEach((subscription: any, index: number) => {
      if (subscription.serviceName || subscription.username) {
        y = addField(doc, `Service ${index + 1}`, subscription.serviceName || '', margin, y, contentWidth);
        y = addField(doc, 'Username', subscription.username || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Shopping & Delivery Services
  if (data.shoppingDeliveryServices && data.shoppingDeliveryServices.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Shopping & Delivery Services', margin, y);
    data.shoppingDeliveryServices.forEach((service: any, index: number) => {
      if (service.serviceName || service.accountNumber) {
        y = addField(doc, `Service ${index + 1}`, service.serviceName || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', service.accountNumber || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Financial Apps & Wallets
  if (data.financialAppsWallets && data.financialAppsWallets.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Financial Apps & Wallets', margin, y);
    data.financialAppsWallets.forEach((app: any, index: number) => {
      if (app.appName || app.username) {
        y = addField(doc, `App ${index + 1}`, app.appName || '', margin, y, contentWidth);
        y = addField(doc, 'Username', app.username || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Publications & Memberships
  if (data.publicationsMemberships && data.publicationsMemberships.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Publications & Memberships', margin, y);
    data.publicationsMemberships.forEach((publication: any, index: number) => {
      if (publication.publicationName || publication.subscriptionNumber) {
        y = addField(doc, `Publication ${index + 1}`, publication.publicationName || '', margin, y, contentWidth);
        y = addField(doc, 'Subscription Number', publication.subscriptionNumber || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Rewards & Points Programs
  if (data.rewardsPointsPrograms && data.rewardsPointsPrograms.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Rewards & Points Programs', margin, y);
    data.rewardsPointsPrograms.forEach((program: any, index: number) => {
      if (program.programName || program.memberNumber) {
        y = addField(doc, `Program ${index + 1}`, program.programName || '', margin, y, contentWidth);
        y = addField(doc, 'Member Number', program.memberNumber || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Frequent Flyer Accounts
  if (data.frequentFlyerAccounts && data.frequentFlyerAccounts.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Frequent Flyer Accounts', margin, y);
    data.frequentFlyerAccounts.forEach((account: any, index: number) => {
      if (account.airlineName || account.accountNumber) {
        y = addField(doc, `Airline ${index + 1}`, account.airlineName || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', account.accountNumber || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Phone, Internet, Utilities
  if (data.phoneInternetUtilities && data.phoneInternetUtilities.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Phone, Internet, Utilities', margin, y);
    data.phoneInternetUtilities.forEach((utility: any, index: number) => {
      if (utility.serviceName || utility.accountNumber) {
        y = addField(doc, `Service ${index + 1}`, utility.serviceName || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', utility.accountNumber || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Store & Travel Loyalty Programs
  if (data.storeTravelLoyaltyPrograms && data.storeTravelLoyaltyPrograms.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Store & Travel Loyalty Programs', margin, y);
    data.storeTravelLoyaltyPrograms.forEach((program: any, index: number) => {
      if (program.programName || program.memberNumber) {
        y = addField(doc, `Program ${index + 1}`, program.programName || '', margin, y, contentWidth);
        y = addField(doc, 'Member Number', program.memberNumber || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Miscellaneous
  if (data.miscellaneousAccounts && data.miscellaneousAccounts.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Miscellaneous', margin, y);
    data.miscellaneousAccounts.forEach((account: any, index: number) => {
      if (account.accountName || account.accountNumber) {
        y = addField(doc, `Account ${index + 1}`, account.accountName || '', margin, y, contentWidth);
        y = addField(doc, 'Account Number', account.accountNumber || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  return y;
};

const addPetsContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Pet Information
  if (data.pets && data.pets.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Pet Information', margin, y);
    data.pets.forEach((pet: any, index: number) => {
      if (pet.name || pet.type) {
        y = addField(doc, `Pet ${index + 1}`, pet.name || '', margin, y, contentWidth);
        y = addField(doc, 'Type', pet.type || '', margin, y, contentWidth);
        y = addField(doc, 'Age', pet.age || '', margin, y, contentWidth);
        y = addField(doc, 'Care Instructions', pet.careInstructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Caregiver Information
  if (data.caregiverName) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Caregiver Information', margin, y);
    y = addField(doc, 'Caregiver Name', data.caregiverName, margin, y, contentWidth);
    y = addField(doc, 'Caregiver Contact', data.caregiverContact || '', margin, y, contentWidth);
    y = addField(doc, 'Caregiver Address', data.caregiverAddress || '', margin, y, contentWidth);
  }
  
  return y;
};

const addShortLettersContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Written Letters
  if (data.writtenLetters && data.writtenLetters.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Written Letters', margin, y);
    data.writtenLetters.forEach((letter: any, index: number) => {
      if (letter.recipient || letter.message) {
        y = addField(doc, `Letter ${index + 1} - To`, letter.recipient || '', margin, y, contentWidth);
        y = addField(doc, 'Message', letter.message || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Video or Audio Messages
  if (data.videoAudioMessages && data.videoAudioMessages.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Video or Audio Messages', margin, y);
    data.videoAudioMessages.forEach((message: any, index: number) => {
      if (message.recipient || message.description) {
        y = addField(doc, `Message ${index + 1} - To`, message.recipient || '', margin, y, contentWidth);
        y = addField(doc, 'Description', message.description || '', margin, y, contentWidth);
        y = addField(doc, 'Location', message.location || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Final Reflections & Blessings
  if (data.finalReflectionsBlessings && data.finalReflectionsBlessings.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Final Reflections & Blessings', margin, y);
    data.finalReflectionsBlessings.forEach((reflection: any, index: number) => {
      if (reflection.recipient || reflection.message) {
        y = addField(doc, `Reflection ${index + 1} - To`, reflection.recipient || '', margin, y, contentWidth);
        y = addField(doc, 'Message', reflection.message || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // General Delivery Instructions
  if (data.generalDeliveryInstructions) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'General Delivery Instructions', margin, y);
    y = addField(doc, 'Instructions', data.generalDeliveryInstructions, margin, y, contentWidth);
  }
  
  return y;
};

const addFinalWishesContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Ethical Will or Values Statement
  if (data.ethicalWillValuesStatement) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Ethical Will or Values Statement', margin, y);
    y = addField(doc, 'Statement', data.ethicalWillValuesStatement, margin, y, contentWidth);
  }
  
  // Creative or Personal Legacy Projects
  if (data.creativePersonalLegacyProjects && data.creativePersonalLegacyProjects.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Creative or Personal Legacy Projects', margin, y);
    data.creativePersonalLegacyProjects.forEach((project: any, index: number) => {
      if (project.description || project.status) {
        y = addField(doc, `Project ${index + 1} - Description`, project.description || '', margin, y, contentWidth);
        y = addField(doc, 'Status', project.status || '', margin, y, contentWidth);
        y = addField(doc, 'Instructions', project.instructions || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Charitable Donations or Scholarships
  if (data.charitableDonationsScholarships && data.charitableDonationsScholarships.length > 0) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Charitable Donations or Scholarships', margin, y);
    data.charitableDonationsScholarships.forEach((donation: any, index: number) => {
      if (donation.organization || donation.amount) {
        y = addField(doc, `Donation ${index + 1} - Organization`, donation.organization || '', margin, y, contentWidth);
        y = addField(doc, 'Amount', donation.amount || '', margin, y, contentWidth);
        y = addField(doc, 'Purpose', donation.purpose || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Life Lessons, Sayings, and Humor
  if (data.lifeLessonsSayingsHumor) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Life Lessons, Sayings, and Humor', margin, y);
    y = addField(doc, 'Content', data.lifeLessonsSayingsHumor, margin, y, contentWidth);
  }
  
  // Family Traditions, Archives, and Recipes
  if (data.familyTraditionsArchivesRecipes) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Family Traditions, Archives, and Recipes', margin, y);
    y = addField(doc, 'Content', data.familyTraditionsArchivesRecipes, margin, y, contentWidth);
  }
  
  // Wishes for How to Be Remembered
  if (data.wishesForHowToBeRemembered) {
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    y = addSectionHeader(doc, 'Wishes for How to Be Remembered', margin, y);
    y = addField(doc, 'Wishes', data.wishesForHowToBeRemembered, margin, y, contentWidth);
  }
  
  return y;
};

const addBucketListContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  // Debug: Log the data being received
  console.log('=== PDF Bucket List Data ===');
  console.log('Full data object:', data);
  console.log('placesToVisit:', data.placesToVisit);
  console.log('projectsToComplete:', data.projectsToComplete);
  console.log('messagesUnsaid:', data.messagesUnsaid);
  console.log('hopesForFamily:', data.hopesForFamily);
  console.log('timeSensitiveEvents:', data.timeSensitiveEvents);
  console.log('farewellLetterWritten:', data.farewellLetterWritten);
  console.log('farewellLetterLocation:', data.farewellLetterLocation);
  console.log('additionalReflections:', data.additionalReflections);
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Places to Visit
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Places to Visit', margin, y);
  if (data.placesToVisit && data.placesToVisit.length > 0) {
    data.placesToVisit.forEach((place: any, index: number) => {
      if (place.place && place.place.trim()) {
        y = addField(doc, `Place ${index + 1}`, place.place || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Projects to Complete
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Projects to Complete', margin, y);
  if (data.projectsToComplete && data.projectsToComplete.length > 0) {
    data.projectsToComplete.forEach((project: any, index: number) => {
      if (project.project && project.project.trim()) {
        y = addField(doc, `Project ${index + 1}`, project.project || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Messages Left Unsaid
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Messages Left Unsaid', margin, y);
  if (data.messagesUnsaid && data.messagesUnsaid.length > 0) {
    data.messagesUnsaid.forEach((message: any, index: number) => {
      if (message.toWhom || message.messageSummary) {
        y = addField(doc, `Message ${index + 1} - To`, message.toWhom || '', margin, y, contentWidth);
        y = addField(doc, 'Message', message.messageSummary || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Hopes for Family's Future
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Hopes for Family\'s Future', margin, y);
  if (data.hopesForFamily && data.hopesForFamily.length > 0) {
    data.hopesForFamily.forEach((hope: any, index: number) => {
      if (hope.lettersOrNotes || hope.whatToRemember) {
        y = addField(doc, `Hope ${index + 1} - Letters/Notes`, hope.lettersOrNotes || '', margin, y, contentWidth);
        y = addField(doc, 'What to Remember', hope.whatToRemember || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Time-Sensitive Events or Instructions
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Time-Sensitive Events or Instructions', margin, y);
  if (data.timeSensitiveEvents && data.timeSensitiveEvents.length > 0) {
    data.timeSensitiveEvents.forEach((event: any, index: number) => {
      if (event.event || event.dateTrigger) {
        y = addField(doc, `Event ${index + 1}`, event.event || '', margin, y, contentWidth);
        y = addField(doc, 'Date/Trigger', event.dateTrigger || '', margin, y, contentWidth);
        y += 5;
      }
    });
  }
  
  // Closing Thoughts or Farewell Letter
  if (!hasEnoughSpace(y, 100)) {
    doc.addPage();
    y = 65;
    addLogoToPage(doc, margin);
  }
  y = addSectionHeader(doc, 'Closing Thoughts or Farewell Letter', margin, y);
  if (data.farewellLetterWritten) {
    y = addField(doc, 'Letter Written', data.farewellLetterWritten, margin, y, contentWidth);
  }
  if (data.farewellLetterLocation) {
    y = addField(doc, 'Location of Letter', data.farewellLetterLocation, margin, y, contentWidth);
  }
  if (data.additionalReflections) {
    y = addField(doc, 'Additional Reflections', data.additionalReflections, margin, y, contentWidth);
  }
  
  return y;
};

const addGenericContent = (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): number => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Generic content display - show all non-empty fields
  Object.entries(data).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      y = addField(doc, label, value, margin, y, contentWidth);
    } else if (Array.isArray(value) && value.length > 0) {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      y = addSectionHeader(doc, label, margin, y);
      value.forEach((item: any, index: number) => {
        if (typeof item === 'string') {
          y = addField(doc, `Item ${index + 1}`, item, margin, y, contentWidth);
        } else if (typeof item === 'object') {
          Object.entries(item).forEach(([itemKey, itemValue]) => {
            if (itemValue && typeof itemValue === 'string' && itemValue.trim() !== '') {
              const itemLabel = itemKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              y = addField(doc, `${itemLabel} ${index + 1}`, itemValue, margin, y, contentWidth);
            }
          });
        }
        y += 5;
      });
    }
  });
  
  return y;
};

const addFileUploadsContent = async (doc: jsPDF, data: any, margin: number, startY: number, contentWidth: number): Promise<number> => {
  let y = startY;
  
  doc.setFontSize(12);
  doc.setTextColor(21, 58, 75);
  doc.setFont('helvetica', 'normal');
  
  // Debug: Log the data being received
  console.log('=== PDF File Uploads Data ===');
  console.log('Full data object:', data);
  console.log('uploadedFiles:', data.uploadedFiles);
  console.log('uploadedFiles length:', data.uploadedFiles?.length);
  
  // Import QR code library
  const QRCode = await import('qrcode');
  
  // Add Instructions for Loved Ones section first
  if (data.uploadInstructions && data.uploadInstructions.trim()) {
    y = addSectionHeader(doc, 'Instructions for Loved Ones', margin, y);
    
    // Add instructions text in full width
    doc.setFontSize(12);
    doc.setTextColor(21, 58, 75);
    doc.setFont('helvetica', 'normal');
    
    const instructions = data.uploadInstructions;
    const lines = doc.splitTextToSize(instructions, contentWidth);
    
    lines.forEach((line: string) => {
      if (!hasEnoughSpace(y, 8)) {
        doc.addPage();
        y = 65;
        addLogoToPage(doc, margin);
      }
      doc.text(line, margin, y);
      y += 8;
    });
    y += 10; // Add extra spacing after instructions
  }
  
  // Check if there are uploaded files
  if (data.uploadedFiles && data.uploadedFiles.length > 0) {
    y = addSectionHeader(doc, 'Uploaded Files & Multimedia Memories', margin, y);
    
    // Group files by category, but skip the "Other" category label
    const filesByCategory = data.uploadedFiles.reduce((acc: any, file: any) => {
      const category = file.fileCategory || file.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(file);
      return acc;
    }, {});
    
    // Process each category
    for (const [category, files] of Object.entries(filesByCategory)) {
      // Check if we need a new page for this category
      const estimatedSpace = (files as any[]).length * 60; // Space for QR code + text
      if (!hasEnoughSpace(y, estimatedSpace)) {
        doc.addPage();
        y = 65;
        addLogoToPage(doc, margin);
      }
      
      // Skip adding category header for "Other" or "Uncategorized"
      if (category !== 'Other' && category !== 'Uncategorized') {
        y = addSectionHeader(doc, category, margin, y);
      }
      
      // Process each file in the category
      for (const file of files as any[]) {
        try {
          // Generate QR code for the direct file URL (not JSON metadata)
          const fileUrl = file.fileUrl || file.url || '';
          const qrCodeDataURL = await QRCode.toDataURL(fileUrl, {
            width: 100,
            margin: 2,
            color: {
              dark: '#17394B', // SkillBinder blue
              light: '#FFFFFF'
            }
          });
          
          // Add QR code image to PDF
          const qrCodeSize = 25; // Size in mm
          doc.addImage(qrCodeDataURL, 'PNG', margin, y, qrCodeSize, qrCodeSize);
          
          // Add file information to the right of the QR code
          const textX = margin + qrCodeSize + 10;
          const textY = y + 5;
          
          doc.setFontSize(12);
          doc.setTextColor(21, 58, 75);
          doc.setFont('helvetica', 'bold');
          doc.text(`${file.displayName || file.fileName || file.name || 'Unnamed File'}`, textX, textY);
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          // Add file type name with text-based icon and actual file extension
          const fileType = file.fileType || file.type || 'other';
          const fileExtension = file.fileExtension || file.originalFileName?.split('.').pop()?.toUpperCase() || 'FILE';
          const fileTypeIcon = fileType === 'video' ? '[VIDEO]' : 
                              fileType === 'audio' ? '[AUDIO]' : 
                              fileType === 'document' ? '[DOC]' : 
                              fileType === 'image' ? '[IMG]' : '[FILE]';
          doc.text(`${fileTypeIcon} ${fileExtension}`, textX, textY + 5);
          
          if (file.description) {
            doc.text(`Description: ${file.description}`, textX, textY + 10);
          }
          
          if (file.uploadDate) {
            doc.text(`Uploaded: ${file.uploadDate}`, textX, textY + 15);
          }
          
          // Move to next position
          y += qrCodeSize + 10;
          
        } catch (error) {
          console.error('Error generating QR code for file:', file, error);
          
          // Fallback: just show file information without QR code
          y = addField(doc, '', file.displayName || file.fileName || file.name || 'Unnamed File', margin, y, contentWidth);
          const fileType = file.fileType || file.type || 'other';
          const fileExtension = file.fileExtension || file.originalFileName?.split('.').pop()?.toUpperCase() || 'FILE';
          const fileTypeIcon = fileType === 'video' ? '[VIDEO]' : 
                              fileType === 'audio' ? '[AUDIO]' : 
                              fileType === 'document' ? '[DOC]' : 
                              fileType === 'image' ? '[IMG]' : '[FILE]';
          y = addField(doc, 'File Type', `${fileTypeIcon} ${fileExtension}`, margin, y, contentWidth);
          if (file.description) {
            y = addField(doc, 'Description', file.description, margin, y, contentWidth);
          }
          y += 5;
        }
      }
    }
  } else {
    // No files uploaded
    y = addSectionHeader(doc, 'Uploaded Files & Multimedia Memories', margin, y);
    y = addField(doc, 'Status', 'No files have been uploaded yet.', margin, y, contentWidth);
  }
  
  // Add Final Notes for Loved Ones section at the end
  if (data.legacyInstructions && data.legacyInstructions.trim()) {
    // Check if we need a new page
    if (!hasEnoughSpace(y, 100)) {
      doc.addPage();
      y = 65;
      addLogoToPage(doc, margin);
    }
    
    y = addSectionHeader(doc, 'Final Notes for Loved Ones', margin, y);
    
    // Add final notes text in full width
    doc.setFontSize(12);
    doc.setTextColor(21, 58, 75);
    doc.setFont('helvetica', 'normal');
    
    const notes = data.legacyInstructions;
    const lines = doc.splitTextToSize(notes, contentWidth);
    
    lines.forEach((line: string) => {
      if (!hasEnoughSpace(y, 8)) {
        doc.addPage();
        y = 65;
        addLogoToPage(doc, margin);
      }
      doc.text(line, margin, y);
      y += 8;
    });
    y += 10; // Add extra spacing after notes
  }
  
  return y;
};