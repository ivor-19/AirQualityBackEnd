// routes/emailRoutes.js
const express = require('express');
const { sendEmail, sendPassword } = require('../controllers/emailController');

const router = express.Router();

// Route to send email
router.post('/send', sendEmail);
router.post('/sendPassword', sendPassword);

module.exports = router;