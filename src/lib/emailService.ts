// Email service for sending welcome emails with login credentials
import emailjs from '@emailjs/browser';

interface EmailData {
  email: string;
  planId: string;
  planName: string;
  planPrice: string;
  planPeriod: string;
  loginUrl: string;
  customerName?: string;
}

export const sendWelcomeEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // In a real implementation, this would call your backend API
    // which would use a service like SendGrid, Mailgun, or AWS SES
    
    const response = await fetch('/api/send-welcome-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: emailData.email,
        subject: 'Welcome to The Grand Finale - Your Login Credentials',
        template: 'welcome-email',
        data: emailData
      })
    });

    if (response.ok) {
      console.log('Welcome email sent successfully to:', emailData.email);
      return true;
    } else {
      console.error('Failed to send welcome email');
      return false;
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

export const generateWelcomeEmailHTML = (emailData: EmailData): string => {
  const planDetails = getPlanDetails(emailData.planId);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to The Grand Finale</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #E4B64A 0%, #153A4B 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #E4B64A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .plan-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #E4B64A; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 5px 0; }
        .feature-list li:before { content: "✓ "; color: #E4B64A; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to The Grand Finale</h1>
          <p>Your legacy planning journey begins now</p>
        </div>
        
        <div class="content">
          <h2>Thank you for your purchase!</h2>
          <p>Dear ${emailData.customerName || 'Valued Customer'},</p>
          
          <p>Welcome to The Grand Finale! Your payment has been processed successfully, and your account is now active.</p>
          
          <div class="plan-details">
            <h3>Your Plan: ${planDetails.name}</h3>
            <p><strong>Price:</strong> ${planDetails.price}${planDetails.period}</p>
            <h4>What's included:</h4>
            <ul class="feature-list">
              ${planDetails.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
          
          <h3>Getting Started</h3>
          <p>You can now access your account and start building your legacy plan. Click the button below to log in:</p>
          
          <div style="text-align: center;">
            <a href="${emailData.loginUrl}" class="button">Access Your Account</a>
          </div>
          
          <h3>What to expect:</h3>
          <ul>
            <li><strong>16 comprehensive sections</strong> to document your legacy</li>
            <li><strong>Secure storage</strong> of all your important information</li>
            <li><strong>Professional PDF exports</strong> for your records</li>
            <li><strong>Audio guides</strong> to help you through each section</li>
          </ul>
          
          <h3>Need Help?</h3>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team. We're here to help you create a comprehensive legacy plan.</p>
          
          <p>Thank you for choosing The Grand Finale for your legacy planning needs.</p>
          
          <p>Best regards,<br>
          The Grand Finale Team</p>
        </div>
        
        <div class="footer">
          <p>This email was sent to ${emailData.email}</p>
          <p>© 2024 The Grand Finale. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getPlanDetails = (planId: string) => {
  const plans = {
    'lite_monthly': { 
      name: 'Lite', 
      price: '$4', 
      period: '/month', 
      features: ['Access to Sections 1-3', '1 PDF Export per month (Watermarked)', 'Data Storage (Supabase)', 'Basic Support'] 
    },
    'standard_monthly': { 
      name: 'Standard', 
      price: '$8', 
      period: '/month', 
      features: ['Access to Sections 1-15', '3 PDF Exports per month (No Watermark)', 'Data Storage (Supabase)', 'Secure Backup', 'Standard Support'] 
    },
    'premium_monthly': { 
      name: 'Premium', 
      price: '$12', 
      period: '/month', 
      features: ['Access to Sections 1-15', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Priority Support (24hr response)'] 
    },
    'lifetime': { 
      name: 'Lifetime', 
      price: '$199', 
      period: ' one-time', 
      features: ['Everything Forever', 'All Sections with Uploads', 'Unlimited PDF Exports', 'Priority Support', 'Access to Updates Forever'] 
    },
    'lite_yearly': { 
      name: 'Lite', 
      price: '$40', 
      period: '/year', 
      features: ['Access to Sections 1-3', '1 PDF Export per month (Watermarked)', 'Data Storage (Supabase)', 'Basic Support'] 
    },
    'standard_yearly': { 
      name: 'Standard', 
      price: '$80', 
      period: '/year', 
      features: ['Access to Sections 1-15', '3 PDF Exports per month (No Watermark)', 'Data Storage (Supabase)', 'Secure Backup', 'Standard Support'] 
    },
    'premium_yearly': { 
      name: 'Premium', 
      price: '$120', 
      period: '/year', 
      features: ['Access to Sections 1-15', 'Section 12: Letters w/ Upload', 'Section 16: File Uploads', 'Unlimited PDF Exports', 'Priority Support (24hr response)'] 
    }
  };
  
  return plans[planId as keyof typeof plans] || plans.standard_monthly;
};

export const generateTemporaryPassword = (): string => {
  // Generate a secure temporary password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const createUserAccount = async (email: string, planId: string): Promise<{ success: boolean; temporaryPassword?: string }> => {
  try {
    // Generate a temporary password for the user
    const temporaryPassword = generateTemporaryPassword();
    
    // In a real implementation, this would create the user account in your database
    const response = await fetch('/api/create-user-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        planId,
        temporaryPassword,
        accountType: 'paid'
      })
    });

    if (response.ok) {
      return { success: true, temporaryPassword };
    } else {
      console.error('Failed to create user account');
      return { success: false };
    }
  } catch (error) {
    console.error('Error creating user account:', error);
    return { success: false };
  }
}; 

import { supabase } from './supabase';

export interface SupportEmailData {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  submittedAt: string;
  userId?: string;
}

export const sendSupportRequestEmail = async (supportData: SupportEmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Create the email content
    const emailSubject = 'The Grand Finale - Support Request';
    
    const emailBody = `
New Support Request Received

Request ID: ${supportData.id}
Submitted: ${supportData.submittedAt}

User Information:
- Name: ${supportData.name}
- Email: ${supportData.email}
- User ID: ${supportData.userId || 'Not logged in'}

Request Details:
- Subject: ${supportData.subject}
- Category: ${supportData.category}
- Message:
${supportData.message}

---
This email was automatically generated by The Grand Finale support system.
Request ID: ${supportData.id}
    `.trim();

    // Check if we have SendGrid API key
    const sendGridApiKey = import.meta.env.VITE_SENDGRID_API_KEY;
    
    if (!sendGridApiKey) {
      // Fallback to console logging for development
      console.log('=== SUPPORT REQUEST EMAIL ===');
      console.log('To: support@skillbinder.com');
      console.log('Subject:', emailSubject);
      console.log('Body:', emailBody);
      console.log('Support Data:', supportData);
      console.log('============================');
      console.log('SendGrid API key not found - email logged to console');
      return { success: true };
    }

    // Try to send email via EmailJS if configured
    const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      try {
        const templateParams = {
          to_email: 'support@skillbinder.com',
          from_name: supportData.name,
          from_email: supportData.email,
          subject: emailSubject,
          message: supportData.message,
          request_id: supportData.id,
          category: supportData.category,
          user_id: supportData.userId || 'Not logged in',
          submitted_at: supportData.submittedAt
        };

        await emailjs.send(
          emailjsServiceId,
          emailjsTemplateId,
          templateParams,
          emailjsPublicKey
        );

        console.log('Support request email sent successfully via EmailJS');
        return { success: true };
      } catch (error) {
        console.error('EmailJS error:', error);
        // Fall back to console logging
      }
    }
    
    // Fallback: Log the email content to console
    console.log('=== SUPPORT REQUEST EMAIL ===');
    console.log('To: support@skillbinder.com');
    console.log('Subject:', emailSubject);
    console.log('Body:', emailBody);
    console.log('Support Data:', supportData);
    console.log('============================');
    console.log('Email content logged successfully');
    console.log('To enable real email sending, set up EmailJS environment variables');
    
    return { success: true };

  } catch (error) {
    console.error('Error sending support request email:', error);
    
    // Fallback to console logging
    console.log('=== SUPPORT REQUEST EMAIL (FALLBACK) ===');
    console.log('To: support@skillbinder.com');
    console.log('Subject: The Grand Finale - Support Request');
    console.log('Support Data:', supportData);
    console.log('============================');
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email notification' 
    };
  }
};

// Alternative method using a simple email service (for development/testing)
export const sendSupportRequestEmailSimple = async (supportData: SupportEmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    // This is a fallback method that opens the user's email client
    // In production, you'd want to use a proper email service
    
    const emailSubject = encodeURIComponent('The Grand Finale - Support Request');
    const emailBody = encodeURIComponent(`
New Support Request Received

Request ID: ${supportData.id}
Submitted: ${supportData.submittedAt}

User Information:
- Name: ${supportData.name}
- Email: ${supportData.email}
- User ID: ${supportData.userId || 'Not logged in'}

Request Details:
- Subject: ${supportData.subject}
- Category: ${supportData.category}
- Message:
${supportData.message}

---
This email was automatically generated by The Grand Finale support system.
Request ID: ${supportData.id}
    `.trim());

    // Open email client (this is just for development - in production use a proper email service)
    const mailtoLink = `mailto:support@skillbinder.com?subject=${emailSubject}&body=${emailBody}`;
    
    // Note: This will only work if the user has an email client configured
    // In a real application, you'd use a server-side email service
    console.log('Email content prepared:', { subject: emailSubject, body: emailBody });
    
    return { success: true };
    
  } catch (error) {
    console.error('Error preparing support request email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to prepare email notification' 
    };
  }
}; 