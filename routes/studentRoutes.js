const express = require('express');
const { getStudentList, addStudentData, deleteStudent } = require('../controllers/studentController');
const router = express.Router();

router.get('/getList', getStudentList);
router.post('/addStudent', addStudentData);
router.post('/deleteStudent/:id', deleteStudent); // Added `:id` for delete route

module.exports = router;  // Corrected export
