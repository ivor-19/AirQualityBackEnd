// controllers/emailController.js
const transporter = require('../config/nodeMailerConfig');

// Controller for sending email
const sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  // Validate the inputs
  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide "to", "subject", and "message".',
    });
  }

  // Setup email options
  const mailOptions = {
    from: '"AirGuard Alert" <airguard.alert@gmail.com>', // Add a sender name
    to,
    subject,
    text: message,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${message}</div>`, // HTML version helps
    headers: {
      'X-Priority': '1', // High priority (1 = highest)
      'X-Mailer': 'NodeMailer (AirGuard)',
      'List-Unsubscribe': '<mailto:airguard.alert+unsubscribe@gmail.com>', // Helps with spam filters
    }
  };

  // Send email using Nodemailer
  try {
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: `Email sentttt: ${info.response}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

module.exports = { sendEmail };
