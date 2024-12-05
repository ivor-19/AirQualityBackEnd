const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/', authController.signup);
router.post('/', authController.login)

module.exports = router;