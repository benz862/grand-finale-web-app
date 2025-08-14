import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register fonts
Font.register({
  family: 'Times-Roman',
  src: 'https://fonts.gstatic.com/s/timesroman/v1/Times-Roman.ttf',
});

Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf',
});

// Brand colors
const COLORS = {
  skillBinderBlue: '#17394B',
  skillBinderYellow: '#E3B549',
  textDark: '#333333',
  textLight: '#666666',
  background: '#FFFFFF',
};

// Styles
const styles = StyleSheet.create({
  // Page layouts
  page: {
    padding: 36, // 0.5 inches
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.textDark,
    lineHeight: 1.6,
  },
  
  // Cover page - updated to match the design
  coverPage: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  coverImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for text readability
  },
  coverContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  mainTitle: {
    fontSize: 48,
    fontFamily: 'Times-Roman',
    color: COLORS.skillBinderYellow,
    textAlign: 'left',
    marginBottom: 12,
    lineHeight: 1.2,
  },
  tagline: {
    fontSize: 20,
    fontFamily: 'Times-Roman',
    color: COLORS.skillBinderYellow,
    textAlign: 'left',
    marginBottom: 12,
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Times-Roman',
    color: COLORS.skillBinderYellow,
    textAlign: 'left',
    marginBottom: 40,
    lineHeight: 1.4,
  },
  logoContainer: {
    position: 'absolute',
    bottom: 60,
    left: 60,
  },
  logoGraphic: {
    width: 40,
    height: 30,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: COLORS.skillBinderBlue,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  logoTagline: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: COLORS.textLight,
  },
  preparedFor: {
    position: 'absolute',
    bottom: 60,
    right: 60,
    fontSize: 16,
    color: COLORS.skillBinderYellow,
    fontFamily: 'Times-Roman',
    textAlign: 'right',
  },
  generatedOn: {
    position: 'absolute',
    bottom: 40,
    right: 60,
    fontSize: 12,
    color: COLORS.skillBinderYellow,
    fontFamily: 'Times-Roman',
    textAlign: 'right',
  },

  // Table of Contents
  tocPage: {
    padding: 36,
  },
  tocTitle: {
    fontSize: 24,
    fontFamily: 'Times-Roman',
    color: COLORS.skillBinderYellow,
    textAlign: 'center',
    marginBottom: 30,
  },
  tocEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 14,
  },
  tocText: {
    color: COLORS.textDark,
    fontFamily: 'Helvetica',
  },
  tocPageNumber: {
    color: COLORS.skillBinderYellow,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },

  // Section cover pages - updated to match the design
  sectionCover: {
    padding: 36,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 40,
  },
  sectionMainTitle: {
    fontSize: 24,
    fontFamily: 'Times-Roman',
    color: COLORS.skillBinderYellow,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTagline: {
    fontSize: 14,
    fontFamily: 'Helvetica',
    color: COLORS.skillBinderBlue,
    textAlign: 'center',
    marginBottom: 40,
  },
  sectionNumber: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: COLORS.skillBinderBlue,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Times-Roman',
    color: COLORS.skillBinderYellow,
    textAlign: 'center',
    marginBottom: 40,
  },

  // Content pages
  contentPage: {
    padding: 36,
    lineHeight: 1.6,
  },
  sectionHeader: {
    fontSize: 20,
    fontFamily: 'Helvetica',
    color: COLORS.skillBinderBlue,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 1.4,
  },
  subsectionHeader: {
    fontSize: 18,
    fontFamily: 'Helvetica',
    color: COLORS.skillBinderBlue,
    marginBottom: 16,
    marginTop: 24,
    lineHeight: 1.3,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  fieldLabel: {
    width: '30%',
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.textDark,
    fontWeight: 'bold',
    lineHeight: 1.4,
  },
  fieldValue: {
    width: '70%',
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.textDark,
    lineHeight: 1.4,
  },

  // Tables
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.textLight,
  },
  tableHeaderCell: {
    padding: 10,
    fontSize: 12,
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    color: COLORS.textDark,
    lineHeight: 1.3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tableCell: {
    padding: 10,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: COLORS.textDark,
    lineHeight: 1.3,
  },

  // Footer
  footer: {
    marginTop: 40,
    flexDirection: 'row',
    fontSize: 10,
    color: COLORS.textLight,
    fontFamily: 'Helvetica',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTop: '1px solid #ccc'
  },
  footerLeft: {
    flex: 1,
    textAlign: 'left',
  },
  footerCenter: {
    flex: 1,
    textAlign: 'center',
  },
  footerRight: {
    flex: 1,
    textAlign: 'right',
  },
  // Page numbering (deprecated - now part of footer)
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    fontSize: 10,
    color: COLORS.textLight,
    fontFamily: 'Helvetica',
  },
});

// Cover Page Component - updated to match the design
const CoverPage = ({ coverImage, firstName, lastName, generatedDate }) => {
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : 'User';
  
  return (
    <Page size="LETTER" style={styles.coverPage}>
      <Image src={coverImage} style={styles.coverImage} />
      <View style={styles.coverOverlay} />
      <View style={styles.coverContent}>
        {/* Main title and tagline */}
        <View>
          <Text style={styles.mainTitle}>THE GRAND{'\n'}FINALE</Text>
          <Text style={styles.tagline}>A well planned goodbye</Text>
          <Text style={styles.subtitle}>A Comprehensive End-of-Life Planner & Journal</Text>
        </View>
        
        {/* Logo and branding */}
        <View style={styles.logoContainer}>
          <Image src="/skillbinder_logo_with_guides.jpg" style={styles.logoGraphic} />
          <Text style={styles.logoText}>SkillBinder</Text>
          <Text style={styles.logoTagline}>Guides for life's complexities</Text>
        </View>
      </View>
      
      {/* Personalized information */}
      <Text style={styles.preparedFor}>
        Prepared for: {fullName}
      </Text>
      <Text style={styles.generatedOn}>
        Generated on: {format(new Date(generatedDate), 'MMMM d, yyyy')}
      </Text>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>
          Prepared for: {fullName}
        </Text>
        <Text
          style={styles.footerCenter}
          render={({ pageNumber, totalPages }) => `- Page ${pageNumber} of ${totalPages} -`}
        />
        <Text style={styles.footerRight}>
          Generated on: {format(new Date(generatedDate), 'MMMM d, yyyy')}
        </Text>
      </View>
    </Page>
  );
};

// Table of Contents Component
const TableOfContents = ({ sections, pageNumbers, userData, generatedDate = new Date() }) => {
  // Extract user name from various possible locations
  const firstName =
    userData?.firstName ||
    userData?.basic_information?.firstName ||
    userData?.personal_info?.firstName ||
    '';
  const lastName =
    userData?.lastName ||
    userData?.basic_information?.lastName ||
    userData?.personal_info?.lastName ||
    '';
  const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : '—';

  return (
    <Page size="LETTER" style={styles.tocPage}>
      <Text style={styles.tocTitle}>Table of Contents</Text>
      {sections.map((section, index) => (
        <View key={section.section_number} style={styles.tocEntry}>
          <Text style={styles.tocText}>
            Section {section.section_number}: {section.section_title}
          </Text>
          <Text style={styles.tocPageNumber}>
            {pageNumbers[section.section_number]}
          </Text>
        </View>
      ))}
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>
          Prepared for: {fullName}
        </Text>
        <Text
          style={styles.footerCenter}
          render={({ pageNumber, totalPages }) => `- Page ${pageNumber} of ${totalPages} -`}
        />
        <Text style={styles.footerRight}>
          Generated on: {format(new Date(generatedDate), 'MMMM d, yyyy')}
        </Text>
      </View>
    </Page>
  );
};

// Section Cover Page Component - updated to match the design
const SectionCoverPage = ({ sectionNumber, sectionTitle, logoUrl, userData, generatedDate = new Date() }) => {
  // Extract user name from various possible locations
  const firstName =
    userData?.firstName ||
    userData?.basic_information?.firstName ||
    userData?.personal_info?.firstName ||
    '';
  const lastName =
    userData?.lastName ||
    userData?.basic_information?.lastName ||
    userData?.personal_info?.lastName ||
    '';
  const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : '—';

  return (
    <Page size="LETTER" style={styles.sectionCover}>
      <Image src={logoUrl} style={styles.logo} />
      <Text style={styles.sectionNumber}>Section {sectionNumber}</Text>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>
          Prepared for: {fullName}
        </Text>
        <Text
          style={styles.footerCenter}
          render={({ pageNumber, totalPages }) => `- Page ${pageNumber} of ${totalPages} -`}
        />
        <Text style={styles.footerRight}>
          Generated on: {format(new Date(generatedDate), 'MMMM d, yyyy')}
        </Text>
      </View>
    </Page>
  );
};

// Subsection Component
const Subsection = ({ title, type, data, columns }) => {
  if (type === 'table') {
    return (
      <View>
        <Text style={styles.subsectionHeader}>{title}</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {columns.map((column, index) => (
              <Text key={index} style={[styles.tableHeaderCell, { flex: 1 }]}>
                {column}
              </Text>
            ))}
          </View>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {columns.map((column, colIndex) => (
                <Text key={colIndex} style={[styles.tableCell, { flex: 1 }]}>
                  {row[column.toLowerCase().replace(' ', '_')] || ''}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (type === 'list') {
    return (
      <View>
        <Text style={styles.subsectionHeader}>{title}</Text>
        {data.map((item, index) => (
          <View key={index} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{item.label}:</Text>
            <Text style={styles.fieldValue}>{item.value || ''}</Text>
          </View>
        ))}
      </View>
    );
  }

  return null;
};

// Content Page Component
const ContentPage = ({ sectionNumber, sectionTitle, subsections, userData, isFirstPage = false, generatedDate = new Date() }) => {
  // Extract user name from various possible locations
  const firstName =
    userData?.firstName ||
    userData?.basic_information?.firstName ||
    userData?.personal_info?.firstName ||
    '';
  const lastName =
    userData?.lastName ||
    userData?.basic_information?.lastName ||
    userData?.personal_info?.lastName ||
    '';
  const fullName = (firstName || lastName) ? `${firstName} ${lastName}`.trim() : '—';

  return (
    <Page size="LETTER" style={styles.contentPage}>
      {isFirstPage && (
        <Text style={styles.sectionHeader}>
          Section {sectionNumber} – {sectionTitle}
        </Text>
      )}
      {subsections.map((subsection, index) => (
        <Subsection
          key={index}
          title={subsection.title}
          type={subsection.type}
          data={userData[subsection.key] || []}
          columns={subsection.columns}
        />
      ))}
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>
          Prepared for: {fullName}
        </Text>
        <Text
          style={styles.footerCenter}
          render={({ pageNumber, totalPages }) => `- Page ${pageNumber} of ${totalPages} -`}
        />
        <Text style={styles.footerRight}>
          Generated on: {format(new Date(generatedDate), 'MMMM d, yyyy')}
        </Text>
      </View>
    </Page>
  );
};

// Main PDF Document Component
export const GrandFinalePDF = ({ 
  userData, 
  coverImage, 
  logoUrl, 
  sections = [],
  generatedDate = new Date() 
}) => {
  // Calculate page numbers for TOC
  const pageNumbers = {};
  let currentPage = 3; // Start after cover and TOC
  
  sections.forEach(section => {
    pageNumbers[section.section_number] = currentPage;
    // Add pages for section cover + content pages
    currentPage += 1; // Section cover
    // Estimate content pages (this would need more sophisticated calculation)
    currentPage += Math.ceil(section.subsections.length / 2);
  });

  return (
    <Document>
      {/* Cover Page */}
      <CoverPage 
        coverImage={coverImage}
        firstName={userData.firstName}
        lastName={userData.lastName}
        generatedDate={generatedDate}
      />
      
      {/* Table of Contents */}
      <TableOfContents sections={sections} pageNumbers={pageNumbers} userData={userData} generatedDate={generatedDate} />
      
      {/* Section Pages */}
      {sections.map((section, sectionIndex) => (
        <React.Fragment key={section.section_number}>
          {/* Section Cover Page */}
          <SectionCoverPage 
            sectionNumber={section.section_number}
            sectionTitle={section.section_title}
            logoUrl={logoUrl}
            userData={userData}
            generatedDate={generatedDate}
          />
          
          {/* Section Content Pages */}
          <ContentPage 
            sectionNumber={section.section_number}
            sectionTitle={section.section_title}
            subsections={section.subsections}
            userData={userData}
            isFirstPage={true}
            generatedDate={generatedDate}
          />
        </React.Fragment>
      ))}
    </Document>
  );
};

// Helper function to generate PDF
export const generateFullBookPDF = async (userData: any, options: {
  coverImage?: string;
  logoUrl?: string;
  sections?: any[];
  generatedDate?: Date;
} = {}) => {
  const {
    coverImage = '/cover-background.jpg',
    logoUrl = '/SkillBinder_Logo_250px_tall.png',
    sections = [],
    generatedDate = new Date()
  } = options;

  return (
    <GrandFinalePDF
      userData={userData}
      coverImage={coverImage}
      logoUrl={logoUrl}
      sections={sections}
      generatedDate={generatedDate}
    />
  );
}; 