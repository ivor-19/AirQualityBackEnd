const nodemailer = require('nodemailer');

// Create a transporter object using Gmail service (You can replace it with other services like Mailtrap or SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this if you are using a different service
  auth: {
    // user: process.env.EMAIL_USER, // Use environment variables for sensitive data
    // pass: process.env.EMAIL_PASSWORD,
    user: process.env.EMAIL_USER_AG, // Use environment variables for sensitive data
    pass: process.env.EMAIL_PASSWORD_AG,
  },
});

module.exports = transporter;