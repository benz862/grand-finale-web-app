# 💕 Couples Bundle Implementation Guide

## Overview

The Couples Bundle feature allows couples to purchase discounted access to The Grand Finale while maintaining complete privacy between their accounts. Each bundle provides two separate accounts with 25% savings compared to individual purchases.

## 🎯 Key Features

- **Two Separate Accounts**: Complete privacy between partners
- **25% Savings**: Discounted pricing for couples
- **Secure Invitation System**: Email-based partner invitation
- **30-Day Expiration**: Invitations expire for security
- **Bundle Management**: Track bundle status and user relationships

## 🏗️ Database Schema

### `bundle_purchases` Table
```sql
CREATE TABLE bundle_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  primary_user_email TEXT NOT NULL,
  secondary_invite_email TEXT,
  secondary_user_id UUID,
  plan_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
  invite_token TEXT,
  invite_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `users` Table Updates
```sql
-- Add bundle_id column to users table
ALTER TABLE users ADD COLUMN bundle_id UUID REFERENCES bundle_purchases(id);
```

## 🔄 User Flow

### 1. Purchase Flow
1. User visits `/couples-pricing`
2. Selects a couples bundle plan
3. Completes Stripe checkout
4. Redirected to `/invite-partner?session_id=xyz`

### 2. Invitation Flow
1. Primary user enters partner's email
2. System validates email uniqueness
3. Invitation email sent with secure link
4. Partner clicks link to register

### 3. Registration Flow
1. Partner clicks invite link
2. System validates invite token
3. Partner creates account with password
4. Bundle status updated to 'active'

## 🛠️ Frontend Components

### 1. `CouplesPricingPage.tsx`
- Displays couples bundle pricing options
- Handles Stripe checkout initiation
- Shows 25% savings compared to individual plans

### 2. `InvitePartnerPage.tsx`
- Shows after successful checkout
- Allows primary user to invite partner
- Displays bundle information and status
- Handles invite resending

### 3. `PartnerRegistrationPage.tsx`
- Partner registration form
- Validates invite token
- Creates partner account
- Links to bundle

## 🔧 Backend API Endpoints

### 1. Create Checkout Session
```javascript
POST /api/stripe/create-couples-checkout-session
{
  "priceId": "price_1Rok3hE6oTidvpnUNU4SHFSA",
  "email": "user@example.com"
}
```

### 2. Stripe Webhook
```javascript
POST /api/stripe/webhook
// Handles checkout.session.completed events
// Creates bundle_purchases record
// Creates/updates Supabase Auth user
```

### 3. Get Bundle Info
```javascript
GET /api/stripe/bundle/:sessionId
// Returns bundle information
```

### 4. Send Partner Invite
```javascript
POST /api/stripe/send-partner-invite
{
  "sessionId": "cs_xxx",
  "partnerEmail": "partner@example.com"
}
```

### 5. Validate Invite
```javascript
GET /api/stripe/validate-invite/:bundleId/:token
// Validates invite token and returns email
```

### 6. Register Partner
```javascript
POST /api/stripe/register-partner
{
  "bundleId": "uuid",
  "inviteToken": "token",
  "email": "partner@example.com",
  "password": "securepassword"
}
```

## 💳 Stripe Price IDs

| Plan | Price ID |
|------|----------|
| Lifetime Couples | `price_1Rok3hE6oTidvpnUNU4SHFSA` |
| Lite Couples Monthly | `price_1Rok5LE6oTidvpnUSQB2GMCw` |
| Standard Couples Monthly | `price_1Rok6AE6oTidvpnUHjp4lPXT` |
| Premium Couples Monthly | `price_1RokFkE6oTidvpnUOd5lfhuu` |
| Lite Couples Yearly | `price_1RokHAE6oTidvpnUnzBNHLNn` |
| Standard Couples Yearly | `price_1RokJAE6oTidvpnUeqfK3JDN` |
| Premium Couples Yearly | `price_1RokJtE6oTidvpnUFh8Kocvj` |

## 🔒 Security Features

### 1. Email Uniqueness
- Primary and partner emails must be different
- Partner email cannot be used in other bundles
- Prevents duplicate account creation

### 2. Invite Token Security
- 32-character random hex token
- 30-day expiration
- Single-use validation
- Secure token generation

### 3. Bundle Status Tracking
- `pending`: Waiting for partner registration
- `active`: Both accounts created and linked

## 📧 Email Integration

The system includes a placeholder for email service integration:

```javascript
async function sendInviteEmail(partnerEmail, bundleId, inviteToken) {
  const inviteUrl = `${process.env.APP_URL}/register-partner?bundle=${bundleId}&token=${inviteToken}`;
  
  // Integrate with your preferred email service:
  // - SendGrid
  // - AWS SES
  // - Mailgun
  // - Nodemailer
}
```

## 🚀 Deployment Requirements

### Environment Variables
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
APP_URL=https://your-domain.com

# Email Service (optional)
EMAIL_SERVICE_API_KEY=your-email-service-key
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "stripe": "^14.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "crypto": "^1.0.1"
  }
}
```

## 🧪 Testing

### Test Scenarios
1. **Successful Purchase Flow**
   - User purchases bundle
   - Webhook creates bundle record
   - User can invite partner

2. **Invitation Flow**
   - Primary user sends invite
   - Partner receives email
   - Partner registers successfully

3. **Security Tests**
   - Duplicate email prevention
   - Expired invite handling
   - Invalid token rejection

4. **Error Handling**
   - Network failures
   - Invalid data
   - Stripe errors

### Test Data
```javascript
// Test bundle purchase
const testBundle = {
  stripe_session_id: "cs_test_xxx",
  primary_user_email: "primary@test.com",
  plan_type: "price_1Rok3hE6oTidvpnUNU4SHFSA",
  status: "pending"
};

// Test invite
const testInvite = {
  sessionId: "cs_test_xxx",
  partnerEmail: "partner@test.com"
};
```

## 🔄 Bundle Management

### Bundle Status Updates
- **Pending**: Created after purchase, waiting for partner
- **Active**: Both accounts created and linked

### User Linking
- Primary user linked via `user_metadata.bundle_id`
- Secondary user linked via `users.bundle_id` column
- Both users get same plan benefits

### Bundle Queries
```sql
-- Get active bundles
SELECT * FROM bundle_purchases WHERE status = 'active';

-- Get pending invites
SELECT * FROM bundle_purchases 
WHERE status = 'pending' 
AND invite_expires_at > NOW();

-- Get user's bundle
SELECT bp.* FROM bundle_purchases bp
JOIN users u ON u.bundle_id = bp.id
WHERE u.email = 'user@example.com';
```

## 🎨 UI/UX Features

### Visual Design
- Heart and couple-themed icons
- Pink/purple gradient for couples branding
- Clear privacy messaging
- Step-by-step progress indicators

### User Experience
- Clear pricing comparison
- Simple invitation process
- Secure registration flow
- Helpful error messages

## 📊 Analytics & Monitoring

### Key Metrics
- Bundle purchase conversion rate
- Invitation acceptance rate
- Partner registration completion
- Bundle activation time

### Monitoring Points
- Stripe webhook failures
- Invite token validation errors
- Email delivery issues
- Database constraint violations

## 🔮 Future Enhancements

### Potential Features
1. **Bundle Management Dashboard**
   - View bundle status
   - Resend invitations
   - Manage partner relationships

2. **Shared Features**
   - Optional document sharing
   - Joint planning tools
   - Family collaboration

3. **Advanced Security**
   - Two-factor authentication
   - IP-based restrictions
   - Audit logging

4. **Communication Tools**
   - In-app messaging
   - Shared notifications
   - Planning reminders

## 🐛 Troubleshooting

### Common Issues
1. **Webhook Failures**
   - Check Stripe webhook endpoint
   - Verify webhook secret
   - Monitor webhook logs

2. **Invite Token Issues**
   - Check token expiration
   - Verify bundle status
   - Validate email uniqueness

3. **Database Errors**
   - Check foreign key constraints
   - Verify table structure
   - Monitor connection limits

### Debug Commands
```sql
-- Check bundle status
SELECT * FROM bundle_purchases WHERE stripe_session_id = 'cs_xxx';

-- Verify user linking
SELECT u.email, bp.status 
FROM users u 
JOIN bundle_purchases bp ON u.bundle_id = bp.id;

-- Check expired invites
SELECT * FROM bundle_purchases 
WHERE status = 'pending' 
AND invite_expires_at < NOW();
```

## 📝 Implementation Checklist

- [ ] Database schema created
- [ ] Stripe price IDs configured
- [ ] Frontend components built
- [ ] Backend API endpoints implemented
- [ ] Webhook handler tested
- [ ] Email service integrated
- [ ] Security validation added
- [ ] Error handling implemented
- [ ] UI/UX polished
- [ ] Testing completed
- [ ] Documentation updated
- [ ] Deployment ready

## 🎉 Success Metrics

- Bundle purchase conversion rate > 15%
- Invitation acceptance rate > 70%
- Partner registration completion > 85%
- Average bundle activation time < 48 hours
- Customer satisfaction score > 4.5/5

---

**Note**: This implementation provides a solid foundation for couples bundles while maintaining security and privacy. The modular design allows for easy extension and customization based on specific business needs. 