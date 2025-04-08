const nodemailer = require('nodemailer');

// Create a transporter object using Gmail service (You can replace it with other services like Mailtrap or SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this if you are using a different service
  auth: {
    user: "airguard.alert@gmail.com", // Use environment variables for sensitive data
    pass: "dolhjgfnntkrijyg",
  },
});

module.exports = transporter;