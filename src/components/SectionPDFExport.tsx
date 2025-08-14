import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { SectionPDF, getSectionTitle, sectionHasData } from '../lib/sectionPdfGenerator';

interface SectionPDFExportProps {
  sectionNumber: number;
  userData: any;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onError?: (error: string) => void;
  className?: string;
  buttonText?: string;
  showIcon?: boolean;
}

const SectionPDFExport: React.FC<SectionPDFExportProps> = ({
  sectionNumber,
  userData,
  onExportStart,
  onExportComplete,
  onError,
  className = '',
  buttonText,
  showIcon = true
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const sectionTitle = getSectionTitle(sectionNumber);
  const hasData = sectionHasData(sectionNumber, userData);
  
  // Extract user name for filename
  const firstName = userData?.firstName || userData?.basic_info?.firstName || 'User';
  const lastName = userData?.lastName || userData?.basic_info?.lastName || '';

  const handleExportStart = () => {
    setIsGenerating(true);
    onExportStart?.();
  };

  const handleExportComplete = () => {
    setIsGenerating(false);
    onExportComplete?.();
  };

  const handleExportError = (error: string) => {
    setIsGenerating(false);
    onError?.(error);
  };

  // Generate filename
  const filename = `${sectionTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${firstName}_${lastName}_${new Date().toISOString().split('T')[0]}.pdf`;

  // Default button text
  const defaultButtonText = `Export ${sectionTitle}`;

  return (
    <div className={className}>
      {hasData ? (
        <PDFDownloadLink
          document={
            <SectionPDF
              sectionNumber={sectionNumber}
              userData={userData}
              generatedDate={new Date()}
            />
          }
          fileName={filename}
        >
          {({ loading, error }) => (
            <button
              className={`inline-flex items-center px-4 py-2 bg-[#17394B] text-white rounded-lg hover:bg-[#153A4B] transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
              onClick={handleExportStart}
            >
              {showIcon && (
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              )}
              {loading ? 'Generating PDF...' : (buttonText || defaultButtonText)}
            </button>
          )}
        </PDFDownloadLink>
      ) : (
        <button
          className="inline-flex items-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
          disabled
          title="No data available for this section"
        >
          {showIcon && (
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          )}
          {buttonText || defaultButtonText}
        </button>
      )}
    </div>
  );
};

export default SectionPDFExport; 