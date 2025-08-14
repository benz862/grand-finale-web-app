# The Grand Finale - Legacy Planning Web App

A comprehensive web application for creating and organizing personal legacy documents, final wishes, and important information for loved ones.

## Features

- **16 Comprehensive Sections** covering all aspects of legacy planning
- **Audio Guides** for each section with professional narration
- **PDF Export** with beautiful formatting and QR codes
- **File Uploads** for photos, videos, and documents
- **Trial System** with 7-day free trial and upgrade flow
- **User Authentication** with secure login/signup
- **Stripe Payment Integration** for subscription management
- **Responsive Design** optimized for all devices
- **Data Persistence** with local storage and cloud backup

## Sections Included

1. **Personal Information** - Basic details and contact info
2. **Legal & Estate Planning** - Wills, executors, legal documents
3. **Financial Information** - Accounts, investments, insurance
4. **Medical Information** - Health history, medications, providers
5. **Key Contacts** - Emergency contacts and important relationships
6. **Digital Life** - Online accounts and digital assets
7. **Personal Property & Real Estate** - Assets and property details
8. **Pets & Animal Care** - Pet information and care instructions
9. **Funeral & Final Arrangements** - End-of-life preferences
10. **Obituary & Memory Wishes** - Memorial and remembrance details
11. **Short Letters to Loved Ones** - Personal messages and delivery
12. **Practical Life Tips** - Household and transition guidance
13. **Final Wishes & Legacy Planning** - Ethical will and legacy projects
14. **Accounts & Memberships** - Subscriptions and memberships
15. **Formal Letters** - Legal and formal correspondence
16. **File Uploads & Multimedia** - Photos, videos, and documents

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Authentication**: Custom auth system with localStorage
- **Payments**: Stripe Checkout for secure payment processing
- **Storage**: Supabase for file uploads and data backup
- **PDF Generation**: Custom PDF generator with QR codes
- **Audio**: HTML5 Audio API with custom player

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for file storage)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd the-grand-finale-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## Stripe Integration

The app includes a complete Stripe payment integration for subscription management:

### Frontend Integration
- **Stripe Service** (`src/lib/stripeService.ts`) - Handles all Stripe API calls
- **Payment Portal** (`src/components/PaymentPortal.tsx`) - Secure payment form
- **Payment Success** (`src/components/PaymentSuccess.tsx`) - Post-payment processing
- **Pricing Page** (`src/components/PricingPage.tsx`) - Plan selection and checkout

### Backend Requirements
You'll need to implement the backend API endpoints documented in `STRIPE_BACKEND_API.md`:

- Create checkout sessions
- Verify payment status
- Handle webhooks
- Manage customers and subscriptions

### Testing
Use Stripe's test mode with these test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

## Trial System

The app includes a comprehensive trial system:

- **7-day free trial** with no credit card required
- **Limited access** to sections 1-2 plus read-only section 3
- **No file uploads** or QR code generation during trial
- **Data persistence** - trial data is preserved after upgrade
- **Upgrade prompts** throughout the app
- **Trial banner** showing remaining time and upgrade benefits

## File Structure

```
src/
├── components/          # React components
│   ├── forms/          # Form sections and components
│   ├── ui/             # Shadcn/ui components
│   └── *.tsx           # Main form components
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── TrialContext.tsx # Trial system state
├── lib/                # Utility libraries
│   ├── stripeService.ts # Stripe integration
│   ├── emailService.ts # Email functionality
│   ├── pdfGenerator.ts # PDF generation
│   └── supabase.ts     # Supabase client
├── pages/              # Page components
└── hooks/              # Custom React hooks
```

## Deployment

### Frontend Deployment
The app can be deployed to any static hosting service:

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod`
   - GitHub Pages: Configure GitHub Actions
   - AWS S3: Upload `dist/` folder

### Backend Deployment
Deploy your Stripe API backend to:
- Vercel Functions
- Netlify Functions
- AWS Lambda
- Heroku
- DigitalOcean App Platform

## Security Considerations

- **Environment Variables**: Never commit sensitive keys to version control
- **Stripe Keys**: Use test keys for development, live keys for production
- **CORS**: Configure proper CORS settings for your backend API
- **HTTPS**: Always use HTTPS in production
- **Webhook Verification**: Always verify Stripe webhook signatures

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@thegrandfinale.com
- Documentation: See `STRIPE_BACKEND_API.md` for backend setup
- Issues: Create an issue in the GitHub repository

## Roadmap

- [ ] Subscription management dashboard
- [ ] Advanced PDF customization options
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Family sharing features (future consideration)
- [ ] Integration with legal document services
- [ ] Advanced backup and sync options
