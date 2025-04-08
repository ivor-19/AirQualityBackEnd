  const nodemailer = require('nodemailer');

  // Create a transporter object using Gmail service (You can replace it with other services like Mailtrap or SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER_AG,
      pass: process.env.EMAIL_PASSWORD_AG,
    }
  });

  module.exports = transporter;