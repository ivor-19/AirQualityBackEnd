const express = require('express');
const { getStudentList, deleteStudent, addStudent, getEmails } = require('../controllers/studentController');
const router = express.Router();

router.get('/getList', getStudentList);
router.post('/addStudent', addStudent);
router.post('/deleteStudent/:id', deleteStudent); // Added `:id` for delete route
router.get('/getEmails', getEmails);

module.exports = router;  // Corrected export
