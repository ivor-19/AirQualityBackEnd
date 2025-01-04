const express = require('express');
const {getList, addReadings, updateReadings} = require('../controllers/protoespController');
const router = express.Router();

router.get('/getEsp', getList);
router.post('/addEsp', addReadings);
router.post('/updateEsp/:asset_model', updateReadings);

module.exports = router;  // Corrected export
