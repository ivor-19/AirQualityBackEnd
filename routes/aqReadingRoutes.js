const express = require('express');
const { postAQReadings, getAQReadingsByAssetModel, getAQReadingsList, updateAQReadings } = require('../controllers/aqReadingController');
const authenticateJWT = require('../middlewares/authenticateJWT');
const router = express.Router();

router.get('/', getAQReadingsList);
router.get('/:asset_model', getAQReadingsByAssetModel)
router.post('/addAQReadings', postAQReadings)
router.post('/updateAQReadings/:asset_model', updateAQReadings)

module.exports = router;