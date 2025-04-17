const express = require('express');
const { signup, login, getUsers, editUser, deleteUser, getSpecificUser, getEmails, getAllAndAdminDeviceNotifs, getSpecificUserEmail } = require('../controllers/authController');
const { getUsersArchive, restoreUser, deletePermanent } = require('../controllers/archiveController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getUsers)
router.get('/emails', getEmails) 
router.get('/notifications/getNotifs', getAllAndAdminDeviceNotifs)

router.get('/archive', getUsersArchive)
router.post('/restore/:id', restoreUser)
router.get('/deletePermanent/:id', deletePermanent)

router.post('/editUser/:id', editUser)
router.post('/deleteUser/:id', deleteUser) // Delete
router.get('/:id', getSpecificUser) 
router.get('/email/:email', getSpecificUserEmail) 

module.exports = router;