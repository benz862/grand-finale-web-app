import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, File, X, CheckCircle, AlertTriangle } from 'lucide-react';
// import { FileUploadService, UploadedFile } from '@/lib/fileUploadService'; // Temporarily disabled
import { supabase } from '@/lib/supabase';
import { sendWelcomeEmail } from '../lib/emailService';

interface NameChangeRequestProps {
  isOpen: boolean;
  onClose: () => void;
  currentFirstName: string;
  currentMiddleName?: string;
  currentLastName: string;
  userId: string;
  userEmail: string;
}

const NameChangeRequestDialog: React.FC<NameChangeRequestProps> = ({
  isOpen,
  onClose,
  currentFirstName,
  currentMiddleName,
  currentLastName,
  userId,
  userEmail
}) => {
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  const [reason, setReason] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newMiddleName, setNewMiddleName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]); // Temporarily disabled
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reasonOptions = [
    { value: 'marriage', label: 'Marriage' },
    { value: 'divorce', label: 'Divorce' },
    { value: 'legal_change', label: 'Legal Name Change' },
    { value: 'correction', label: 'Correction/Error' },
    { value: 'other', label: 'Other' }
  ];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // File upload functionality temporarily disabled
    toast({
      title: "File Upload Unavailable",
      description: "File upload functionality is temporarily disabled",
      variant: "destructive",
    });
  };

  const handleRemoveFile = async (fileId: string) => {
    // File upload functionality temporarily disabled
    toast({
      title: "File Upload Unavailable",
      description: "File upload functionality is temporarily disabled",
      variant: "destructive",
    });
  };

  const handleSubmit = async () => {
    if (!reason || !newFirstName || !newLastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestId = `NCR-${Date.now()}`;
      
      // Create name change request
      const { data, error } = await supabase
        .from('name_change_requests')
        .insert({
          user_id: userId,
          request_id: requestId,
          current_first_name: currentFirstName,
          current_middle_name: currentMiddleName || '',
          current_last_name: currentLastName,
          requested_first_name: newFirstName,
          requested_middle_name: newMiddleName || '',
          requested_last_name: newLastName,
          reason: reason,
          details: additionalDetails,
          supporting_documents_count: uploadedFiles.length,
          has_supporting_documents: uploadedFiles.length > 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating request:', error);
        toast({
          title: "Request Failed",
          description: "Failed to submit name change request",
          variant: "destructive",
        });
        return;
      }

      // Update file records with the actual request ID
      // TEMPORARILY DISABLED - Database RLS issues
      // if (uploadedFiles.length > 0) {
      //   await supabase
      //     .from('file_uploads')
      //     .update({ related_request_id: requestId })
      //     .in('id', uploadedFiles.map(f => f.id));
      // }

      // Store request in database for immediate UI updates
      if (user?.email) {
        try {
          await syncForm(user.email, 'pendingNameChangeRequest', {
            requestId,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            documentsCount: uploadedFiles.length
          });
        } catch (error) {
          console.error('Error saving name change request to database:', error);
        }
      }

      toast({
        title: "Request Submitted Successfully",
        description: `Your name change request (${requestId}) has been submitted for review. You will be notified within 1-2 business days.`,
      });

      // Send email notifications
      if (!error) {
        // Send confirmation to requester
        await sendWelcomeEmail({
          email: userEmail,
          planId: '',
          planName: '',
          planPrice: '',
          planPeriod: '',
          loginUrl: '',
          customerName: userEmail.split('@')[0]
        });

        // Send notification to admin
        await sendWelcomeEmail({
          email: 'support@skillbinder.com',
          planId: '',
          planName: '',
          planPrice: '',
          planPeriod: '',
          loginUrl: '',
          customerName: userEmail
        });
      }

      // Reset form and close
      setReason('');
      setNewFirstName('');
      setNewMiddleName('');
      setNewLastName('');
      setAdditionalDetails('');
      setUploadedFiles([]);
      onClose();

    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <File className="w-5 h-5" />
            Request Name Change
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Submit a request to update your legal name. This is required for security purposes when changing core identity information. Please provide supporting documentation to expedite the review process.
            </AlertDescription>
          </Alert>

          {/* Current Name Display */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Current Name on File</h3>
              <p className="text-gray-700">
                {currentFirstName} {currentMiddleName} {currentLastName}
              </p>
            </CardContent>
          </Card>

          {/* Reason for Change */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Name Change *
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* New Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newFirstName" className="text-sm font-medium">
                New First Name *
              </Label>
              <Input
                id="newFirstName"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                placeholder="Enter new first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newMiddleName" className="text-sm font-medium">
                New Middle Name
              </Label>
              <Input
                id="newMiddleName"
                value={newMiddleName}
                onChange={(e) => setNewMiddleName(e.target.value)}
                placeholder="Enter new middle name (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newLastName" className="text-sm font-medium">
                New Last Name *
              </Label>
              <Input
                id="newLastName"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                placeholder="Enter new last name"
              />
            </div>
          </div>

          {/* Supporting Documents */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Supporting Documents</Label>
            <p className="text-sm text-gray-600">
              Upload documents such as marriage certificate, court order, divorce decree, or other legal documentation supporting your name change.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Choose Files'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported: PDF, Word documents, Images (Max 10MB each)
              </p>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Documents</Label>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        📄
                      </span>
                      <div>
                        <p className="text-sm font-medium">{file.fileName}</p>
                        <p className="text-xs text-gray-500">
                          File size unavailable
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="additionalDetails" className="text-sm font-medium">
              Additional Details
            </Label>
            <Textarea
              id="additionalDetails"
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Provide any additional context or documentation details..."
              rows={4}
            />
          </div>

          {/* Review Process Info */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Name change requests are reviewed within 1-2 business days. You will receive an email notification when your request is processed. Having supporting documentation will expedite the review process.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || !reason || !newFirstName || !newLastName}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NameChangeRequestDialog;
