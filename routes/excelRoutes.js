const express = require('express');
const { uploadExcel } = require('../controllers/excelController');
const router = express.Router();

router.post('/uploadExcel', uploadExcel);

module.exports = router;  // Corrected export
