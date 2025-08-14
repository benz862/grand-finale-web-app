// Real Stripe integration service

interface StripeConfig {
  publishableKey: string;
  secretKey?: string; // Only needed on backend
}

interface CreatePaymentIntentRequest {
  amount: number; // in cents
  currency: string;
  email: string;
  planId: string;
  metadata?: Record<string, string>;
}

interface CreateCheckoutSessionRequest {
  amount: number;
  currency: string;
  email: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

interface CheckoutSessionResponse {
  success: boolean;
  sessionUrl?: string;
  sessionId?: string;
  error?: string;
}

// Initialize Stripe (call this in your app initialization)
export const initializeStripe = (config: StripeConfig) => {
  // In a real implementation, you'd load Stripe.js here
  // For now, we'll use the backend API approach
  console.log('Stripe initialized with publishable key:', config.publishableKey);
};

// Create a Payment Intent (for embedded payment forms)
export const createPaymentIntent = async (request: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> => {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency || 'usd',
        email: request.email,
        planId: request.planId,
        metadata: {
          planId: request.planId,
          customerEmail: request.email,
          ...request.metadata
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to create payment intent'
      };
    }
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return {
      success: false,
      error: 'Network error creating payment intent'
    };
  }
};

// Create a Checkout Session (for hosted checkout)
export const createCheckoutSession = async (request: CreateCheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency || 'usd',
        email: request.email,
        planId: request.planId,
        successUrl: request.successUrl,
        cancelUrl: request.cancelUrl,
        metadata: {
          planId: request.planId,
          customerEmail: request.email,
          ...request.metadata
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        sessionUrl: result.sessionUrl,
        sessionId: result.sessionId
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

// Verify payment status
export const verifyPaymentStatus = async (sessionId: string): Promise<{ success: boolean; paid: boolean; error?: string }> => {
  try {
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

// Get customer information
export const getCustomerInfo = async (customerId: string): Promise<{ success: boolean; customer?: any; error?: string }> => {
  try {
    const response = await fetch(`/api/stripe/customer/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        customer: result.customer
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to get customer info'
      };
    }
  } catch (error) {
    console.error('Get customer info error:', error);
    return {
      success: false,
      error: 'Network error getting customer info'
    };
  }
};

// Create or retrieve customer
export const createOrRetrieveCustomer = async (email: string, name?: string): Promise<{ success: boolean; customerId?: string; error?: string }> => {
  try {
    const response = await fetch('/api/stripe/customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name
      })
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        customerId: result.customerId
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to create/retrieve customer'
      };
    }
  } catch (error) {
    console.error('Create/retrieve customer error:', error);
    return {
      success: false,
      error: 'Network error creating/retrieving customer'
    };
  }
};

// Get subscription information
export const getSubscriptionInfo = async (subscriptionId: string): Promise<{ success: boolean; subscription?: any; error?: string }> => {
  try {
    const response = await fetch(`/api/stripe/subscription/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        subscription: result.subscription
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to get subscription info'
      };
    }
  } catch (error) {
    console.error('Get subscription info error:', error);
    return {
      success: false,
      error: 'Network error getting subscription info'
    };
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`/api/stripe/subscription/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to cancel subscription'
      };
    }
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return {
      success: false,
      error: 'Network error canceling subscription'
    };
  }
};

// Get plan pricing information
export const getPlanPricing = (planId: string) => {
  const pricing = {
    'lite_monthly': { amount: 400, currency: 'usd', name: 'Lite Monthly', interval: 'month' },
    'standard_monthly': { amount: 800, currency: 'usd', name: 'Standard Monthly', interval: 'month' },
    'premium_monthly': { amount: 1200, currency: 'usd', name: 'Premium Monthly', interval: 'month' },
    'lifetime': { amount: 19900, currency: 'usd', name: 'Lifetime', interval: 'one-time' },
    'lite_yearly': { amount: 4000, currency: 'usd', name: 'Lite Yearly', interval: 'year' },
    'standard_yearly': { amount: 8000, currency: 'usd', name: 'Standard Yearly', interval: 'year' },
    'premium_yearly': { amount: 12000, currency: 'usd', name: 'Premium Yearly', interval: 'year' }
  };
  
  return pricing[planId as keyof typeof pricing] || pricing.standard_monthly;
}; 