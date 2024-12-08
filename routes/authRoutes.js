const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/', authController.getUsers)
router.put('/', authController.editUser)

module.exports = router;