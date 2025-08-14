# Stripe Backend API Documentation

This document outlines the backend API endpoints required to support the Stripe payment integration for The Grand Finale web app.

## Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook secret for payment confirmation
```

## API Endpoints

### 1. Create Payment Intent
**POST** `/api/stripe/create-payment-intent`

Creates a Stripe Payment Intent for embedded payment forms.

**Request Body:**
```json
{
  "amount": 800,
  "currency": "usd",
  "email": "customer@example.com",
  "planId": "standard_monthly",
  "metadata": {
    "planId": "standard_monthly",
    "customerEmail": "customer@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_..."
}
```

### 2. Create Checkout Session
**POST** `/api/stripe/create-checkout-session`

Creates a Stripe Checkout Session for hosted checkout.

**Request Body:**
```json
{
  "amount": 800,
  "currency": "usd",
  "email": "customer@example.com",
  "planId": "standard_monthly",
  "successUrl": "https://yourapp.com/payment-success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://yourapp.com/pricing",
  "metadata": {
    "planId": "standard_monthly",
    "customerEmail": "customer@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionUrl": "https://checkout.stripe.com/pay/...",
  "sessionId": "cs_..."
}
```

### 3. Verify Payment Status
**GET** `/api/stripe/verify-payment?session_id=cs_...`

Verifies if a payment was successful.

**Response:**
```json
{
  "success": true,
  "paid": true,
  "session": {
    "id": "cs_...",
    "payment_status": "paid",
    "customer_email": "customer@example.com",
    "metadata": {
      "planId": "standard_monthly"
    }
  }
}
```

### 4. Create or Retrieve Customer
**POST** `/api/stripe/customer`

Creates a new Stripe customer or retrieves existing one.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "customerId": "cus_...",
  "customer": {
    "id": "cus_...",
    "email": "customer@example.com",
    "name": "John Doe"
  }
}
```

### 5. Get Customer Information
**GET** `/api/stripe/customer/{customerId}`

Retrieves customer information from Stripe.

**Response:**
```json
{
  "success": true,
  "customer": {
    "id": "cus_...",
    "email": "customer@example.com",
    "name": "John Doe",
    "subscriptions": {
      "data": [...]
    }
  }
}
```

### 6. Get Subscription Information
**GET** `/api/stripe/subscription/{subscriptionId}`

Retrieves subscription details.

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_...",
    "status": "active",
    "current_period_end": 1234567890,
    "plan": {
      "id": "price_...",
      "nickname": "Standard Monthly"
    }
  }
}
```

### 7. Cancel Subscription
**POST** `/api/stripe/subscription/{subscriptionId}/cancel`

Cancels a subscription.

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_...",
    "status": "canceled"
  }
}
```

## Webhook Endpoints

### Payment Confirmation Webhook
**POST** `/api/stripe/webhooks`

Handles Stripe webhooks for payment confirmation and subscription events.

**Events to handle:**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Implementation Example (Node.js/Express)

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

// Create Checkout Session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency, email, planId, successUrl, cancelUrl, metadata } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency,
          product_data: {
            name: `The Grand Finale - ${planId}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: metadata,
    });

    res.json({
      success: true,
      sessionUrl: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify Payment Status
app.get('/api/stripe/verify-payment', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    res.json({
      success: true,
      paid: session.payment_status === 'paid',
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        metadata: session.metadata
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Webhook handler
app.post('/api/stripe/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Handle successful payment
      console.log('Payment successful:', session.id);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      // Handle subscription payment
      console.log('Subscription payment successful:', invoice.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(3001, () => {
  console.log('Stripe API server running on port 3001');
});
```

## Security Considerations

1. **Never expose your Stripe secret key** in frontend code
2. **Always verify webhook signatures** to prevent replay attacks
3. **Use HTTPS** for all API endpoints in production
4. **Implement rate limiting** to prevent abuse
5. **Validate all input data** before processing
6. **Log all payment events** for audit trails
7. **Handle errors gracefully** and provide meaningful error messages

## Testing

Use Stripe's test mode with these test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires authentication:** 4000 0025 0000 3155

## Production Checklist

- [ ] Set up Stripe webhooks in production
- [ ] Configure proper error handling and logging
- [ ] Implement retry logic for failed payments
- [ ] Set up monitoring and alerting
- [ ] Test the complete payment flow
- [ ] Implement proper customer data handling (GDPR compliance)
- [ ] Set up subscription management features
- [ ] Configure proper CORS settings
- [ ] Implement rate limiting
- [ ] Set up SSL/TLS certificates 