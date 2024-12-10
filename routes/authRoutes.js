const express = require('express');
const { signup, login, getUsers, editUser, deleteUser } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getUsers)
router.put('/editUser/:id', editUser)
router.delete('/deleteUser/:id', deleteUser)

module.exports = router;