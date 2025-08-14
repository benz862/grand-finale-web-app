import React from 'react';
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  Font
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { getSectionConfig, SectionConfig } from './sectionConfigs';

// Register fonts
Font.register({
  family: 'Times-Roman',
  src: 'https://fonts.gstatic.com/s/timesroman/v1/Times-Roman.ttf',
});

Font.register({
  family: 'Helvetica',
  src: 'https://fonts.gstatic.com/s/helvetica/v1/Helvetica.ttf',
});

// ---- Styles ----
const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#333',
    lineHeight: 1.6
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  logo: {
    width: 200,
    alignSelf: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    color: '#E3B549',
    fontFamily: 'Times-Roman',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    color: '#E3B549',
    fontFamily: 'Times-Roman',
    marginVertical: 10,
    lineHeight: 1.4
  },
  subsection: {
    marginBottom: 20
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  table: {
    width: 'auto',
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  tableRow: {
    flexDirection: 'row'
  },
  tableColHeader: {
    backgroundColor: '#E3B549',
    padding: 5,
    fontWeight: 'bold',
    color: '#fff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    lineHeight: 1.3
  },
  tableColMedication: {
    width: '50%',
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    lineHeight: 1.3
  },
  tableColDosage: {
    width: '15%',
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    lineHeight: 1.3
  },
  tableColFrequency: {
    width: '15%',
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    lineHeight: 1.3
  },
  tableColReason: {
    width: '20%',
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    lineHeight: 1.3
  },
  tableCol: {
    width: '25%',
    padding: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
    lineHeight: 1.3
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: 'row',
    fontSize: 10,
    color: '#555',
    zIndex: 1000
  },
  footerLeft: {
    flex: 1,
    textAlign: 'left'
  },
  footerCenter: {
    flex: 1,
    textAlign: 'center'
  },
  footerRight: {
    flex: 1,
    textAlign: 'right'
  }
});

// ---- Individual Section PDF Component ----
export const SectionPDF = ({
  sectionNumber,
  userData,
  generatedDate = new Date(),
  logoUrl = '/skillbinder_logo_with_guides.jpg'
}) => {
  const sectionConfig = getSectionConfig(sectionNumber);
  
  if (!sectionConfig) {
    return (
      <Document>
        <Page size="LETTER" style={styles.page}>
          <Text style={styles.sectionTitle}>
            Section {sectionNumber} - Not Found
          </Text>
        </Page>
      </Document>
    );
  }

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
  
  // Debug logging for footer
  console.log('PDF Footer Debug:', {
    firstName,
    lastName,
    fullName,
    userData: userData ? Object.keys(userData) : 'No userData'
  });

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Section Header */}
        <View style={styles.header}>
          <Image src={logoUrl} style={styles.logo} />
          <Text style={styles.sectionTitle}>
            Section {sectionNumber}: {sectionConfig.section_title}
          </Text>
        </View>

        {/* Section Content */}
        <View style={{ marginBottom: 80 }}> {/* Add margin to make room for footer */}
          {sectionConfig.subsections.map((subsection, subIdx) => (
          <View key={subIdx} style={styles.subsection} wrap={false}>
            <Text style={styles.sectionTitle}>{subsection.title}</Text>
            
                         {/* List Subsection */}
             {subsection.type === 'list' && subsection.fields && (
               <>
                 {subsection.fields.map((field, fieldIdx) => {
                   // Try to get data from subsection key first, then from top level
                   const subsectionData = userData[subsection.key];
                   const topLevelData = userData[field.key];
                   const data = subsectionData || topLevelData;
                   let value = '';
                   
                   if (data) {
                     if (Array.isArray(data)) {
                       // Handle arrays (phones, addresses, contacts, etc.)
                       if (data.length > 0) {
                         value = data.map((item, idx) => {
                           if (typeof item === 'object') {
                             // Special handling for emergency contacts
                             if (item.name && (item.authorized !== undefined || item.emergency !== undefined)) {
                               const contactInformation = [
                                 item.name,
                                 item.relationship,
                                 item.phone,
                                 item.email
                               ].filter(v => v).join(' - ');
                               
                               const flags = [];
                               if (item.authorized !== undefined) {
                                 flags.push(`Authorized: ${item.authorized}`);
                               }
                               if (item.emergency !== undefined) {
                                 flags.push(`Primary Emergency: ${item.emergency}`);
                               }
                               
                                                               return contactInformation + (flags.length > 0 ? ` (${flags.join(', ')})` : '');
                             }
                             
                             // Special handling for executors
                             if (item.full_name && (item.aware !== undefined || item.accepted !== undefined)) {
                               const executorInformation = [
                                 item.full_name,
                                 item.relationship,
                                 item.phone,
                                 item.email
                               ].filter(v => v).join(' - ');
                               
                               const flags = [];
                               if (item.aware !== undefined) {
                                 flags.push(`Aware: ${item.aware}`);
                               }
                               if (item.accepted !== undefined) {
                                 flags.push(`Accepted: ${item.accepted}`);
                               }
                               
                                                               return executorInformation + (flags.length > 0 ? ` (${flags.join(', ')})` : '');
                             }
                             
                             // Special handling for physicians
                             if (item.fullName && item.specialty) {
                               const physicianInformation = [
                                 item.fullName,
                                 item.specialty,
                                 item.clinic,
                                 item.phone
                               ].filter(v => v).join(' - ');
                               
                               if (item.emergencyContact) {
                                                                 return physicianInformation + ` (Emergency: ${item.emergencyContact})`;
                              }
                              return physicianInformation;
                             }
                             
                             // Special handling for medications
                             if (item.name && item.dosage) {
                               const medInformation = [
                                 item.name,
                                 item.dosage,
                                 item.frequency
                               ].filter(v => v).join(' - ');
                               
                               if (item.reason) {
                                                                 return medInformation + ` (Reason: ${item.reason})`;
                              }
                              return medInformation;
                             }
                             
                             // Special handling for chronic illnesses
                             if (item.condition && item.diagnosedDate) {
                               const illnessInformation = [
                                 item.condition,
                                 item.diagnosedDate
                               ].filter(v => v).join(' - ');
                               
                               if (item.notes) {
                                                                 return illnessInformation + ` (Notes: ${item.notes})`;
                              }
                              return illnessInformation;
                             }
                             
                             // Special handling for surgeries
                             if (item.procedure && item.date) {
                               const surgeryInformation = [
                                 item.procedure,
                                 item.date,
                                 item.hospital
                               ].filter(v => v).filter(v => v).join(' - ');
                               
                               if (item.notes) {
                                                                 return surgeryInformation + ` (Notes: ${item.notes})`;
                              }
                              return surgeryInformation;
                             }
                             
                             // Special handling for hospitalizations
                             if (item.reason && item.date) {
                               const hospInformation = [
                                 item.reason,
                                 item.date,
                                 item.hospital
                               ].filter(v => v).join(' - ');
                               
                               if (item.notes) {
                                                                 return hospInformation + ` (Notes: ${item.notes})`;
                              }
                              return hospInformation;
                             }
                             
                             // Special handling for lawyers
                             if (item.name && item.specialty) {
                               const lawyerInformation = [
                                 item.name,
                                 item.specialty,
                                 item.firm,
                                 item.phone
                               ].filter(v => v).join(' - ');
                               
                               if (item.email) {
                                                                 return lawyerInformation + ` (Email: ${item.email})`;
                              }
                              return lawyerInformation;
                             }
                             
                             // Special handling for phones
                             if (item.type && item.number) {
                               return `${item.type}: ${item.number}`;
                             }
                             
                             // Special handling for addresses
                             if (item.street && item.city) {
                               const addressParts = [
                                 item.type,
                                 item.street,
                                 item.city,
                                 item.province,
                                 item.country,
                                 item.postal
                               ].filter(v => v).join(' - ');
                               return addressParts;
                             }
                             
                             // Special handling for passports
                             if (item.country && item.number) {
                               const passportInformation = [
                                 item.country,
                                 item.number
                               ].filter(v => v).join(' - ');
                               
                               if (item.expiry) {
                                                                 return passportInformation + ` (Expires: ${item.expiry})`;
                              }
                              return passportInformation;
                             }
                             
                             // Special handling for children
                             if (item.name && item.age) {
                               const childInformation = [
                                 item.name,
                                 item.age,
                                 item.gender
                               ].filter(v => v).join(' - ');
                               return childInformation;
                             }
                             
                             // Special handling for schools
                             if (item.name && item.degree) {
                               const schoolInfo = [
                                 item.name,
                                 item.degree,
                                 item.location
                               ].filter(v => v).join(' - ');
                               
                               if (item.start && item.end) {
                                 return schoolInfo + ` (${item.start} - ${item.end})`;
                               }
                               return schoolInfo;
                             }
                             
                             // Default handling for other objects
                             return Object.values(item).filter(v => v).join(' - ');
                           }
                           return item;
                         }).join('\n'); // Use line breaks instead of commas for better separation
                       } else {
                         value = 'None provided';
                       }
                     } else if (typeof data === 'object' && data[field.key]) {
                       // Handle nested objects
                       const nestedData = data[field.key];
                       if (Array.isArray(nestedData)) {
                         value = nestedData.map((item, idx) => {
                           if (typeof item === 'object') {
                             return Object.values(item).filter(v => v).join(' - ');
                           }
                           return item;
                         }).join(', ');
                       } else {
                         value = nestedData || '';
                       }
                     } else {
                       // Handle simple values
                       value = data || '';
                     }
                   } else {
                     // For flattened data structure, try direct access
                     value = userData[field.key] || '';
                     
                     // Add context for radio button fields
                     if (value === 'Yes' || value === 'No') {
                       const contextMap: { [key: string]: string } = {
                         'organDonor': 'Organ Donor',
                         'livingWill': 'Living Will',
                         'dnr': 'DNR Order',
                         'has_will': 'Has Will',
                         'trust_exists': 'Trust Exists',
                         'healthcare_proxy': 'Healthcare Proxy',
                         'safe_exists': 'Safe Exists',
                         'deposit_box_exists': 'Safe Deposit Box',
                         'digital_will_exists': 'Digital Will',
                         'burial_cremation': 'Burial/Cremation',
                         'poa_exists': 'Power of Attorney'
                       };
                       
                                                const context = contextMap[field.key];
                         if (context) {
                           value = `${context}: ${value}`;
                         } else {
                           // Add context for other common fields
                           const otherContextMap: { [key: string]: string } = {
                             'gender': 'Gender',
                             'employmentStatus': 'Employment Status',
                             'relationshipStatus': 'Relationship Status',
                             'religiousAffiliation': 'Religious Affiliation',
                             'primaryLanguage': 'Primary Language',
                             'secondaryLanguage': 'Secondary Language'
                           };
                           
                           const otherContext = otherContextMap[field.key];
                           if (otherContext && value) {
                             value = `${otherContext}: ${value}`;
                           }
                         }
                     }
                   }
                   
                   return (
                     <Text key={fieldIdx} style={{ marginBottom: 6 }}>
                       <Text style={styles.label}>{field.label}:</Text>{' '}
                       {typeof value === 'object' && value !== null
                         ? Object.values(value).filter(Boolean).join(' | ')
                         : value || '—'}
                     </Text>
                   );
                 })}
               </>
             )}
            
            {/* Table Subsection */}
            {subsection.type === 'table' && (
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                  {subsection.columns.map((col, colIdx) => {
                    // Choose the appropriate column style based on column name
                    let columnStyle = styles.tableColHeader;
                    if (col === 'Medication Name') {
                      columnStyle = { ...styles.tableColHeader, ...styles.tableColMedication };
                    } else if (col === 'Dosage') {
                      columnStyle = { ...styles.tableColHeader, ...styles.tableColDosage };
                    } else if (col === 'Frequency') {
                      columnStyle = { ...styles.tableColHeader, ...styles.tableColFrequency };
                    } else if (col === 'Reason') {
                      columnStyle = { ...styles.tableColHeader, ...styles.tableColReason };
                    }
                    
                    return (
                      <Text key={colIdx} style={columnStyle}>{col}</Text>
                    );
                  })}
                </View>
                {/* Table Rows */}
                {(() => {
                  const tableData = userData[subsection.key];
                  if (Array.isArray(tableData) && tableData.length > 0) {
                    return tableData.map((row, rowIdx) => (
                      <View key={rowIdx} style={styles.tableRow}>
                        {subsection.columns.map((column, cellIdx) => {
                          // Map column names to actual data keys
                          const columnMapping: { [key: string]: string } = {
                            'Medication Name': 'name',
                            'Dosage': 'dosage',
                            'Frequency': 'frequency',
                            'Reason': 'reason',
                            'Condition': 'condition',
                            'Diagnosed Date': 'diagnosedDate',
                            'Notes': 'notes',
                            'Procedure': 'procedure',
                            'Date': 'date',
                            'Hospital': 'hospital'
                          };
                          
                          const columnKey = columnMapping[column] || column.toLowerCase().replace(/ /g, '_');
                          const cellValue = row[columnKey] || row[column] || '';
                          
                          // Choose the appropriate column style based on column name
                          let columnStyle = styles.tableCol;
                          if (column === 'Medication Name') {
                            columnStyle = styles.tableColMedication;
                          } else if (column === 'Dosage') {
                            columnStyle = styles.tableColDosage;
                          } else if (column === 'Frequency') {
                            columnStyle = styles.tableColFrequency;
                          } else if (column === 'Reason') {
                            columnStyle = styles.tableColReason;
                          }
                          
                          return (
                            <Text key={cellIdx} style={columnStyle}>
                              {typeof cellValue === 'object' && cellValue !== null
                                ? Object.values(cellValue).filter(Boolean).join(' | ')
                                : cellValue || '—'}
                            </Text>
                          );
                        })}
                      </View>
                    ));
                  } else {
                    return (
                      <View style={styles.tableRow}>
                        {subsection.columns.map((col, colIdx) => {
                          // Choose the appropriate column style based on column name
                          let columnStyle = styles.tableCol;
                          if (col === 'Medication Name') {
                            columnStyle = styles.tableColMedication;
                          } else if (col === 'Dosage') {
                            columnStyle = styles.tableColDosage;
                          } else if (col === 'Frequency') {
                            columnStyle = styles.tableColFrequency;
                          } else if (col === 'Reason') {
                            columnStyle = styles.tableColReason;
                          }
                          
                          return (
                            <Text key={colIdx} style={columnStyle}>
                              {colIdx === 0 ? 'No data available' : ''}
                            </Text>
                          );
                        })}
                      </View>
                    );
                  }
                })()}
              </View>
            )}
            
            {/* Paragraph Subsection */}
            {subsection.type === 'paragraph' && (
              <>
                {Array.isArray(userData[subsection.key]) ? (
                  userData[subsection.key].map((item, itemIdx) => (
                    <Text key={itemIdx} style={{ marginBottom: 8 }}>
                      {typeof item === 'object' && item !== null
                        ? Object.values(item).filter(Boolean).join(' | ')
                        : (item.message || item || '—')}
                    </Text>
                  ))
                ) : (
                  <Text style={{ marginBottom: 8 }}>
                    {typeof userData[subsection.key] === 'object' && userData[subsection.key] !== null
                      ? Object.values(userData[subsection.key]).filter(Boolean).join(' | ')
                      : (userData[subsection.key] || '—')}
                  </Text>
                )}
              </>
            )}
          </View>
        ))}
        </View> {/* Close the content wrapper */}

        {/* Footer - moved to end of content */}
        <View style={{
          marginTop: 40,
          flexDirection: 'row',
          fontSize: 10,
          color: '#555',
          backgroundColor: '#f0f0f0',
          padding: 10,
          borderTop: '1px solid #ccc'
        }}>
          <Text style={{ flex: 1, textAlign: 'left' }}>
            Prepared for: {fullName}
          </Text>
          <Text
            style={{ flex: 1, textAlign: 'center' }}
            render={({ pageNumber, totalPages }) => `- Page ${pageNumber} of ${totalPages} -`}
          />
          <Text style={{ flex: 1, textAlign: 'right' }}>
            Generated on: {format(new Date(generatedDate), 'MMMM d, yyyy')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Helper function to generate individual section PDF
export const generateSectionPDF = async (sectionNumber: number, userData: any, options: {
  generatedDate?: Date;
  logoUrl?: string;
} = {}) => {
  const {
    generatedDate = new Date(),
    logoUrl = '/Long_logo_The_Grand_Finale.png'
  } = options;

  return (
    <SectionPDF
      sectionNumber={sectionNumber}
      userData={userData}
      generatedDate={generatedDate}
      logoUrl={logoUrl}
    />
  );
};

// Helper function to get section title
export const getSectionTitle = (sectionNumber: number): string => {
  const sectionConfig = getSectionConfig(sectionNumber);
  return sectionConfig ? sectionConfig.section_title : `Section ${sectionNumber}`;
};

// Helper function to check if section has data
export const sectionHasData = (sectionNumber: number, userData: any): boolean => {
  const sectionConfig = getSectionConfig(sectionNumber);
  if (!sectionConfig) return false;
  
  return sectionConfig.subsections.some(subsection => {
    const data = userData[subsection.key];
    return data && (Array.isArray(data) ? data.length > 0 : data);
  });
}; 