const express = require('express');
const { getStudentList, deleteStudent, addStudent, getEmails, editStudent, importExcel } = require('../controllers/studentController');
const router = express.Router();

router.get('/getList', getStudentList);
router.post('/addStudent', addStudent);
router.post('/deleteStudent/:id', deleteStudent); // Added `:id` for delete route
router.get('/getEmails', getEmails);
router.post('/editStudent', editStudent);
router.post('/importExcel', importExcel);

module.exports = router;  // Corrected export
