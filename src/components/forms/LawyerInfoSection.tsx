import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import LawyerCard from './LawyerCard';

interface Lawyer {
  id: string;
  lawyer_name: string;
  lawyer_address: string;
}

interface LawyerInfoSectionProps {
  lawyers: Lawyer[];
  onAddLawyer: () => void;
  onUpdateLawyer: (id: string, field: string, value: string) => void;
  onDeleteLawyer: (id: string) => void;
}

const LawyerInfoSection: React.FC<LawyerInfoSectionProps> = ({
  lawyers,
  onAddLawyer,
  onUpdateLawyer,
  onDeleteLawyer
}) => {
  const canAddMore = lawyers.length < 3;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Lawyer Information</CardTitle>
          {canAddMore && (
            <Button
              onClick={onAddLawyer}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Lawyer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {lawyers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No lawyers added yet.</p>
            <Button
              onClick={onAddLawyer}
              variant="outline"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Lawyer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {lawyers.map((lawyer, index) => (
              <LawyerCard
                key={lawyer.id}
                lawyer={lawyer}
                index={index}
                onUpdate={onUpdateLawyer}
                onDelete={onDeleteLawyer}
              />
            ))}
            {!canAddMore && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Maximum of 3 lawyers allowed
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LawyerInfoSection;