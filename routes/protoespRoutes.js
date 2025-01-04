const express = require('express');
const {getList, updateReadings} = require('../controllers/protoespController');
const router = express.Router();

router.get('/getEsp', getList);
router.post('/updateEsp', updateReadings);

module.exports = router;  // Corrected export
