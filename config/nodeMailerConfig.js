const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // user: process.env.EMAIL_USER, // Use environment variables for sensitive data
    // pass: process.env.EMAIL_PASSWORD,
    user: process.env.EMAIL_USER_AG, // Use environment variables for sensitive data
    pass: process.env.EMAIL_PASSWORD_AG,
    // user: "airguard.alert@gmail.com", // Use environment variables for sensitive data
    // pass: "dolhjgfnntkrijyg",
  },
});

module.exports = transporter;