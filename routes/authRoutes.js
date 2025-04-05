const express = require('express');
const { signup, login, getUsers, editUser, deleteUser, getSpecificUser, getEmails } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getUsers)
router.get('/emails', getEmails) 
router.post('/editUser/:id', editUser)
router.post('/deleteUser/:id', deleteUser) // Delete
router.get('/:id', getSpecificUser) 

module.exports = router;