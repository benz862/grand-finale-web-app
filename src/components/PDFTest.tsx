import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Button } from './ui/button';

// Simple test styles
const testStyles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  footer: {
    marginTop: 40,
    flexDirection: 'row',
    fontSize: 10,
    color: '#555',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTop: '1px solid #ccc'
  }
});

// Simple test PDF component
const TestPDF = () => (
  <Document>
    <Page size="LETTER" style={testStyles.page}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Test PDF with Footer
      </Text>
      <Text style={{ marginBottom: 10 }}>
        This is a test to see if the footer appears.
      </Text>
      <Text style={{ marginBottom: 10 }}>
        The footer should be visible at the bottom of this page.
      </Text>
      
      {/* Footer */}
      <View style={testStyles.footer}>
        <Text style={{ flex: 1, textAlign: 'left' }}>
          Prepared for: Test User
        </Text>
        <Text
          style={{ flex: 1, textAlign: 'center' }}
          render={({ pageNumber, totalPages }) => `- Page ${pageNumber} of ${totalPages} -`}
        />
        <Text style={{ flex: 1, textAlign: 'right' }}>
          Generated on: {new Date().toLocaleDateString()}
        </Text>
      </View>
    </Page>
  </Document>
);

const PDFTest: React.FC = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">PDF Footer Test</h1>
      <p className="mb-4">This is a simple test to check if PDF footers are working.</p>
      
      <PDFDownloadLink
        document={<TestPDF />}
        fileName="test-footer.pdf"
        onClick={() => setLoading(true)}
      >
        {({ loading: pdfLoading, error }) => (
          <Button
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              loading || pdfLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#17394B] hover:bg-[#153A4B]'
            }`}
            disabled={loading || pdfLoading}
          >
            {loading || pdfLoading ? 'Generating Test PDF...' : 'Generate Test PDF'}
          </Button>
        )}
      </PDFDownloadLink>
      
      {loading && (
        <p className="mt-2 text-sm text-gray-600">
          Generating test PDF with footer...
        </p>
      )}
    </div>
  );
};

export default PDFTest; 