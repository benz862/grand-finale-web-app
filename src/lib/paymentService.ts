// Payment service for handling Stripe integration

interface PaymentRequest {
  email: string;
  planId: string;
  amount: number; // in cents
  currency?: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export const processStripePayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    // In a real implementation, this would:
    // 1. Create a Stripe PaymentIntent
    // 2. Handle the payment flow
    // 3. Return the result

    // Simulate API call to your backend
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        email: paymentData.email,
        planId: paymentData.planId,
        metadata: {
          planId: paymentData.planId,
          customerEmail: paymentData.email
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        transactionId: result.transactionId || `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Payment processing failed'
      };
    }
  } catch (error) {
    console.error('Stripe payment error:', error);
    return {
      success: false,
      error: 'Network error during payment processing'
    };
  }
};

export const createStripeCheckoutSession = async (paymentData: PaymentRequest): Promise<{ success: boolean; sessionUrl?: string; error?: string }> => {
  try {
    // This would create a Stripe Checkout Session for hosted checkout
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: paymentData.amount,
        currency: paymentData.currency || 'usd',
        email: paymentData.email,
        planId: paymentData.planId,
        successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
        metadata: {
          planId: paymentData.planId,
          customerEmail: paymentData.email
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        sessionUrl: result.sessionUrl
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to create checkout session'
      };
    }
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return {
      success: false,
      error: 'Network error creating checkout session'
    };
  }
};

export const verifyPaymentStatus = async (sessionId: string): Promise<{ success: boolean; paid: boolean; error?: string }> => {
  try {
    // Verify payment status with Stripe
    const response = await fetch(`/api/stripe/verify-payment?session_id=${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        paid: result.paid || false
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        paid: false,
        error: error.message || 'Failed to verify payment'
      };
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      paid: false,
      error: 'Network error verifying payment'
    };
  }
};

// Demo mode payment processing (for development)
export const processDemoPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate 95% success rate
  const isSuccess = Math.random() > 0.05;
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: `demo_txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  } else {
    return {
      success: false,
      error: 'Demo payment failed (simulated)'
    };
  }
};

// Get plan pricing information
export const getPlanPricing = (planId: string) => {
  const pricing = {
    'lite_monthly': { amount: 400, currency: 'usd', name: 'Lite Monthly' },
    'standard_monthly': { amount: 800, currency: 'usd', name: 'Standard Monthly' },
    'premium_monthly': { amount: 1200, currency: 'usd', name: 'Premium Monthly' },
    'lifetime': { amount: 19900, currency: 'usd', name: 'Lifetime' },
    'lite_yearly': { amount: 4000, currency: 'usd', name: 'Lite Yearly' },
    'standard_yearly': { amount: 8000, currency: 'usd', name: 'Standard Yearly' },
    'premium_yearly': { amount: 12000, currency: 'usd', name: 'Premium Yearly' }
  };
  
  return pricing[planId as keyof typeof pricing] || pricing.standard_monthly;
}; 