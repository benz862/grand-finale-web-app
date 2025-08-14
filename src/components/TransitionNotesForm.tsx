import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Trash2, Home, CreditCard, Heart, Lightbulb } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { useToast } from './ui/use-toast';
import { useTrial } from '../contexts/TrialContext';

interface Tip {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface TransitionNotesData {
  householdTips: Tip[];
  moneyLogisticsTips: Tip[];
  wisdomAdviceTips: Tip[];
  generalNotes: string;
}

interface TransitionNotesFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<TransitionNotesData>;
}

const TransitionNotesForm: React.FC<TransitionNotesFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { userTier, isTrial } = useTrial();
  const { toast } = useToast();
  const [formData, setFormData] = useState<TransitionNotesData>({
    householdTips: initialData.householdTips || [],
    moneyLogisticsTips: initialData.moneyLogisticsTips || [],
    wisdomAdviceTips: initialData.wisdomAdviceTips || [],
    generalNotes: initialData.generalNotes || ''
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('transitionNotesForm');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save to database every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (!user?.email) return;
      
      try {
        await syncForm(user.email, 'transitionNotesData', formData);
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [formData, user?.email]);

  const handleFieldChange = (field: keyof TransitionNotesData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add new tip to specific category
  const handleAddTip = (category: string) => {
    const newTip: Tip = {
      id: uuidv4(),
      title: '',
      description: '',
      category: category
    };

    const categoryKey = `${category}Tips` as keyof TransitionNotesData;
    setFormData(prev => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] as Tip[]), newTip]
    }));

    toast({ title: 'Tip Added', description: `New ${category} tip added. Please fill in the details.` });
  };

  // Remove tip
  const handleRemoveTip = (category: string, id: string) => {
    const categoryKey = `${category}Tips` as keyof TransitionNotesData;
    setFormData(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] as Tip[]).filter(tip => tip.id !== id)
    }));
  };

  // Update tip
  const handleUpdateTip = (category: string, id: string, field: keyof Tip, value: string) => {
    const categoryKey = `${category}Tips` as keyof TransitionNotesData;
    setFormData(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] as Tip[]).map(tip =>
        tip.id === id ? { ...tip, [field]: value } : tip
      )
    }));
  };

  const handleSave = async () => {
    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your data.",
        variant: "destructive",
      });
      return;
    }

    try {
      await syncForm(user.email, 'transitionNotesData', formData);
      toast({ title: 'Saved', description: 'Transition Notes saved to database.' });
      if (onNext) onNext();
    } catch (error) {
      console.error('Error saving transition notes:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save to database. Please try again.',
        variant: "destructive"
      });
    }
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    generatePDF({
      sectionTitle: 'Practical Life Tips & Transition Notes',
      data: formData,
      formType: 'transitionNotes',
      userTier,
      isTrial
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Practical Life Tips & Transition Notes</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          Share helpful tips, life hacks, and guidance to ease the transition for your loved ones
        </p>
        <AudioPlayer audioFile="Section_13.mp3" size="md" sectionNumber={13} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          
          {/* Household Tips */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#153A4B' }}>
                <Home className="h-5 w-5" />
                Household & Day-to-Day Tips
              </h3>
              <Button 
                type="button" 
                onClick={() => handleAddTip('household')}
                variant="skillbinder_yellow"
                className="skillbinder_yellow font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                + Add Household Tip
              </Button>
            </div>
            
            {formData.householdTips.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No household tips added yet. Click "Add Household Tip" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.householdTips.map((tip, index) => (
                  <div key={tip.id} className="border rounded-lg overflow-hidden bg-blue-50 border-blue-200">
                    <div className="bg-blue-100 px-4 py-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-blue-800">Household Tip {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveTip('household', tip.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Tip Title</Label>
                          <Input
                            value={tip.title}
                            onChange={(e) => handleUpdateTip('household', tip.id, 'title', e.target.value)}
                            placeholder="e.g., Morning Coffee Routine, Plant Care Schedule"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Tip Description</Label>
                          <Textarea
                            value={tip.description}
                            onChange={(e) => handleUpdateTip('household', tip.id, 'description', e.target.value)}
                            placeholder="Provide detailed instructions, explanations, or advice for this tip..."
                            className="text-sm"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Money & Logistics Tips */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#153A4B' }}>
                <CreditCard className="h-5 w-5" />
                Money & Logistics
              </h3>
              <Button 
                type="button" 
                onClick={() => handleAddTip('money')}
                variant="skillbinder_yellow"
                className="skillbinder_yellow font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                + Add Money Tip
              </Button>
            </div>
            
            {formData.moneyLogisticsTips.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No money & logistics tips added yet. Click "Add Money Tip" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.moneyLogisticsTips.map((tip, index) => (
                  <div key={tip.id} className="border rounded-lg overflow-hidden bg-green-50 border-green-200">
                    <div className="bg-green-100 px-4 py-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-green-800">Money Tip {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveTip('money', tip.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Tip Title</Label>
                          <Input
                            value={tip.title}
                            onChange={(e) => handleUpdateTip('money', tip.id, 'title', e.target.value)}
                            placeholder="e.g., Recurring Subscriptions, Utility Accounts"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Tip Description</Label>
                          <Textarea
                            value={tip.description}
                            onChange={(e) => handleUpdateTip('money', tip.id, 'description', e.target.value)}
                            placeholder="Provide detailed instructions, explanations, or advice for this tip..."
                            className="text-sm"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wisdom & Advice Tips */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#153A4B' }}>
                <Heart className="h-5 w-5" />
                Wisdom & Personal Advice
              </h3>
              <Button 
                type="button" 
                onClick={() => handleAddTip('wisdom')}
                variant="skillbinder_yellow"
                className="skillbinder_yellow font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                + Add Wisdom Tip
              </Button>
            </div>
            
            {formData.wisdomAdviceTips.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <p>No wisdom & advice tips added yet. Click "Add Wisdom Tip" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.wisdomAdviceTips.map((tip, index) => (
                  <div key={tip.id} className="border rounded-lg overflow-hidden bg-purple-50 border-purple-200">
                    <div className="bg-purple-100 px-4 py-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-purple-800">Wisdom Tip {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveTip('wisdom', tip.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Tip Title</Label>
                          <Input
                            value={tip.title}
                            onChange={(e) => handleUpdateTip('wisdom', tip.id, 'title', e.target.value)}
                            placeholder="e.g., Trust Your Instincts, Invest in Experiences"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Tip Description</Label>
                          <Textarea
                            value={tip.description}
                            onChange={(e) => handleUpdateTip('wisdom', tip.id, 'description', e.target.value)}
                            placeholder="Provide detailed instructions, explanations, or advice for this tip..."
                            className="text-sm"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* General Notes */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold" style={{ color: '#153A4B' }}>General Notes</h3>
            
            <div className="border p-6 rounded-lg">
              <div>
                <Label>Additional Notes or Instructions</Label>
                <Textarea
                  value={formData.generalNotes}
                  onChange={(e) => handleFieldChange('generalNotes', e.target.value)}
                  placeholder="Any general notes, instructions, or context for all the tips above..."
                  rows={4}
                />
              </div>
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

export default TransitionNotesForm;