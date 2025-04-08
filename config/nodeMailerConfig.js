const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables for sensitive data
    pass: process.env.EMAIL_PASSWORD,
    // user: "airguard.alert@gmail.com", // Use environment variables for sensitive data
    // pass: "dolhjgfnntkrijyg",
  },
});

module.exports = transporter;