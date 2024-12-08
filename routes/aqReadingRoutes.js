const express = require('express');
const router = express.Router();
const aqReadingController = require('../controllers/aqReadingController');

router.get('/', aqReadingController.getAQReadingsList);
router.post('/', aqReadingController.postAQReadings)
router.post('/getAQ', aqReadingController.getModelReading)

module.exports = router;