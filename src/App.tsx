import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TrialProvider } from './contexts/TrialContext';
import { LocalizationProvider } from './contexts/LocalizationContext';
import { AppProvider } from './contexts/AppContext';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import PricingPage from './components/PricingPage';
import CouplesPricingPage from './components/CouplesPricingPage';
import InvitePartnerPage from './components/InvitePartnerPage';
import PartnerRegistrationPage from './components/PartnerRegistrationPage';
import PaymentPortal from './components/PaymentPortal';
import CouplesPaymentPortal from './components/CouplesPaymentPortal';
import PaymentSuccess from './components/PaymentSuccess';
import LifetimeSuccessPage from './components/LifetimeSuccessPage';
import LifetimeSuccessShareable from './components/LifetimeSuccessShareable';
import CouplesSuccessPage from './components/CouplesSuccessPage';
import ManageBilling from './components/ManageBilling';
import AccountSettings from './components/AccountSettings';
import SubscriptionGuard from './components/SubscriptionGuard';
import SubscriptionBanner from './components/SubscriptionBanner';
import SupportAdminPanel from './components/SupportAdminPanel';
import SupportSuccessPage from './components/SupportSuccessPage';
import './index.css';

const App = () => {
  console.log('App is rendering with proper routing!');
  
  const handlePaymentSuccess = (email: string, planId: string) => {
    console.log('Payment successful for:', email, 'Plan:', planId);
    // This would typically redirect to success page or update user state
  };
  
  return (
    <LocalizationProvider>
      <AuthProvider>
        <TrialProvider>
          <AppProvider>
            <BrowserRouter>
              <div className="App">
                <SubscriptionBanner />
                <Routes>
                  <Route path="/" element={<PricingPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/couples-pricing" element={<CouplesPricingPage />} />
                  <Route path="/invite-partner" element={<InvitePartnerPage />} />
                  <Route path="/register-partner/:bundleId/:token" element={<PartnerRegistrationPage />} />
                  <Route path="/payment" element={<PaymentPortal onPaymentSuccess={handlePaymentSuccess} />} />
                  <Route path="/couples-payment" element={<CouplesPaymentPortal onPaymentSuccess={handlePaymentSuccess} />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/lifetime-success" element={<LifetimeSuccessPage />} />
                  <Route path="/lifetime-success-demo" element={<LifetimeSuccessShareable />} />
                  <Route path="/couples-success" element={<CouplesSuccessPage />} />
                  <Route path="/manage-billing" element={<ManageBilling />} />
                  <Route path="/account-settings" element={<AccountSettings />} />
                  <Route path="/admin/support" element={<SupportAdminPanel />} />
                  <Route path="/support-success" element={<SupportSuccessPage />} />
                  <Route
                    path="/app" 
                    element={
                      <SubscriptionGuard>
                        <Index />
                      </SubscriptionGuard>
                    } 
                  />
                  <Route path="*" element={<PricingPage />} />
                </Routes>
                <Toaster />
              </div>
            </BrowserRouter>
          </AppProvider>
        </TrialProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default App;
