const nodemailer = require('nodemailer');

/**
 * Vercel Serverless Function for Early Access Form
 */

// Create SMTP transporter
function getTransporter() {
  const config = {
    host: process.env.SMTP_HOST || process.env.smtp_host || 'smtp-relay.gmail.com',
    port: parseInt(process.env.SMTP_PORT || process.env.smtp_port || '587'),
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  };

  if (process.env.SMTP_USER || process.env.smtp_user) {
    config.auth = {
      user: process.env.SMTP_USER || process.env.smtp_user,
      pass: process.env.SMTP_PASS || process.env.smtp_pass,
    };
  }

  return nodemailer.createTransport(config);
}

// Send early access notification to admin
async function sendEarlyAccessNotification(formData) {
  const { name, email, company, role, locations } = formData;
  const timestamp = new Date().toISOString();
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.smtp_from || 'noreply@fields-iq.com',
    to: process.env.ADMIN_EMAIL || process.env.admin_email,
    subject: 'New Early Access Request - QSRPro',
    text: `
New Early Access Request

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Role: ${role}
Locations: ${locations || 'Not provided'}

Submitted: ${timestamp}
    `.trim(),
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563EB;">New Early Access Request</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Name:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Email:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Company:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${company || 'Not provided'}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Role:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${role}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Locations:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${locations || 'Not provided'}</td>
    </tr>
  </table>
  <p style="margin-top: 20px; color: #666; font-size: 14px;">Submitted: ${timestamp}</p>
</div>
    `.trim()
  };

  return await transporter.sendMail(mailOptions);
}

// Send confirmation email to user
async function sendEarlyAccessConfirmation(formData) {
  const { name, email } = formData;
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.smtp_from || 'noreply@fields-iq.com',
    to: email,
    subject: 'Thank You for Your Interest in QSRPro',
    text: `
Hi ${name},

Thank you for your interest in QSRPro! We've received your early access request.

Our team will review your information and contact you within 24 hours to discuss next steps.

If you have any immediate questions, feel free to reach out to us at support@qsrpro.app.

Best regards,
The QSRPro Team
    `.trim(),
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563EB;">Thank You for Your Interest in QSRPro!</h2>
  <p>Hi ${name},</p>
  <p>We've received your early access request and are excited to have you join us.</p>
  <p>Our team will review your information and contact you within <strong>24 hours</strong> to discuss next steps.</p>
  <p>If you have any immediate questions, feel free to reach out to us at <a href="mailto:support@qsrpro.app" style="color: #2563EB;">support@qsrpro.app</a>.</p>
  <p style="margin-top: 30px;">Best regards,<br>The QSRPro Team</p>
</div>
    `.trim()
  };

  return await transporter.sendMail(mailOptions);
}

// Serverless function handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, email, company, role, locations } = req.body;

    // Validate required fields
    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and role are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate role
    const validRoles = ['franchise_owner', 'technician', 'regional_operator', 'other'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role value'
      });
    }

    const formData = { name, email, company, role, locations };

    // Send both emails in parallel
    await Promise.all([
      sendEarlyAccessNotification(formData),
      sendEarlyAccessConfirmation(formData)
    ]);

    console.log('Early access emails sent successfully', { email });

    res.status(200).json({
      success: true,
      message: 'Thank you for your interest! Check your email for confirmation.'
    });
  } catch (error) {
    console.error('Early access form submission failed', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.'
    });
  }
};
