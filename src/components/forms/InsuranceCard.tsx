import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Trash2, Edit2, Save, X } from 'lucide-react';

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

interface InsuranceCardProps {
  insurance: InsuranceInfo;
  onUpdate: (insurance: InsuranceInfo) => void;
  onDelete: (id: string) => void;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ insurance, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<InsuranceInfo>(insurance);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(insurance);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="border-blue-200">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              Edit {editData.type === 'primary' ? 'Primary' : 'Secondary'} Insurance
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="providerName">Provider Name *</Label>
              <Input
                id="providerName"
                value={editData.providerName}
                onChange={(e) => setEditData({...editData, providerName: e.target.value})}
                placeholder="Insurance provider name"
              />
            </div>
            <div>
              <Label htmlFor="planNumber">Plan/Policy Number *</Label>
              <Input
                id="planNumber"
                value={editData.planNumber}
                onChange={(e) => setEditData({...editData, planNumber: e.target.value})}
                placeholder="Plan or policy number"
              />
            </div>
            <div>
              <Label htmlFor="groupNumber">Group Number</Label>
              <Input
                id="groupNumber"
                value={editData.groupNumber}
                onChange={(e) => setEditData({...editData, groupNumber: e.target.value})}
                placeholder="Group number (if applicable)"
              />
            </div>
            <div>
              <Label htmlFor="policyholderName">Policyholder Name</Label>
              <Input
                id="policyholderName"
                value={editData.policyholderName}
                onChange={(e) => setEditData({...editData, policyholderName: e.target.value})}
                placeholder="If different from you"
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={editData.contactPhone}
                onChange={(e) => setEditData({...editData, contactPhone: e.target.value})}
                placeholder="Insurance contact phone"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={editData.notes || ''}
              onChange={(e) => setEditData({...editData, notes: e.target.value})}
              placeholder="Additional notes about this insurance"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              insurance.type === 'primary' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              {insurance.type === 'primary' ? 'Primary' : 'Secondary'}
            </span>
            {insurance.providerName}
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDelete(insurance.id)} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Plan/Policy Number</p>
            <p className="text-sm">{insurance.planNumber || 'Not specified'}</p>
          </div>
          {insurance.groupNumber && (
            <div>
              <p className="text-sm font-medium text-gray-600">Group Number</p>
              <p className="text-sm">{insurance.groupNumber}</p>
            </div>
          )}
          {insurance.policyholderName && (
            <div>
              <p className="text-sm font-medium text-gray-600">Policyholder Name</p>
              <p className="text-sm">{insurance.policyholderName}</p>
            </div>
          )}
          {insurance.contactPhone && (
            <div>
              <p className="text-sm font-medium text-gray-600">Contact Phone</p>
              <p className="text-sm">{insurance.contactPhone}</p>
            </div>
          )}
        </div>
        {insurance.notes && (
          <div>
            <p className="text-sm font-medium text-gray-600">Notes</p>
            <p className="text-sm">{insurance.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsuranceCard;