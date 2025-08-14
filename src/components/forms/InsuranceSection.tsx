import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus } from 'lucide-react';
import InsuranceCard from './InsuranceCard';

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

interface InsuranceSectionProps {
  insurances: InsuranceInfo[];
  onUpdate: (insurances: InsuranceInfo[]) => void;
}

const InsuranceSection: React.FC<InsuranceSectionProps> = ({ insurances, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInsurance, setNewInsurance] = useState<Omit<InsuranceInfo, 'id'>>{
    providerName: '',
    planNumber: '',
    groupNumber: '',
    policyholderName: '',
    contactPhone: '',
    type: 'primary',
    notes: ''
  });

  const handleAdd = () => {
    if (!newInsurance.providerName.trim() || !newInsurance.planNumber.trim()) {
      return;
    }

    const insurance: InsuranceInfo = {
      ...newInsurance,
      id: Date.now().toString()
    };

    onUpdate([...insurances, insurance]);
    setNewInsurance({
      providerName: '',
      planNumber: '',
      groupNumber: '',
      policyholderName: '',
      contactPhone: '',
      type: insurances.length === 0 ? 'primary' : 'secondary',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleUpdate = (updatedInsurance: InsuranceInfo) => {
    const updated = insurances.map(ins => 
      ins.id === updatedInsurance.id ? updatedInsurance : ins
    );
    onUpdate(updated);
  };

  const handleDelete = (id: string) => {
    const updated = insurances.filter(ins => ins.id !== id);
    onUpdate(updated);
  };

  const primaryInsurance = insurances.find(ins => ins.type === 'primary');
  const secondaryInsurances = insurances.filter(ins => ins.type === 'secondary');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Insurance Information</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Insurance
        </Button>
      </div>

      {/* Primary Insurance */}
      {primaryInsurance && (
        <div>
          <h4 className="text-md font-medium mb-3">Primary Insurance</h4>
          <InsuranceCard
            insurance={primaryInsurance}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Secondary/Supplemental Insurance */}
      {secondaryInsurances.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-3">Secondary/Supplemental Insurance</h4>
          <div className="space-y-4">
            {secondaryInsurances.map(insurance => (
              <InsuranceCard
                key={insurance.id}
                insurance={insurance}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">Add New Insurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newProviderName">Provider Name *</Label>
                <Input
                  id="newProviderName"
                  value={newInsurance.providerName}
                  onChange={(e) => setNewInsurance({...newInsurance, providerName: e.target.value})}
                  placeholder="Insurance provider name"
                />
              </div>
              <div>
                <Label htmlFor="newPlanNumber">Plan/Policy Number *</Label>
                <Input
                  id="newPlanNumber"
                  value={newInsurance.planNumber}
                  onChange={(e) => setNewInsurance({...newInsurance, planNumber: e.target.value})}
                  placeholder="Plan or policy number"
                />
              </div>
              <div>
                <Label htmlFor="newGroupNumber">Group Number</Label>
                <Input
                  id="newGroupNumber"
                  value={newInsurance.groupNumber}
                  onChange={(e) => setNewInsurance({...newInsurance, groupNumber: e.target.value})}
                  placeholder="Group number (if applicable)"
                />
              </div>
              <div>
                <Label htmlFor="newPolicyholderName">Policyholder Name</Label>
                <Input
                  id="newPolicyholderName"
                  value={newInsurance.policyholderName}
                  onChange={(e) => setNewInsurance({...newInsurance, policyholderName: e.target.value})}
                  placeholder="If different from you"
                />
              </div>
              <div>
                <Label htmlFor="newContactPhone">Contact Phone</Label>
                <Input
                  id="newContactPhone"
                  value={newInsurance.contactPhone}
                  onChange={(e) => setNewInsurance({...newInsurance, contactPhone: e.target.value})}
                  placeholder="Insurance contact phone"
                />
              </div>
              <div>
                <Label htmlFor="newType">Insurance Type</Label>
                <select
                  id="newType"
                  value={newInsurance.type}
                  onChange={(e) => setNewInsurance({...newInsurance, type: e.target.value as 'primary' | 'secondary'})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary/Supplemental</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="newNotes">Notes</Label>
              <Textarea
                id="newNotes"
                value={newInsurance.notes}
                onChange={(e) => setNewInsurance({...newInsurance, notes: e.target.value})}
                placeholder="Additional notes about this insurance"
                rows={2}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
                Add Insurance
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {insurances.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-gray-500">
          <p>No insurance information added yet.</p>
          <p className="text-sm">Click "Add Insurance" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default InsuranceSection;