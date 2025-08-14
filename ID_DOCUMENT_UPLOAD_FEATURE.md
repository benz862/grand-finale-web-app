# ID Document Upload Feature Implementation

## Overview
Added comprehensive ID document upload capabilities to the Personal Information form, allowing users to upload images/scans of their identification documents with QR code generation for PDF access.

## Features Implemented

### 1. File Upload Categories
- **National ID Documents**: Social Security Numbers, SIN cards, etc.
- **Passport Documents**: Passport scans and images
- **Driver's License Documents**: Driver's licenses from various countries
- **Green Card & Immigration Documents**: Permanent resident cards, visas
- **Other Immigration Documents**: Additional immigration-related documents

### 2. Upload Interface
- Drag-and-drop file upload areas for each document category
- Support for multiple files per category
- File type validation (images and PDFs)
- File size display and management
- Remove individual files functionality

### 3. PDF Generation with QR Codes
- Separate "Generate ID Documents PDF" button (appears only when files are uploaded)
- QR codes generated for each uploaded document
- QR codes link directly to the uploaded files
- Professional PDF layout with document information
- File details displayed (name, size, type)

### 4. Technical Implementation

#### Frontend Components
- **PersonalInformationForm.tsx**: Added ID document upload section
- File upload state management with `idDocuments` state
- File preview and removal functionality
- Integration with existing PDF generation system

#### PDF Generation
- **pdfGenerator.ts**: Added `addIdDocumentsContent` function
- QR code generation using `qrcode` library
- Professional PDF layout with document categorization
- File information display with QR codes

#### Data Persistence
- ID documents saved to localStorage
- Automatic saving every 30 seconds
- Data loading on component mount
- Integration with existing save/load system

### 5. User Experience Features

#### Visual Design
- Clean, organized upload areas for each document type
- Clear labeling and instructions
- File list with remove buttons
- Responsive design for mobile and desktop

#### Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- Clear visual feedback for upload states

#### Security & Privacy
- Files stored locally (no server upload in current implementation)
- QR codes provide secure access to documents
- No sensitive data transmitted without user consent

### 6. PDF Output Features

#### Document Information
- File name and type
- File size in MB
- Upload date (when available)
- Document category headers

#### QR Code Integration
- 60x60mm QR codes positioned next to file information
- Direct links to uploaded documents
- "Scan to view document" labels
- Professional placement and sizing

#### Layout & Formatting
- Consistent with existing PDF styling
- Proper page breaks for long document lists
- Header and footer integration
- Watermark support for trial/lite users

## Usage Instructions

### For Users
1. Navigate to Personal Information form
2. Expand "ID Document Uploads" section
3. Click upload areas to select files
4. Files will appear in the list below each category
5. Use "Generate ID Documents PDF" button to create PDF with QR codes
6. QR codes in PDF can be scanned to access the original documents

### For Developers
- ID documents are stored in `idDocuments` state object
- PDF generation uses `formType: 'idDocuments'`
- QR codes are generated using `generateQRCodeForFile` function
- File URLs are passed to QR code generation for direct access

## Future Enhancements
- Server-side file storage integration
- File encryption for enhanced security
- Document verification system
- Integration with digital signature services
- Multi-page document support
- OCR text extraction for searchable PDFs

## Technical Notes
- Files are currently stored in browser localStorage
- QR codes link to local file URLs
- PDF generation is client-side only
- No server-side processing required
- Compatible with existing PDF generation system
