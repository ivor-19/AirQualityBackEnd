const express = require('express');
const { signup, login, getUsers, editUser, deleteUser, getSpecificUser } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getUsers)
router.post('/editUser/:id', editUser)
router.post('/deleteUser/:id', deleteUser) // Delete
router.post('/user/:id', getSpecificUser) // Delete

module.exports = router;