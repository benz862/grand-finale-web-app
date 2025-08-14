import React, { useState, useEffect } from 'react';
import SectionPDFExport from './SectionPDFExport';
import FullBookPDFExport from './FullBookPDFExport';
import { getSectionsWithData } from '../lib/sectionConfigs';

interface PDFExportManagerProps {
  userData: any;
  currentSection?: number;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onError?: (error: string) => void;
  showFullBookExport?: boolean;
  className?: string;
}

const PDFExportManager: React.FC<PDFExportManagerProps> = ({
  userData,
  currentSection,
  onExportStart,
  onExportComplete,
  onError,
  showFullBookExport = false,
  className = ''
}) => {
  const [sectionsWithData, setSectionsWithData] = useState<any[]>([]);
  const [showFullBook, setShowFullBook] = useState(showFullBookExport);
  const [activeTab, setActiveTab] = useState<'individual' | 'fullbook'>('individual');

  useEffect(() => {
    const sections = getSectionsWithData(userData);
    setSectionsWithData(sections);
  }, [userData]);

  const handleExportStart = () => {
    onExportStart?.();
  };

  const handleExportComplete = () => {
    onExportComplete?.();
  };

  const handleExportError = (error: string) => {
    onError?.(error);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          PDF Export Options
        </h2>
        <p className="text-gray-600">
          Export individual sections or generate a complete document with all your information.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('individual')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'individual'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Individual Sections
        </button>
        {showFullBookExport && (
          <button
            onClick={() => setActiveTab('fullbook')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'fullbook'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Full Book Export
          </button>
        )}
      </div>

      {/* Individual Sections Tab */}
      {activeTab === 'individual' && (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Export Individual Sections
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Export specific sections as separate PDF files. Only sections with data are available for export.
            </p>
          </div>

          {/* Current Section Export */}
          {currentSection && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-md font-semibold text-blue-900 mb-3">
                Current Section
              </h4>
              <SectionPDFExport
                sectionNumber={currentSection}
                userData={userData}
                onExportStart={handleExportStart}
                onExportComplete={handleExportComplete}
                onError={handleExportError}
                buttonText={`Export Current Section (${currentSection})`}
                className="w-full"
              />
            </div>
          )}

          {/* All Sections with Data */}
          {sectionsWithData.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                All Available Sections ({sectionsWithData.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sectionsWithData.map((section) => (
                  <div
                    key={section.section_number}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Section {section.section_number}
                      </span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        ✓ Data
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">
                      {section.section_title}
                    </p>
                    <SectionPDFExport
                      sectionNumber={section.section_number}
                      userData={userData}
                      onExportStart={handleExportStart}
                      onExportComplete={handleExportComplete}
                      onError={handleExportError}
                      buttonText="Export"
                      showIcon={false}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data Warning */}
          {sectionsWithData.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>No data available:</strong> Please complete at least one section 
                before exporting PDFs.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Full Book Export Tab */}
      {activeTab === 'fullbook' && showFullBookExport && (
        <div className="p-6">
          <FullBookPDFExport
            userData={userData}
            onExportStart={handleExportStart}
            onExportComplete={handleExportComplete}
            onError={handleExportError}
          />
        </div>
      )}

      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Sections with data:</span> {sectionsWithData.length} of 18
          </div>
          <div>
            <span className="font-medium">Last updated:</span> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExportManager; 