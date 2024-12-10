const express = require('express');
const { postAQReadings, getAQReadingsByAssetModel, getAQReadingsList } = require('../controllers/aqReadingController');
const router = express.Router();

router.get('/', getAQReadingsList);
router.get('/:asset_model', getAQReadingsByAssetModel)
router.post('/', postAQReadings)

module.exports = router;