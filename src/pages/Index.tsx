
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import AuthScreen from '@/components/AuthScreen';
import { AppProvider } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTrial } from '@/contexts/TrialContext';

const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { activateTrial } = useTrial();
  const [showAuth, setShowAuth] = useState(false);

  // Check if user wants to start trial when component mounts
  useEffect(() => {
    const startingTrial = localStorage.getItem('startingTrial');
    if (startingTrial && isAuthenticated) {
      // User is authenticated and wants to start trial
      activateTrial();
      localStorage.removeItem('startingTrial');
      console.log('Trial activated for existing authenticated user');
    }
  }, [isAuthenticated, activateTrial]);

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated || showAuth) {
    return (
      <AuthScreen onAuthSuccess={() => setShowAuth(false)} />
    );
  }

  // Show main app if authenticated
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;
