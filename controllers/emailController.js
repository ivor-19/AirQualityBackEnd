const transporter = require('../config/nodeMailerConfig');

const sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  // Validate the inputs
  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide "to", "subject", and "message".',
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER_AG, 
    to,
    subject,
    text: message, 
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: `Email sent: ${info.response}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};


module.exports = { sendEmail };
