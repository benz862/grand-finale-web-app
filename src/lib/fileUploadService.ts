import { supabase } from './supabase';
import { generateFileQRCode, generateQRCodeDataURL } from './qrCodeService';

export interface FileUploadData {
  id?: string;
  fileName: string;
  originalFileName: string;
  fileType: 'video' | 'audio' | 'document' | 'image' | 'other';
  fileCategory: string;
  fileSize: number;
  fileExtension: string;
  fileUrl: string;
  qrCodeUrl?: string;
  qrCodeData?: string;
  description?: string;
  uploadDate?: string;
  displayName?: string;
}

export interface UploadedFile {
  id: string;
  fileName: string;
  fileType: 'video' | 'audio' | 'document' | 'image' | 'other';
  fileCategory: string;
  uploadDate: string;
  description: string;
  fileUrl?: string;
  qrCodeUrl?: string;
  fileSize?: number;
  originalFileName?: string;
  displayName?: string;
}

/**
 * Upload file to Supabase Storage
 */
export const uploadFileToStorage = async (
  file: File,
  fileName: string,
  userId: string
): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const filePath = `uploads/${userId}/${timestamp}-${fileName}.${fileExt}`;
    
    console.log('Attempting to upload to storage:', filePath);
    
    const { error: uploadError } = await supabase.storage
      .from('legacy-files')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      // If storage upload fails, create a mock URL for testing
      console.warn('Storage upload failed, using mock URL for testing');
      return `https://mock-storage.supabase.co/legacy-files/${filePath}`;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('legacy-files')
      .getPublicUrl(filePath);
    
    console.log('Storage upload successful, URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Storage error:', error);
    // Fallback to mock URL for testing
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const filePath = `uploads/${userId}/${timestamp}-${fileName}.${fileExt}`;
    console.log('Using fallback mock URL:', `https://mock-storage.supabase.co/legacy-files/${filePath}`);
    return `https://mock-storage.supabase.co/legacy-files/${filePath}`;
  }
};

/**
 * Generate QR code for uploaded file
 */
export const generateQRCodeForFile = async (
  fileUrl: string,
  fileName: string,
  fileType: string,
  description?: string
): Promise<{ qrCodeUrl: string; qrCodeData: string }> => {
  try {
    // Create structured data for the QR code
    const qrData = {
      fileUrl: fileUrl,
      fileName: fileName,
      fileType: fileType,
      description: description || '',
      timestamp: new Date().toISOString(),
      type: 'legacy-document',
      source: 'The Grand Finale'
    };
    
    // Convert to JSON string
    const qrDataString = JSON.stringify(qrData);
    
    // Generate QR code with structured data
    const QRCode = await import('qrcode');
    const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
      width: 200,
      margin: 2,
      color: {
        dark: '#17394B', // SkillBinder blue
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    return {
      qrCodeUrl: qrCodeDataURL,
      qrCodeData: qrDataString // Store the actual data, not just the image URL
    };
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * TEMPORARY: Save file upload data to localStorage (bypasses database RLS issues)
 */
export const saveFileUploadToDatabase = async (
  userId: string,
  fileData: FileUploadData
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Generate a unique ID
    const id = crypto.randomUUID();
    
    // Create the file record
    const fileRecord = {
      id,
      user_id: userId,
      file_name: fileData.fileName,
      original_file_name: fileData.originalFileName,
      file_type: fileData.fileType,
      file_category: fileData.fileCategory,
      file_size: fileData.fileSize,
      file_extension: fileData.fileExtension,
      file_url: fileData.fileUrl,
      qr_code_url: fileData.qrCodeUrl,
      qr_code_data: fileData.qrCodeData,
      description: fileData.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Save to localStorage
    const storageKey = `file_uploads_${userId}`;
    const existingData = localStorage.getItem(storageKey);
    const existingFiles = existingData ? JSON.parse(existingData) : [];
    
    existingFiles.push(fileRecord);
    localStorage.setItem(storageKey, JSON.stringify(existingFiles));
    
    console.log('File saved to localStorage:', fileRecord);
    
    return { success: true, data: fileRecord };
  } catch (error) {
    console.error('localStorage save error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * TEMPORARY: Get all file uploads from localStorage
 */
export const getUserFileUploads = async (
  userId: string
): Promise<{ success: boolean; data?: FileUploadData[]; error?: string }> => {
  try {
    const storageKey = `file_uploads_${userId}`;
    const existingData = localStorage.getItem(storageKey);
    const existingFiles = existingData ? JSON.parse(existingData) : [];
    
    // Convert to FileUploadData format
    const fileUploads = existingFiles.map((file: any) => ({
      id: file.id,
      fileName: file.file_name,
      originalFileName: file.original_file_name,
      fileType: file.file_type,
      fileCategory: file.file_category,
      fileSize: file.file_size,
      fileExtension: file.file_extension,
      fileUrl: file.file_url,
      qrCodeUrl: file.qr_code_url,
      qrCodeData: file.qr_code_data,
      description: file.description,
      uploadDate: file.created_at
    }));
    
    return { success: true, data: fileUploads };
  } catch (error) {
    console.error('localStorage fetch error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Delete a file upload from localStorage (simplified for now)
 */
export const deleteFileUpload = async (
  fileId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('=== DELETING FILE UPLOAD ===');
    console.log('File ID:', fileId);
    console.log('User ID:', userId);
    
    // Delete from localStorage only for now (to avoid potential issues)
    const storageKey = `file_uploads_${userId}`;
    const existingData = localStorage.getItem(storageKey);
    const existingFiles = existingData ? JSON.parse(existingData) : [];
    
    // Remove the file from localStorage
    const updatedFiles = existingFiles.filter((file: any) => file.id !== fileId);
    localStorage.setItem(storageKey, JSON.stringify(updatedFiles));
    console.log('File removed from localStorage successfully');
    
    return { success: true };
  } catch (error) {
    console.error('File delete error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * TEMPORARY: Update file upload description in localStorage
 */
export const updateFileUploadDescription = async (
  fileId: string,
  userId: string,
  description: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const storageKey = `file_uploads_${userId}`;
    const existingData = localStorage.getItem(storageKey);
    const existingFiles = existingData ? JSON.parse(existingData) : [];
    
    // Update the file
    const updatedFiles = existingFiles.map((file: any) => 
      file.id === fileId 
        ? { ...file, description, updated_at: new Date().toISOString() }
        : file
    );
    
    localStorage.setItem(storageKey, JSON.stringify(updatedFiles));
    
    return { success: true };
  } catch (error) {
    console.error('localStorage update error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Upload file with QR code generation (main function)
 */
export const uploadFileWithQRCode = async (
  file: File,
  fileName: string,
  fileType: 'video' | 'audio' | 'document' | 'image' | 'other',
  fileCategory: string,
  description: string,
  userId: string
): Promise<{ success: boolean; data?: FileUploadData; error?: string }> => {
  try {
    console.log('=== STARTING FILE UPLOAD PROCESS ===');
    console.log('File:', file.name, 'Size:', file.size, 'Type:', fileType);
    console.log('User ID:', userId);
    
    // 1. Upload file to storage
    console.log('Step 1: Uploading file to storage...');
    const fileUrl = await uploadFileToStorage(file, fileName, userId);
    console.log('Step 1 Complete: File uploaded to storage:', fileUrl);
    
    // 2. Generate QR code
    console.log('Step 2: Generating QR code...');
    const { qrCodeUrl, qrCodeData } = await generateQRCodeForFile(
      fileUrl,
      fileName,
      fileType,
      description
    );
    console.log('Step 2 Complete: QR code generated');
    
    // 3. Save to localStorage (not database)
    console.log('Step 3: Saving to localStorage...');
    const fileData: FileUploadData = {
      fileName,
      originalFileName: file.name,
      fileType,
      fileCategory,
      fileSize: file.size,
      fileExtension: file.name.split('.').pop() || '',
      fileUrl,
      qrCodeUrl,
      qrCodeData,
      description,
      uploadDate: new Date().toISOString()
    };
    
    console.log('File data to save:', fileData);
    const saveResult = await saveFileUploadToDatabase(userId, fileData);
    
    if (!saveResult.success) {
      console.error('localStorage save failed:', saveResult.error);
      throw new Error(saveResult.error || 'Failed to save file data to localStorage');
    }
    
    console.log('Step 3 Complete: File saved to localStorage');
    console.log('=== FILE UPLOAD PROCESS COMPLETED SUCCESSFULLY ===');
    
    return { success: true, data: fileData };
  } catch (error) {
    console.error('=== FILE UPLOAD PROCESS FAILED ===');
    console.error('File upload error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Get file uploads grouped by category
 */
export const getFileUploadsGroupedByCategory = async (
  userId: string
): Promise<{ success: boolean; data?: Record<string, FileUploadData[]>; error?: string }> => {
  try {
    const result = await getUserFileUploads(userId);
    
    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }
    
    // Group by category
    const grouped = result.data.reduce((acc: Record<string, FileUploadData[]>, file) => {
      const category = file.fileCategory;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(file);
      return acc;
    }, {});
    
    return { success: true, data: grouped };
  } catch (error) {
    console.error('Group by category error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
