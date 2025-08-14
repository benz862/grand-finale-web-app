import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, Heart, Palette, Gift, BookOpen, Users, Star } from 'lucide-react';
import { generatePDF } from '../lib/pdfGenerator';
import AudioPlayer from './AudioPlayer';
import { v4 as uuidv4 } from 'uuid';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './ui/use-toast';
import { useTrial } from '../contexts/TrialContext';

interface LegacyItem {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
}

interface FinalWishesLegacyPlanningData {
  // Ethical Will or Values Statement
  ethicalWills: LegacyItem[];
  
  // Creative or Personal Legacy Projects
  creativeLegacyProjects: LegacyItem[];
  
  // Charitable Donations or Scholarships
  charitableDonations: LegacyItem[];
  
  // Life Lessons, Sayings, and Humor
  lifeLessons: LegacyItem[];
  
  // Family Traditions, Archives, and Recipes
  familyTraditions: LegacyItem[];
  
  // Wishes for How to Be Remembered
  personalLegacyStatement: string;
  preferredTributes: string;
}

interface FinalWishesLegacyPlanningFormProps {
  onNext: () => void;
  onPrevious: () => void;
  initialData?: Partial<FinalWishesLegacyPlanningData>;
}

const FinalWishesLegacyPlanningForm: React.FC<FinalWishesLegacyPlanningFormProps> = ({
  onNext,
  onPrevious,
  initialData = {}
}) => {
  const { toast } = useToast();
  const { syncForm } = useDatabaseSync();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FinalWishesLegacyPlanningData>({
    ethicalWills: initialData.ethicalWills || [],
    creativeLegacyProjects: initialData.creativeLegacyProjects || [],
    charitableDonations: initialData.charitableDonations || [],
    lifeLessons: initialData.lifeLessons || [],
    familyTraditions: initialData.familyTraditions || [],
    personalLegacyStatement: initialData.personalLegacyStatement || '',
    preferredTributes: initialData.preferredTributes || ''
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('finalWishesLegacyPlanningForm');
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
      if (isAuthenticated && user?.email) {
        try {
          await syncForm(user.email, 'finalWishesLegacyPlanningData', formData);
        } catch (error) {
          console.error('Auto-save error:', error);
        }
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [formData, isAuthenticated, user?.email, syncForm]);

  const handleFieldChange = (field: keyof FinalWishesLegacyPlanningData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add new item to specific category
  const handleAddItem = (category: string) => {
    const newItem: LegacyItem = {
      id: uuidv4(),
      title: '',
      description: '',
      location: '',
      category: category
    };

    const categoryKey = `${category}` as keyof FinalWishesLegacyPlanningData;
    setFormData(prev => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] as LegacyItem[]), newItem]
    }));

    toast({ title: 'Item Added', description: `New ${category} item added. Please fill in the details.` });
  };

  // Remove item
  const handleRemoveItem = (category: string, id: string) => {
    const categoryKey = `${category}` as keyof FinalWishesLegacyPlanningData;
    setFormData(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] as LegacyItem[]).filter(item => item.id !== id)
    }));
  };

  // Update item
  const handleUpdateItem = (category: string, id: string, field: keyof LegacyItem, value: string) => {
    const categoryKey = `${category}` as keyof FinalWishesLegacyPlanningData;
    setFormData(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] as LegacyItem[]).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = async () => {
    console.log('=== FINAL WISHES LEGACY PLANNING SAVE START ===');
    
    // Show immediate feedback
    toast({
      title: "Saving final wishes & legacy planning information...",
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
        const result = await syncForm(user.email, 'finalWishesLegacyPlanningData', formData);
        console.log('Sync result:', result);
        
        if (result.success) {
          toast({
            title: "Success!",
            description: "Your final wishes & legacy planning information has been saved to the database.",
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
        description: "Please log in to save your final wishes & legacy planning information to the database.",
        variant: "destructive",
      });
    }

    console.log('=== FINAL WISHES LEGACY PLANNING SAVE END ===');
    onNext();
  };

  // PDF generation handler
  const handleGeneratePDF = () => {
    const { isTrial, userTier } = useTrial();
    generatePDF({
      sectionTitle: 'Final Wishes & Legacy Planning',
      data: formData,
      formType: 'finalWishes',
      isTrial,
      userTier
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-bold" style={{ color: '#E4B64A', fontSize: '28px' }}>Final Wishes & Legacy Planning</CardTitle>
        <p className="text-lg" style={{ color: '#153A4B' }}>
          How I wish to be remembered, and what I leave behind
        </p>
        <AudioPlayer audioFile="Section_13.mp3" size="md" sectionNumber={13} />
      </CardHeader>
      <CardContent>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <Accordion type="single" collapsible className="w-full">
            {/* Ethical Will or Values Statement */}
            <AccordionItem value="ethical-will">
              <AccordionTrigger style={{ color: '#153A4B' }}>Ethical Will or Values Statement</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold" style={{ color: '#153A4B' }}>Ethical Wills & Values Statements</h4>
                    <Button 
                      type="button" 
                      onClick={() => handleAddItem('ethicalWills')}
                      variant="skillbinder_yellow"
                      className="skillbinder_yellow"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      + Add Ethical Will
                    </Button>
                  </div>
                  
                  {formData.ethicalWills.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded-lg">
                      <p>No ethical wills added yet. Click "+ Add Ethical Will" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.ethicalWills.map((item, index) => (
                        <Card key={item.id} className="border border-gray-200">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium" style={{ color: '#153A4B' }}>Ethical Will {index + 1}</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem('ethicalWills', item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => handleUpdateItem('ethicalWills', item.id, 'title', e.target.value)}
                                placeholder="e.g., Personal Values Statement, Life Philosophy"
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={item.description}
                                onChange={(e) => handleUpdateItem('ethicalWills', item.id, 'description', e.target.value)}
                                placeholder="Describe your ethical will or values statement..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={item.location}
                                onChange={(e) => handleUpdateItem('ethicalWills', item.id, 'location', e.target.value)}
                                placeholder="Where is this stored or located?"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Creative or Personal Legacy Projects */}
            <AccordionItem value="creative-legacy">
              <AccordionTrigger style={{ color: '#153A4B' }}>Creative or Personal Legacy Projects</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold" style={{ color: '#153A4B' }}>Creative Legacy Projects</h4>
                    <Button 
                      type="button" 
                      onClick={() => handleAddItem('creativeLegacyProjects')}
                      variant="skillbinder_yellow"
                      className="skillbinder_yellow"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      + Add Creative Project
                    </Button>
                  </div>
                  
                  {formData.creativeLegacyProjects.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded-lg">
                      <p>No creative projects added yet. Click "+ Add Creative Project" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.creativeLegacyProjects.map((item, index) => (
                        <Card key={item.id} className="border border-gray-200">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium" style={{ color: '#153A4B' }}>Creative Project {index + 1}</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem('creativeLegacyProjects', item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label>Project Title</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => handleUpdateItem('creativeLegacyProjects', item.id, 'title', e.target.value)}
                                placeholder="e.g., Family Photo Album, Personal Memoir"
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={item.description}
                                onChange={(e) => handleUpdateItem('creativeLegacyProjects', item.id, 'description', e.target.value)}
                                placeholder="Describe your creative or personal legacy project..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={item.location}
                                onChange={(e) => handleUpdateItem('creativeLegacyProjects', item.id, 'location', e.target.value)}
                                placeholder="Where is this project stored or shared?"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Charitable Donations or Scholarships */}
            <AccordionItem value="charitable-donations">
              <AccordionTrigger style={{ color: '#153A4B' }}>Charitable Donations or Scholarships</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold" style={{ color: '#153A4B' }}>Charitable Donations</h4>
                    <Button 
                      type="button" 
                      onClick={() => handleAddItem('charitableDonations')}
                      variant="skillbinder_yellow"
                      className="skillbinder_yellow"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      + Add Donation
                    </Button>
                  </div>
                  
                  {formData.charitableDonations.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded-lg">
                      <p>No charitable donations added yet. Click "+ Add Donation" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.charitableDonations.map((item, index) => (
                        <Card key={item.id} className="border border-gray-200">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium" style={{ color: '#153A4B' }}>Donation {index + 1}</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem('charitableDonations', item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label>Organization/Cause</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => handleUpdateItem('charitableDonations', item.id, 'title', e.target.value)}
                                placeholder="e.g., Local Animal Shelter, College Scholarship Fund"
                              />
                            </div>
                            <div>
                              <Label>Donation Details</Label>
                              <Textarea
                                value={item.description}
                                onChange={(e) => handleUpdateItem('charitableDonations', item.id, 'description', e.target.value)}
                                placeholder="Describe the donation or scholarship details..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Location/Contact</Label>
                              <Input
                                value={item.location}
                                onChange={(e) => handleUpdateItem('charitableDonations', item.id, 'location', e.target.value)}
                                placeholder="Where to find donation information or contact details"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Life Lessons, Sayings, and Humor */}
            <AccordionItem value="life-lessons">
              <AccordionTrigger style={{ color: '#153A4B' }}>Life Lessons, Sayings, and Humor</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold" style={{ color: '#153A4B' }}>Life Lessons & Wisdom</h4>
                    <Button 
                      type="button" 
                      onClick={() => handleAddItem('lifeLessons')}
                      variant="skillbinder_yellow"
                      className="skillbinder_yellow"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      + Add Life Lesson
                    </Button>
                  </div>
                  
                  {formData.lifeLessons.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded-lg">
                      <p>No life lessons added yet. Click "+ Add Life Lesson" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.lifeLessons.map((item, index) => (
                        <Card key={item.id} className="border border-gray-200">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium" style={{ color: '#153A4B' }}>Life Lesson {index + 1}</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem('lifeLessons', item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label>Lesson Title</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => handleUpdateItem('lifeLessons', item.id, 'title', e.target.value)}
                                placeholder="e.g., Trust Your Instincts, Invest in Relationships"
                              />
                            </div>
                            <div>
                              <Label>Lesson Description</Label>
                              <Textarea
                                value={item.description}
                                onChange={(e) => handleUpdateItem('lifeLessons', item.id, 'description', e.target.value)}
                                placeholder="Share your life lesson, saying, or piece of wisdom..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={item.location}
                                onChange={(e) => handleUpdateItem('lifeLessons', item.id, 'location', e.target.value)}
                                placeholder="Where is this lesson documented?"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Family Traditions, Archives, and Recipes */}
            <AccordionItem value="family-traditions">
              <AccordionTrigger style={{ color: '#153A4B' }}>Family Traditions, Archives, and Recipes</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold" style={{ color: '#153A4B' }}>Family Traditions</h4>
                    <Button 
                      type="button" 
                      onClick={() => handleAddItem('familyTraditions')}
                      variant="skillbinder_yellow"
                      className="skillbinder_yellow"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      + Add Family Tradition
                    </Button>
                  </div>
                  
                  {formData.familyTraditions.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded-lg">
                      <p>No family traditions added yet. Click "+ Add Family Tradition" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.familyTraditions.map((item, index) => (
                        <Card key={item.id} className="border border-gray-200">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium" style={{ color: '#153A4B' }}>Family Tradition {index + 1}</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveItem('familyTraditions', item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label>Tradition Title</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => handleUpdateItem('familyTraditions', item.id, 'title', e.target.value)}
                                placeholder="e.g., Christmas Cookie Recipe, Sunday Family Dinner"
                              />
                            </div>
                            <div>
                              <Label>Details</Label>
                              <Textarea
                                value={item.description}
                                onChange={(e) => handleUpdateItem('familyTraditions', item.id, 'description', e.target.value)}
                                placeholder="Describe the family tradition, recipe, or archive item..."
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label>Location</Label>
                              <Input
                                value={item.location}
                                onChange={(e) => handleUpdateItem('familyTraditions', item.id, 'location', e.target.value)}
                                placeholder="Where is this tradition documented or stored?"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Wishes for How to Be Remembered */}
            <AccordionItem value="how-to-be-remembered">
              <AccordionTrigger style={{ color: '#153A4B' }}>Wishes for How to Be Remembered</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Personal Legacy Statement</Label>
                      <Textarea
                        value={formData.personalLegacyStatement}
                        onChange={(e) => handleFieldChange('personalLegacyStatement', e.target.value)}
                        placeholder="How do you want to be remembered? What legacy do you want to leave behind?"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Preferred Tributes or Memorials</Label>
                      <Textarea
                        value={formData.preferredTributes}
                        onChange={(e) => handleFieldChange('preferredTributes', e.target.value)}
                        placeholder="What type of memorial or tribute would you prefer? Any specific wishes for your remembrance?"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Save & Continue Button */}
          <div className="flex justify-between items-center mt-8">
            {onPrevious && (
              <Button variant="skillbinder" onClick={onPrevious} className="skillbinder">Previous</Button>
            )}
            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="skillbinder" 
                onClick={handleGeneratePDF}
                className="skillbinder"
              >
                Generate PDF
              </Button>
              <Button type="submit" variant="skillbinder_yellow" className="skillbinder_yellow">Save & Continue</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FinalWishesLegacyPlanningForm; 