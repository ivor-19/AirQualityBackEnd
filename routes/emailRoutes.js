// routes/emailRoutes.js
const express = require('express');
const { sendEmail } = require('../controllers/emailController');

const router = express.Router();

// Route to send email
router.post('/send', sendEmail);

module.exports = router;