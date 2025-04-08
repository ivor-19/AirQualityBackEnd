const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASSWORD,
    user: process.env.EMAIL_USER_AG, 
    pass: process.env.EMAIL_PASSWORD_AG,
    // user: "airguard.alert@gmail.com", 
    // pass: "dolhjgfnntkrijyg",
  },
});

module.exports = transporter;