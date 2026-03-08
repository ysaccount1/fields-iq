const nodemailer = require('nodemailer');

/**
 * Vercel Serverless Function for Contact Form
 */

// Create SMTP transporter
function getTransporter() {
  const config = {
    host: process.env.smtp_host || 'smtp-relay.gmail.com',
    port: parseInt(process.env.smtp_port || '587'),
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  };

  if (process.env.smtp_user) {
    config.auth = {
      user: process.env.smtp_user,
      pass: process.env.smtp_pass,
    };
  }

  return nodemailer.createTransport(config);
}

// Send contact notification to admin
async function sendContactNotification(formData) {
  const { name, email, subject, message } = formData;
  const timestamp = new Date().toISOString();
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.smtp_from || 'noreply@fields-iq.com',
    to: process.env.admin_email,
    subject: `Contact Form: ${subject} - QSRPro`,
    text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Submitted: ${timestamp}
    `.trim(),
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563EB;">New Contact Form Submission</h2>
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
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;"><strong>Subject:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e0e0e0;">${subject}</td>
    </tr>
  </table>
  <h3 style="margin-top: 20px; color: #333;">Message:</h3>
  <p style="background: #f5f5f5; padding: 15px; border-left: 4px solid #2563EB; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
  <p style="margin-top: 20px; color: #666; font-size: 14px;">Submitted: ${timestamp}</p>
</div>
    `.trim()
  };

  return await transporter.sendMail(mailOptions);
}

// Send confirmation email to user
async function sendContactConfirmation(formData) {
  const { name, email, message } = formData;
  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.smtp_from || 'noreply@fields-iq.com',
    to: email,
    subject: 'We Received Your Message - QSRPro Support',
    text: `
Hi ${name},

Thank you for contacting QSRPro Support. We've received your message and will respond within 24-48 hours.

Your message:
${message}

If you need immediate assistance, please call us at +1 (555) 123-4567.

Best regards,
QSRPro Support Team
    `.trim(),
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2563EB;">We Received Your Message</h2>
  <p>Hi ${name},</p>
  <p>Thank you for contacting QSRPro Support. We've received your message and will respond within <strong>24-48 hours</strong>.</p>
  <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #2563EB; margin: 20px 0;">
    <strong>Your message:</strong>
    <p style="margin-top: 10px; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <p>If you need immediate assistance, please call us at <strong>+1 (555) 123-4567</strong>.</p>
  <p style="margin-top: 30px;">Best regards,<br>QSRPro Support Team</p>
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
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
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

    // Validate subject
    const validSubjects = ['general', 'support', 'sales', 'partnership'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subject value'
      });
    }

    const formData = { name, email, subject, message };

    // Send both emails in parallel
    await Promise.all([
      sendContactNotification(formData),
      sendContactConfirmation(formData)
    ]);

    console.log('Contact emails sent successfully', { email });

    res.status(200).json({
      success: true,
      message: "Thank you for contacting us! We'll respond within 24-48 hours."
    });
  } catch (error) {
    console.error('Contact form submission failed', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.'
    });
  }
};
