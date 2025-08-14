// This is a serverless function that can be deployed to Vercel, Netlify, or similar
// For now, we'll use a simple approach that logs the email content
// In production, you'd integrate with a proper email service like SendGrid, Mailgun, etc.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { to, subject, body, supportData } = req.body;

    // Validate required fields
    if (!to || !subject || !body) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, subject, body' 
      });
    }

    // Log the email content (in production, this would send the actual email)
    console.log('=== SUPPORT REQUEST EMAIL ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('Support Data:', supportData);
    console.log('============================');

    // In production, you would integrate with an email service here
    // Example with SendGrid:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: to,
      from: 'noreply@skillbinder.com', // Your verified sender
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    };
    
    await sgMail.send(msg);
    */

    // For now, we'll simulate a successful email send
    // In a real implementation, you'd want to:
    // 1. Use a proper email service (SendGrid, Mailgun, AWS SES, etc.)
    // 2. Add proper error handling
    // 3. Add rate limiting
    // 4. Add email validation
    // 5. Add spam protection

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully (logged to console)',
      requestId: supportData?.id
    });

  } catch (error) {
    console.error('Error in send-support-email handler:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
} 