const express = require('express');
const { signup, login, getUsers, editUser, deleteUser } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getUsers)
router.post('/editUser/:id', editUser)
router.post('/deleteUser/:id', deleteUser) // Delete

module.exports = router;