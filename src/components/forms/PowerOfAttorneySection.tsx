import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2 } from 'lucide-react';

interface FinancialPOA {
  id: string;
  agent_name: string;
  contact_info: string;
  relationship: string;
  effective_when: string;
  notes: string;
}

interface HealthcareProxy {
  id: string;
  proxy_name: string;
  alternate_proxy: string;
  contact_info: string;
  relationship: string;
  notes: string;
}

interface OtherPOA {
  id: string;
  role_name: string;
  agent_name: string;
  contact_info: string;
  notes: string;
}

interface PowerOfAttorneySectionProps {
  financialPOA: FinancialPOA[];
  healthcareProxies: HealthcareProxy[];
  otherPOA: OtherPOA[];
  onAddFinancialPOA: () => void;
  onUpdateFinancialPOA: (id: string, field: string, value: string) => void;
  onDeleteFinancialPOA: (id: string) => void;
  onAddHealthcareProxy: () => void;
  onUpdateHealthcareProxy: (id: string, field: string, value: string) => void;
  onDeleteHealthcareProxy: (id: string) => void;
  onAddOtherPOA: () => void;
  onUpdateOtherPOA: (id: string, field: string, value: string) => void;
  onDeleteOtherPOA: (id: string) => void;
}

const PowerOfAttorneySection: React.FC<PowerOfAttorneySectionProps> = ({
  financialPOA,
  healthcareProxies,
  otherPOA,
  onAddFinancialPOA,
  onUpdateFinancialPOA,
  onDeleteFinancialPOA,
  onAddHealthcareProxy,
  onUpdateHealthcareProxy,
  onDeleteHealthcareProxy,
  onAddOtherPOA,
  onUpdateOtherPOA,
  onDeleteOtherPOA
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Power of Attorney (POA)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Financial POA Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Financial POA</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddFinancialPOA}
            >
              + Add Financial POA
            </Button>
          </div>
          
          {financialPOA.map((poa, index) => (
            <div key={poa.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Financial POA {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteFinancialPOA(poa.id)}
                  className="rounded-full w-8 h-8 p-0 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`financial-poa-agent-${poa.id}`}>Agent Name</Label>
                  <Input
                    id={`financial-poa-agent-${poa.id}`}
                    value={poa.agent_name}
                    onChange={(e) => onUpdateFinancialPOA(poa.id, 'agent_name', e.target.value)}
                    placeholder="Enter agent's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`financial-poa-contact-${poa.id}`}>Contact Info</Label>
                  <Input
                    id={`financial-poa-contact-${poa.id}`}
                    value={poa.contact_info}
                    onChange={(e) => onUpdateFinancialPOA(poa.id, 'contact_info', e.target.value)}
                    placeholder="Phone, email, or address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`financial-poa-relationship-${poa.id}`}>Relationship</Label>
                  <Input
                    id={`financial-poa-relationship-${poa.id}`}
                    value={poa.relationship}
                    onChange={(e) => onUpdateFinancialPOA(poa.id, 'relationship', e.target.value)}
                    placeholder="e.g., Spouse, Child, Friend"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`financial-poa-effective-${poa.id}`}>Effective When</Label>
                  <Select
                    value={poa.effective_when}
                    onValueChange={(value) => onUpdateFinancialPOA(poa.id, 'effective_when', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select when effective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="incapacity">Upon Incapacity</SelectItem>
                      <SelectItem value="specific_date">Specific Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`financial-poa-notes-${poa.id}`}>Notes</Label>
                <Textarea
                  id={`financial-poa-notes-${poa.id}`}
                  value={poa.notes}
                  onChange={(e) => onUpdateFinancialPOA(poa.id, 'notes', e.target.value)}
                  placeholder="Any additional notes about this financial POA"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Healthcare Proxy Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Healthcare Proxy</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddHealthcareProxy}
            >
              + Add Healthcare Proxy
            </Button>
          </div>
          
          {healthcareProxies.map((proxy, index) => (
            <div key={proxy.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Healthcare Proxy {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteHealthcareProxy(proxy.id)}
                  className="rounded-full w-8 h-8 p-0 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`healthcare-proxy-name-${proxy.id}`}>Proxy Name</Label>
                  <Input
                    id={`healthcare-proxy-name-${proxy.id}`}
                    value={proxy.proxy_name}
                    onChange={(e) => onUpdateHealthcareProxy(proxy.id, 'proxy_name', e.target.value)}
                    placeholder="Enter proxy's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`healthcare-proxy-contact-${proxy.id}`}>Contact Info</Label>
                  <Input
                    id={`healthcare-proxy-contact-${proxy.id}`}
                    value={proxy.contact_info}
                    onChange={(e) => onUpdateHealthcareProxy(proxy.id, 'contact_info', e.target.value)}
                    placeholder="Phone, email, or address"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`healthcare-proxy-alternate-${proxy.id}`}>Alternate Proxy</Label>
                  <Input
                    id={`healthcare-proxy-alternate-${proxy.id}`}
                    value={proxy.alternate_proxy}
                    onChange={(e) => onUpdateHealthcareProxy(proxy.id, 'alternate_proxy', e.target.value)}
                    placeholder="Name of alternate proxy"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`healthcare-proxy-relationship-${proxy.id}`}>Relationship</Label>
                  <Input
                    id={`healthcare-proxy-relationship-${proxy.id}`}
                    value={proxy.relationship}
                    onChange={(e) => onUpdateHealthcareProxy(proxy.id, 'relationship', e.target.value)}
                    placeholder="e.g., Spouse, Child, Friend"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`healthcare-proxy-notes-${proxy.id}`}>Notes</Label>
                <Textarea
                  id={`healthcare-proxy-notes-${proxy.id}`}
                  value={proxy.notes}
                  onChange={(e) => onUpdateHealthcareProxy(proxy.id, 'notes', e.target.value)}
                  placeholder="Any additional notes about this healthcare proxy"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Other POA Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>Other POAs / Legal Agents</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddOtherPOA}
            >
              + Add Other POA
            </Button>
          </div>
          
          {otherPOA.map((poa, index) => (
            <div key={poa.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Other POA {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteOtherPOA(poa.id)}
                  className="rounded-full w-8 h-8 p-0 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`other-poa-role-${poa.id}`}>Role & Name</Label>
                  <Input
                    id={`other-poa-role-${poa.id}`}
                    value={poa.role_name}
                    onChange={(e) => onUpdateOtherPOA(poa.id, 'role_name', e.target.value)}
                    placeholder="e.g., Business POA, Real Estate Agent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`other-poa-agent-${poa.id}`}>Agent Name</Label>
                  <Input
                    id={`other-poa-agent-${poa.id}`}
                    value={poa.agent_name}
                    onChange={(e) => onUpdateOtherPOA(poa.id, 'agent_name', e.target.value)}
                    placeholder="Enter agent's full name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`other-poa-contact-${poa.id}`}>Contact Info</Label>
                <Input
                  id={`other-poa-contact-${poa.id}`}
                  value={poa.contact_info}
                  onChange={(e) => onUpdateOtherPOA(poa.id, 'contact_info', e.target.value)}
                  placeholder="Phone, email, or address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`other-poa-notes-${poa.id}`}>Notes or Limitations</Label>
                <Textarea
                  id={`other-poa-notes-${poa.id}`}
                  value={poa.notes}
                  onChange={(e) => onUpdateOtherPOA(poa.id, 'notes', e.target.value)}
                  placeholder="Any additional notes, limitations, or specific details"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PowerOfAttorneySection; 