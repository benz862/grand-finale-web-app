import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Heart, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PersonalMessageCard from './forms/PersonalMessageCard';
import { useDatabaseSync } from '@/lib/databaseSync';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalMessage {
  id: string;
  recipient_name: string;
  relationship: string;
  message_body: string;
  delivery_timing: string;
  special_date?: string;
  photo_url?: string;
  is_saved?: boolean;
}

interface PersonalMessagesFormProps {
  onNext: () => void;
  onPrevious: () => void;
}

const PersonalMessagesForm: React.FC<PersonalMessagesFormProps> = ({ onNext, onPrevious }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<PersonalMessage[]>([]);
  const { user, loading } = useAuth();
  const { syncForm } = useDatabaseSync();

  useEffect(() => {
    // Load from localStorage for now, will be replaced with database loading
    const savedMessages = localStorage.getItem('personal_messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Start with one empty message
      addMessage();
    }
  }, []);

  const createNewMessage = (): PersonalMessage => ({
    id: Date.now().toString(),
    recipient_name: '',
    relationship: '',
    message_body: '',
    delivery_timing: '',
    special_date: '',
    photo_url: '',
    is_saved: false
  });

  const addMessage = () => {
    const newMessage = createNewMessage();
    setMessages([...messages, newMessage]);
  };

  const updateMessage = (id: string, field: string, value: string) => {
    setMessages(messages.map(message => 
      message.id === id ? { ...message, [field]: value } : message
    ));
  };

  const deleteMessage = (id: string) => {
    if (messages.length > 1) {
      setMessages(messages.filter(message => message.id !== id));
    } else {
      toast({
        title: "Cannot Delete",
        description: "At least one message entry is required.",
        variant: "destructive"
      });
    }
  };

  const validateForm = () => {
    for (const message of messages) {
      if (!message.recipient_name.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a recipient name for all messages.",
          variant: "destructive"
        });
        return false;
      }
      if (!message.message_body.trim()) {
        toast({
          title: "Validation Error",
          description: "Please enter a message for all recipients.",
          variant: "destructive"
        });
        return false;
      }
      if (!message.delivery_timing) {
        toast({
          title: "Validation Error",
          description: "Please select delivery timing for all messages.",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your data.",
        variant: "destructive",
      });
      return;
    }

    // Mark all messages as saved
    const savedMessages = messages.map(msg => ({ ...msg, is_saved: true }));

    try {
      await syncForm(user.email, 'personalMessagesData', savedMessages);
      
      toast({
        title: "Success",
        description: "Personal messages saved to database!",
      });
      
      onNext();
    } catch (error) {
      console.error('Error saving personal messages:', error);
      toast({
        title: "Error",
        description: "Failed to save to database. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💌 Personal Messages to Loved Ones
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Leave heartfelt messages, advice, or final thoughts for specific individuals or groups — a lasting legacy in your own words.
          </p>
        </div>

        <div className="mb-6">
          <Card className="border-2 border-pink-200 bg-pink-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Your Personal Messages
              </CardTitle>
              <p className="text-gray-600">
                Each message will be stored securely and delivered according to your preferences.
              </p>
            </CardHeader>
            <CardContent>
              <Button
                onClick={addMessage}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Message
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {messages.map((message, index) => (
            <PersonalMessageCard
              key={message.id}
              message={message}
              onUpdate={updateMessage}
              onDelete={deleteMessage}
            />
          ))}
        </div>

        {messages.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tips for Writing Personal Messages:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Share specific memories or moments you cherish</li>
              <li>• Include advice or wisdom you want to pass on</li>
              <li>• Express your love and what they mean to you</li>
              <li>• Consider adding a personal photo to make it more meaningful</li>
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous: Obituary & Memory Wishes
          </Button>
          
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            Save & Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalMessagesForm;