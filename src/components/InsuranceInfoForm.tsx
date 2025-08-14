import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import InsuranceSection from './forms/InsuranceSection';

interface InsuranceInfoFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface InsuranceInfo {
  id: string;
  providerName: string;
  planNumber: string;
  groupNumber: string;
  policyholderName: string;
  contactPhone: string;
  type: 'primary' | 'secondary';
  notes?: string;
}

interface InsuranceFormData {
  insurances: InsuranceInfo[];
  additionalNotes: string;
}

const InsuranceInfoForm: React.FC<InsuranceInfoFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { syncForm } = useDatabaseSync();
  const [formData, setFormData] = useState<InsuranceFormData>({
    insurances: [],
    additionalNotes: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('insuranceInfo');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle legacy data format
        if (parsed.insurance_provider) {
          const legacyInsurance: InsuranceInfo = {
            id: '1',
            providerName: parsed.insurance_provider || '',
            planNumber: parsed.insurance_policy_number || '',
            groupNumber: parsed.insurance_group_number || '',
            policyholderName: '',
            contactPhone: '',
            type: 'primary',
            notes: parsed.additional_notes || ''
          };
          setFormData({
            insurances: [legacyInsurance],
            additionalNotes: parsed.additional_notes || ''
          });
        } else {
          setFormData(parsed);
        }
      } catch (error) {
        console.error('Error parsing saved insurance data:', error);
      }
    }
  }, []);

  const handleInsurancesUpdate = (insurances: InsuranceInfo[]) => {
    setFormData(prev => ({ ...prev, insurances }));
  };

  const validateForm = (): boolean => {
    if (formData.insurances.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one insurance provider.",
        variant: "destructive"
      });
      return false;
    }

    const hasRequiredFields = formData.insurances.every(ins => 
      ins.providerName.trim() && ins.planNumber.trim()
    );

    if (!hasRequiredFields) {
      toast({
        title: "Validation Error",
        description: "Please fill in provider name and plan number for all insurance entries.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your data.",
        variant: "destructive",
      });
      return;
    }

    try {
      await syncForm(user.email, 'insuranceInfoData', formData);
      toast({
        title: "Success",
        description: "Insurance information saved to database!"
      });
      onNext();
    } catch (error) {
      console.error('Error saving insurance data:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="text-2xl font-bold text-center">
              Section 7: Insurance Information
            </CardTitle>
            <p className="text-center text-blue-100 mt-2">
              Add your health insurance information including primary and secondary/supplemental coverage
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <InsuranceSection
              insurances={formData.insurances}
              onUpdate={handleInsurancesUpdate}
            />

            <div className="flex justify-between pt-8 border-t">
              <Button
                onClick={onPrevious}
                variant="outline"
                className="px-6"
              >
                Previous
              </Button>
              <Button
                onClick={handleSave}
                className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Save & Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsuranceInfoForm;