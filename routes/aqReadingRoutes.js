const express = require('express');
const router = express.Router();
const aqReadingController = require('../controllers/aqReadingController');

router.get('/', aqReadingController.getAQReadingsList);
router.get('/:asset_model', aqReadingController.getAQReadingsByAssetModel)
router.post('/', aqReadingController.postAQReadings)

module.exports = router;