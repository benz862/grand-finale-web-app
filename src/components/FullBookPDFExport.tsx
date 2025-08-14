import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { GrandFinalePDF } from '../lib/reactPdfGenerator';
import { getSectionsWithData, SectionConfig, SECTION_CONFIGS } from '../lib/sectionConfigs';

interface FullBookPDFExportProps {
  userData: any;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onError?: (error: string) => void;
}

const FullBookPDFExport: React.FC<FullBookPDFExportProps> = ({
  userData,
  onExportStart,
  onExportComplete,
  onError
}) => {
  const [sectionsWithData, setSectionsWithData] = useState<SectionConfig[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDate, setGeneratedDate] = useState(new Date());

  // Extract user information
  const firstName = userData?.firstName || userData?.basic_info?.firstName || '';
  const lastName = userData?.lastName || userData?.basic_info?.lastName || '';

  useEffect(() => {
    // Get sections that have data
    const sections = getSectionsWithData(userData);

    setSectionsWithData(sections);
  }, [userData]);

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

  // PDF configuration
  const pdfConfig = {
    coverImage: '/cover-background.jpg', // Full-bleed cover image
    logoUrl: '/skillbinder_logo_with_guides.jpg',
    sections: sectionsWithData,
    generatedDate: generatedDate
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Export Full Book PDF
        </h2>
        <p className="text-gray-600">
          Generate a complete, personalized PDF of your legacy planning document.
        </p>
      </div>

      {/* Export Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Export Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700">
              <strong>Prepared for:</strong> {firstName} {lastName}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Generated on:</strong> {generatedDate.toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-700">
              <strong>Sections included:</strong> {sectionsWithData.length} of 18
            </p>
            <p className="text-sm text-blue-700">
              <strong>Estimated pages:</strong> {Math.max(3 + (sectionsWithData.length * 3), 10)}
            </p>
          </div>
        </div>
      </div>

      {/* Sections Preview */}
      {sectionsWithData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Sections to be included:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectionsWithData.map((section) => (
              <div
                key={section.section_number}
                className="p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Section {section.section_number}
                  </span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    ✓ Included
                  </span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {section.section_title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Export Options
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="include-toc"
              defaultChecked
              className="mr-3"
            />
            <label htmlFor="include-toc" className="text-sm text-gray-700">
              Include Table of Contents with page numbers
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="clickable-toc"
              defaultChecked
              className="mr-3"
            />
            <label htmlFor="clickable-toc" className="text-sm text-gray-700">
              Make TOC entries clickable (for digital viewing)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="page-numbers"
              defaultChecked
              className="mr-3"
            />
            <label htmlFor="page-numbers" className="text-sm text-gray-700">
              Include continuous page numbering
            </label>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Download PDF */}
        <PDFDownloadLink
          document={
            <GrandFinalePDF
              userData={userData}
              coverImage={pdfConfig.coverImage}
              logoUrl={pdfConfig.logoUrl}
              sections={pdfConfig.sections}
              generatedDate={pdfConfig.generatedDate}
            />
          }
          fileName={`Grand_Finale_${firstName}_${lastName}_${generatedDate.toISOString().split('T')[0]}.pdf`}
          className="flex-1"
        >
          {({ loading, error }) => (
            <button
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-[#17394B] text-white hover:bg-[#153A4B]'
              }`}
              disabled={loading || sectionsWithData.length === 0}
              onClick={handleExportStart}
            >
              {loading ? 'Generating PDF...' : 'Download Full Book PDF'}
            </button>
          )}
        </PDFDownloadLink>

        {/* Preview PDF */}
        <button
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => {
            // This would open a modal with PDF preview
            console.log('Preview PDF');
          }}
          disabled={sectionsWithData.length === 0}
        >
          Preview PDF
        </button>
      </div>

      {/* Error Display */}
      {sectionsWithData.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>No data available:</strong> Please complete at least one section 
            of your legacy planning document before generating the PDF.
          </p>
        </div>
      )}

      {/* PDF Features Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          PDF Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Cover Page</h4>
            <ul className="space-y-1">
              <li>• Branded background image</li>
              <li>• Personalized "Prepared for" text</li>
              <li>• Generation date</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Content Structure</h4>
            <ul className="space-y-1">
              <li>• Section cover pages with branding</li>
              <li>• Professional tables and lists</li>
              <li>• No hanging headers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Navigation</h4>
            <ul className="space-y-1">
              <li>• Auto-generated table of contents</li>
              <li>• Clickable TOC entries</li>
              <li>• Continuous page numbering</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Branding</h4>
            <ul className="space-y-1">
              <li>• SkillBinder logo and colors</li>
              <li>• Professional typography</li>
              <li>• Print-ready formatting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullBookPDFExport; 