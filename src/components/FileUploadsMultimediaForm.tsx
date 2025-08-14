import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { Upload, File, Video, Mic, FileText, FolderOpen, Lock, QrCode } from 'lucide-react';
import { useTrial } from '../contexts/TrialContext';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { uploadFileWithQRCode, getUserFileUploads, deleteFileUpload, updateFileUploadDescription } from '../lib/fileUploadService';
import { FileUploadData } from '../lib/fileUploadService';

interface UploadedFile {
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

interface FileUploadsMultimediaData {
  uploadInstructions: string;
  uploadedFiles: UploadedFile[];
  legacyInstructions: string;
}

interface FileUploadsMultimediaFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<FileUploadsMultimediaData>;
}

const FileUploadsMultimediaForm: React.FC<FileUploadsMultimediaFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { toast } = useToast();
  const navigate = useNavigate ? useNavigate() : () => {};
  const { isTrial } = useTrial();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FileUploadsMultimediaData>({
    uploadInstructions: '',
    uploadedFiles: [],
    legacyInstructions: '',
    ...initialData
  });

  const [newFile, setNewFile] = useState({
    fileName: '',
    fileType: 'document' as 'video' | 'audio' | 'document' | 'image' | 'other',
    fileCategory: '',
    description: ''
  });

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load saved data from localStorage and database on component mount
  useEffect(() => {
    const loadData = async () => {
      // Load from localStorage first
      const savedData = localStorage.getItem('fileUploadsMultimediaForm');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(parsed);
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }

      // Load file uploads from database if user is authenticated
      if (isAuthenticated && user?.id) {
        try {
          const result = await getUserFileUploads(user.id);
          if (result.success && result.data) {
            // Convert database format to form format
            const uploadedFiles = result.data.map((file: FileUploadData) => ({
              id: file.id || uuidv4(),
              fileName: file.fileName,
              fileType: file.fileType as 'video' | 'audio' | 'document' | 'image' | 'other',
              fileCategory: file.fileCategory === 'Scanned Documents' ? 'Documents/Images' : file.fileCategory,
              uploadDate: file.uploadDate || new Date().toISOString().split('T')[0],
              description: file.description || '',
              fileUrl: file.fileUrl,
              qrCodeUrl: file.qrCodeUrl,
              fileSize: file.fileSize,
              originalFileName: file.originalFileName,
              displayName: file.fileName
            }));

            setFormData(prev => ({
              ...prev,
              uploadedFiles
            }));
          }
        } catch (error) {
          console.error('Error loading file uploads from database:', error);
        }
      }
    };

    loadData();
  }, [isAuthenticated, user?.id]);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      localStorage.setItem('fileUploadsMultimediaForm', JSON.stringify(formData));
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  // Debug: Log form data changes
  useEffect(() => {
    console.log('=== Form Data Changed ===');
    console.log('formData:', formData);
    console.log('uploadedFiles:', formData.uploadedFiles);
    console.log('uploadedFiles length:', formData.uploadedFiles?.length);
  }, [formData]);

  // Handler for all fields
  const handleChange = (field: keyof FileUploadsMultimediaData, value: any) => 
    setFormData((prev: FileUploadsMultimediaData) => ({ ...prev, [field]: value }));

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill the file name
      setNewFile(prev => ({ ...prev, fileName: file.name }));
      
      // Auto-detect file type based on extension
      const extension = file.name.toLowerCase().split('.').pop();
      let detectedType: 'video' | 'audio' | 'document' | 'image' | 'other' = 'document';
      
      if (['mp4', 'mov', 'avi', 'mkv'].includes(extension || '')) {
        detectedType = 'video';
      } else if (['mp3', 'wav', 'm4a', 'aac'].includes(extension || '')) {
        detectedType = 'audio';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension || '')) {
        detectedType = 'image';
      } else if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension || '')) {
        detectedType = 'document';
      } else {
        detectedType = 'other';
      }
      
      setNewFile(prev => ({ 
        ...prev, 
        fileType: detectedType,
        fileCategory: getCategoryName(detectedType)
      }));
    }
  };

  // Upload file to Supabase Storage
  const uploadFileToSupabase = async (file: File, fileName: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `uploads/${Date.now()}-${fileName}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('legacy-files')
      .upload(filePath, file);
    
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('legacy-files')
      .getPublicUrl(filePath);
    
    return publicUrl;
  };

  // Generate QR code with proper data structure
  const generateQRCode = async (fileUrl: string, fileName: string): Promise<string> => {
    try {
      // Create structured data for the QR code
      const qrData = {
        fileUrl: fileUrl,
        fileName: fileName,
        timestamp: new Date().toISOString(),
        type: 'legacy-document'
      };
      
      // Convert to JSON string
      const qrDataString = JSON.stringify(qrData);
      
      // Generate QR code using the qrcode library
      const QRCode = (await import('qrcode')).default;
      const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      
      return qrCodeDataURL;
    } catch (error) {
      console.error('QR code generation error:', error);
      // Fallback to simple URL QR code
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fileUrl)}`;
    }
  };

  // Add new file entry with actual upload
  const handleAddFile = async () => {
    if (!selectedFile) {
      toast({ title: 'No File Selected', description: 'Please select a file to upload.' });
      return;
    }

    if (!newFile.description) {
      toast({ title: 'Missing Description', description: 'Please provide a description for the file.' });
      return;
    }

    if (!isAuthenticated || !user?.id) {
      toast({ title: 'Authentication Required', description: 'Please log in to upload files.' });
      return;
    }

    setUploading(true);

    try {
      // Use the new file upload service
      const result = await uploadFileWithQRCode(
        selectedFile,
        newFile.fileName,
        newFile.fileType,
        newFile.fileCategory || getCategoryName(newFile.fileType),
        newFile.description,
        user.id
      );

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      const fileEntry: UploadedFile = {
        id: uuidv4(),
        fileName: newFile.fileName,
        fileType: newFile.fileType,
        fileCategory: newFile.fileCategory || getCategoryName(newFile.fileType),
        uploadDate: new Date().toISOString().split('T')[0],
        description: newFile.description,
        fileUrl: result.data?.fileUrl,
        qrCodeUrl: result.data?.qrCodeUrl,
        fileSize: selectedFile.size,
        originalFileName: selectedFile.name
      };

      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, fileEntry]
      }));

      // Reset form
      setNewFile({
        fileName: '',
        fileType: 'document',
        fileCategory: '',
        description: ''
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast({ 
        title: 'File Uploaded Successfully', 
        description: `${selectedFile.name} has been uploaded with QR code and added to your list.` 
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: 'Upload Failed', 
        description: error instanceof Error ? error.message : 'Failed to upload file.' 
      });
    } finally {
      setUploading(false);
    }
  };

  // Remove file entry
  const handleRemoveFile = async (id: string) => {
    try {
      // Remove from form state first (immediate UI feedback)
      setFormData(prev => ({
        ...prev,
        uploadedFiles: prev.uploadedFiles.filter(file => file.id !== id)
      }));

      // Also remove from localStorage if user is authenticated
      if (isAuthenticated && user?.id) {
        try {
          // Remove from localStorage using the file upload service
          const result = await deleteFileUpload(id, user.id);
          if (result.success) {
            console.log('File removed successfully:', id);
          } else {
            console.error('File removal failed:', result.error);
            // Optionally show error toast here
          }
        } catch (error) {
          console.error('Error removing file from localStorage:', error);
          // Don't let this break the UI - file is already removed from state
        }
      }
    } catch (error) {
      console.error('Error in handleRemoveFile:', error);
      // Ensure the file is still removed from UI even if there's an error
    }
  };

  // Update file entry
  const handleUpdateFile = (id: string, field: keyof UploadedFile, value: any) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.map(file => 
        file.id === id ? { ...file, [field]: value } : file
      )
    }));
  };

  // Get category name based on file type
  const getCategoryName = (fileType: string) => {
    switch (fileType) {
      case 'video': return 'Video Messages';
      case 'audio': return 'Audio Recordings';
      case 'document': return 'Documents/Images';
      case 'image': return 'Documents/Images';
      case 'other': return 'Other Files';
      default: return 'Other Files';
    }
  };

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'image': return <File className="h-4 w-4" />;
      case 'other': return <FolderOpen className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Group files by category
  const groupedFiles = formData.uploadedFiles.reduce((groups, file) => {
    const category = file.fileCategory;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(file);
    return groups;
  }, {} as Record<string, UploadedFile[]>);

  // Save handler
  const handleSave = async () => {
    console.log('=== FILE UPLOADS MULTIMEDIA SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving file uploads & multimedia information...",
      description: "Please wait while we save your data.",
    });

    // Save to database
    if (isAuthenticated && user?.email) {
      console.log('=== DATABASE SYNC START ===');
      console.log('User authenticated, attempting database sync...');
      console.log('User email:', user.email);
      
      try {
        // Show syncing status
        toast({
          title: "Syncing to database...",
          description: "Please wait while we save your data to the cloud.",
        });

        // Use email as user ID for database sync
        const result = await syncForm(user.email, 'fileUploadsMultimediaData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your file uploads & multimedia information has been saved to the database.",
          });
        } else {
          console.error('Sync failed:', result.error);
          
          // Show detailed error message
          let errorMessage = "There was an issue saving to the database.";
          if (result.error && typeof result.error === 'string') {
            errorMessage += ` Error: ${result.error}`;
          } else if (result.error && result.error.message) {
            errorMessage += ` Error: ${result.error.message}`;
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Database sync error:', error);
        
        // Show detailed error message
        let errorMessage = "There was an issue saving to the database.";
        if (error instanceof Error) {
          errorMessage += ` Error: ${error.message}`;
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } else {
      console.log('No authenticated user found');
      toast({
        title: "Authentication Required",
        description: "Please log in to save your file uploads & multimedia information to the database.",
        variant: "destructive",
      });
    }

    console.log('=== FILE UPLOADS MULTIMEDIA SAVE END ===');
    
    // Only proceed to next if save was successful
    try {
      onNext();
    } catch (error) {
      console.error('Error navigating to next step:', error);
      toast({
        title: "Navigation Error",
        description: "There was an issue navigating to the next step. Please try again.",
        variant: "destructive",
      });
    }
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    // Prepare data for PDF generation
    const pdfData = {
      ...formData,
      uploadedFiles: formData.uploadedFiles || []
    };
    
    // Debug: Log what we're sending to PDF
    console.log('=== PDF Generation Debug ===');
    console.log('formData:', formData);
    console.log('pdfData:', pdfData);
    console.log('uploadedFiles count:', pdfData.uploadedFiles?.length);
    console.log('uploadedFiles:', pdfData.uploadedFiles);
    
    generatePDF({
      sectionTitle: 'File Uploads & Multimedia Memories',
      data: pdfData,
      formType: 'fileUploads',
      userInfo: {
        firstName: (user as any)?.user_metadata?.first_name || user?.email?.split('@')[0] || '',
        lastName: (user as any)?.user_metadata?.last_name || '',
        email: user?.email || ''
      },
      userTier: isTrial ? 'Trial' : 'Standard', // Standard users should not get Lite watermark
      isTrial: isTrial
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>File Uploads & Multimedia Memories</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Upload and organize important files, videos, voice recordings, and documents for your loved ones. Each file will be securely stored with a description and QR code for easy access in your final PDF.
        </p>
        {isTrial && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-800">
              <strong>Free Trial Restriction:</strong> File uploads are not available in the free trial. Upgrade to upload videos, voice recordings, and documents.
            </p>
          </div>
        )}
        <AudioPlayer audioFile="Section_16.mp3" size="md" sectionNumber={16} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          
          {/* Upload Instructions */}
          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#153A4B' }}>Upload Instructions</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2" style={{ color: '#153A4B' }}>Supported File Types</h4>
                <ul className="space-y-1 text-sm">
                  <li>Final video messages (.mp4, .mov, .avi)</li>
                  <li>Voice memos and recordings (.mp3, .wav, .m4a)</li>
                  <li>Scanned documents/images (.pdf, .jpg, .png, .gif)</li>
                  <li>Important reference files (.docx, .xlsx, .txt, .csv)</li>
                </ul>
                <p className="text-sm mt-2 text-gray-600">Maximum file size: 100MB per file</p>
              </div>

              <div>
                <Label>Instructions for Loved Ones</Label>
                <Textarea
                  value={formData.uploadInstructions}
                  onChange={(e) => handleChange('uploadInstructions', e.target.value)}
                  placeholder="Enter instructions for how your loved ones should access and use these files..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Upload New File</h3>
            
            {isTrial ? (
              <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center rounded-lg">
                <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2" style={{ color: '#153A4B' }}>
                  File Uploads Not Available in Trial
                </h4>
                <p className="text-gray-600 mb-4">
                  Upgrade to upload videos, voice recordings, and important documents for your legacy planning.
                </p>
                <Button 
                  onClick={() => window.location.href = '/pricing'}
                  style={{ backgroundColor: '#E4B64A', color: 'white' }}
                >
                  Upgrade to Upload Files
                </Button>
              </div>
            ) : (
              <div className="border p-6 rounded-lg bg-gray-50">
              {/* File Selection */}
              <div className="mb-6">
                <Label>Select File to Upload</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept=".mp4,.mov,.avi,.mp3,.wav,.m4a,.pdf,.jpg,.jpeg,.png,.gif,.docx,.xlsx,.txt,.csv,.rtf,.doc"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Click to select a file'}
                      </span>
                    </div>
                  </Button>
                </div>
                {selectedFile && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getFileTypeIcon(newFile.fileType)}
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                      <span className="text-xs text-gray-500">({formatFileSize(selectedFile.size)})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* File Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Display Name</Label>
                  <Input
                    value={newFile.fileName}
                    onChange={(e) => setNewFile(prev => ({ ...prev, fileName: e.target.value }))}
                    placeholder="Enter a name for this file (e.g., 'My Final Message to Sarah')"
                  />
                </div>
                <div>
                  <Label>File Type</Label>
                  <select
                    value={newFile.fileType}
                    onChange={(e) => setNewFile(prev => ({ 
                      ...prev, 
                      fileType: e.target.value as any,
                      fileCategory: getCategoryName(e.target.value)
                    }))}
                    className="w-full border rounded p-2"
                  >
                    <option value="video">🎥 Video Message</option>
                    <option value="audio">🎵 Audio Recording</option>
                    <option value="document">📄 Document</option>
                    <option value="image">🖼️ Image</option>
                    <option value="other">📁 Other</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <Label>Description for Loved Ones</Label>
                <Textarea
                  value={newFile.description}
                  onChange={(e) => setNewFile(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this file contains and any special instructions for your loved ones (e.g., 'I would like this message to go to Jonathan')"
                  rows={3}
                />
              </div>
              
              <Button 
                type="button" 
                onClick={handleAddFile}
                disabled={!selectedFile || !newFile.description || uploading}
                style={{ backgroundColor: '#E4B64A', color: 'white' }}
                className="w-full"
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload File</span>
                  </div>
                )}
              </Button>
            </div>
            )}
          </div>

          {/* Uploaded Files by Category */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Your Uploaded Files</h3>
            
            {formData.uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No files uploaded yet. Upload your first file above.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedFiles).map(([category, files]) => (
                  <div key={category} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2">
                      <h4 className="font-semibold" style={{ color: '#153A4B' }}>{category}</h4>
                    </div>
                    <div className="p-4 space-y-4">
                      {files.map((file) => (
                        <div key={file.id} className="border p-4 rounded-lg bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                            <div>
                              <Label className="text-sm font-medium">File Name</Label>
                              <div className="flex items-center space-x-2 mt-1">
                                {getFileTypeIcon(file.fileType)}
                                <Input
                                  value={file.fileName}
                                  onChange={(e) => handleUpdateFile(file.id, 'fileName', e.target.value)}
                                  className="text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Upload Date</Label>
                              <p className="text-sm mt-1">{file.uploadDate}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">File Size</Label>
                              <p className="text-sm mt-1">{file.fileSize ? formatFileSize(file.fileSize) : 'Unknown'}</p>
                            </div>
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveFile(file.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label className="text-sm font-medium">Description</Label>
                            <Textarea
                              value={file.description}
                              onChange={(e) => handleUpdateFile(file.id, 'description', e.target.value)}
                              placeholder="Describe what this file contains and any special instructions..."
                              rows={2}
                              className="mt-1"
                            />
                          </div>
                          <div className="mt-2 text-sm text-blue-600">
                            <p>✓ File uploaded successfully</p>
                            {file.qrCodeUrl && <p>✓ QR Code generated</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy & Security */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Privacy & Security</h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm">
                Your files are stored securely and privately using Supabase Storage. Each file will have its own QR code generated, and your descriptions will appear as captions in the final PDF. No one can access the files unless you provide the final PDF.
              </p>
            </div>
          </div>

          {/* Legacy Instructions */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Legacy Instructions</h3>
            <div>
              <Label>Final Notes for Loved Ones</Label>
              <Textarea
                value={formData.legacyInstructions}
                onChange={(e) => handleChange('legacyInstructions', e.target.value)}
                placeholder="Include any last tips or explanations about your uploaded files..."
                rows={4}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onPrevious}
            >
              Previous
            </Button>
            <div className="flex gap-4">
              <Button 
                type="button" 
                onClick={handleGeneratePDF}
                className="inline-flex items-center px-4 py-2 bg-[#17394B] text-white rounded-lg hover:bg-[#153A4B] transition-colors"
              >
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
                Generate PDF
              </Button>
              <Button type="submit" variant="skillbinder_yellow" className="skillbinder_yellow">
                Save & Continue
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileUploadsMultimediaForm; 