import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  height?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface FileQRCodeData {
  fileUrl: string;
  fileName: string;
  fileType: string;
  description?: string;
  uploadDate: string;
}

/**
 * Generate a QR code as a data URL
 */
export const generateQRCodeDataURL = async (
  data: string | FileQRCodeData,
  options: QRCodeOptions = {}
): Promise<string> => {
  const defaultOptions: QRCodeOptions = {
    width: 200,
    height: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    // If data is an object, stringify it for QR code
    const qrData = typeof data === 'string' ? data : JSON.stringify(data);
    
    const dataURL = await QRCode.toDataURL(qrData, {
      width: mergedOptions.width,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel
    });

    return dataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate a QR code as a canvas element
 */
export const generateQRCodeCanvas = async (
  data: string | FileQRCodeData,
  options: QRCodeOptions = {}
): Promise<HTMLCanvasElement> => {
  const defaultOptions: QRCodeOptions = {
    width: 200,
    height: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const qrData = typeof data === 'string' ? data : JSON.stringify(data);
    
    const canvas = await QRCode.toCanvas(qrData, {
      width: mergedOptions.width,
      margin: mergedOptions.margin,
      color: mergedOptions.color,
      errorCorrectionLevel: mergedOptions.errorCorrectionLevel
    });

    return canvas;
  } catch (error) {
    console.error('Error generating QR code canvas:', error);
    throw new Error('Failed to generate QR code canvas');
  }
};

/**
 * Generate a QR code for a file with metadata
 */
export const generateFileQRCode = async (
  fileUrl: string,
  fileName: string,
  fileType: string,
  description?: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const fileData: FileQRCodeData = {
    fileUrl,
    fileName,
    fileType,
    description,
    uploadDate: new Date().toISOString()
  };

  return generateQRCodeDataURL(fileData, options);
};

/**
 * Generate a simple QR code for a URL
 */
export const generateURLQRCode = async (
  url: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  return generateQRCodeDataURL(url, options);
};

/**
 * Validate if a string is a valid QR code data URL
 */
export const isValidQRCodeDataURL = (dataURL: string): boolean => {
  return dataURL.startsWith('data:image/png;base64,') || 
         dataURL.startsWith('data:image/svg+xml;base64,');
};

/**
 * Extract QR code data from a data URL
 */
export const extractQRCodeData = (dataURL: string): string | null => {
  if (!isValidQRCodeDataURL(dataURL)) {
    return null;
  }

  try {
    const base64Data = dataURL.split(',')[1];
    return atob(base64Data);
  } catch (error) {
    console.error('Error extracting QR code data:', error);
    return null;
  }
}; 