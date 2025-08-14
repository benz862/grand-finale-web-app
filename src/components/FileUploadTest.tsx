import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUploadService } from '@/lib/fileUploadService';
import { useAuth } from '@/contexts/AuthContext';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const FileUploadTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const runTests = async () => {
    if (!user) {
      setTestResults([{ success: false, message: 'User not logged in' }]);
      return;
    }

    setIsLoading(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Initialize FileUploadService
      results.push({ success: true, message: 'FileUploadService initialized' });

      // Test 2: Create a test file for upload
      const testFileContent = 'This is a test document for name change request verification.';
      const testFile = new File([testFileContent], 'test-document.txt', { type: 'text/plain' });
      
      results.push({ 
        success: true, 
        message: `Test file created: ${testFile.name} (${testFile.size} bytes)` 
      });

      // Test 3: Validate file
      const validation = FileUploadService.validateFile(testFile);
      results.push({
        success: validation.valid,
        message: validation.valid ? 'File validation passed' : `File validation failed: ${validation.error}`,
        details: validation
      });

      if (validation.valid) {
        // Test 4: Upload file for name change
        const uploadResult = await FileUploadService.uploadNameChangeDocument(
          testFile,
          user.id!,
          'TEST-12345',
          'Test document for name change verification'
        );

        results.push({
          success: uploadResult.success,
          message: uploadResult.success 
            ? `File uploaded successfully: ${uploadResult.fileUrl}` 
            : `Upload failed: ${uploadResult.error}`,
          details: uploadResult
        });

        // Test 5: List uploaded files
        if (uploadResult.success && uploadResult.fileId) {
          const files = await FileUploadService.getUploadedFiles(user.id!, 'name_change_document', 'TEST-12345');
          results.push({
            success: files.length > 0,
            message: files.length > 0 
              ? `Found ${files.length} uploaded files` 
              : 'No files found',
            details: files
          });

          // Test 6: Delete the test file
          if (files.length > 0) {
            const deleteResult = await FileUploadService.deleteFile(files[0].id, user.id!);
            results.push({
              success: deleteResult,
              message: deleteResult 
                ? 'Test file deleted successfully' 
                : 'Failed to delete file',
              details: { deleted: deleteResult }
            });
          }
        }
      }

    } catch (error) {
      results.push({
        success: false,
        message: `Test failed with error: ${error}`,
        details: error
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const testFeedbackUpload = async () => {
    if (!user) {
      setTestResults([{ success: false, message: 'User not logged in' }]);
      return;
    }

    setIsLoading(true);
    const results: TestResult[] = [...testResults];

    try {
      // Test feedback attachment upload
      const testImage = new File(['fake-image-data'], 'feedback-screenshot.png', { type: 'image/png' });
      
      const uploadResult = await FileUploadService.uploadFeedbackAttachment(
        testImage,
        user.id!,
        'FB-TEST-12345',
        'Screenshot showing UI improvement suggestion'
      );

      results.push({
        success: uploadResult.success,
        message: uploadResult.success 
          ? 'Feedback attachment uploaded successfully' 
          : `Feedback upload failed: ${uploadResult.error}`,
        details: uploadResult
      });

      if (uploadResult.success && uploadResult.fileId) {
        // Clean up test file
        const deleteResult = await FileUploadService.deleteFile(uploadResult.fileId, user.id!);
        results.push({
          success: deleteResult,
          message: deleteResult 
            ? 'Test feedback file deleted' 
            : 'Failed to delete feedback file'
        });
      }

    } catch (error) {
      results.push({
        success: false,
        message: `Feedback test failed: ${error}`,
        details: error
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">File Upload System Test</h2>
      
      <div className="space-y-4 mb-6">
        <Button 
          onClick={runTests} 
          disabled={isLoading || !user}
          className="mr-4"
        >
          {isLoading ? 'Running Tests...' : 'Test Name Change Document Upload'}
        </Button>
        
        <Button 
          onClick={testFeedbackUpload} 
          disabled={isLoading || !user}
          variant="outline"
        >
          Test Feedback Attachment Upload
        </Button>
      </div>

      {!user && (
        <Alert className="mb-6">
          <AlertDescription>
            You must be logged in to test file uploads
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        {testResults.map((result, index) => (
          <Alert key={index} className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription>
              <div className="flex items-center gap-2">
                <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                  {result.success ? '✅' : '❌'}
                </span>
                <span>{result.message}</span>
              </div>
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600">Show details</summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
};
