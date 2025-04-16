const express = require('express');
const { postAQChart, getAQChartByAssetModel, getAQChartList, getAQHourlyAverages } = require('../controllers/aqChartController');
const authenticateJWT = require('../middlewares/authenticateJWT');
const router = express.Router();

router.get('/average', getAQHourlyAverages);
router.post('/addAQChart', postAQChart)
router.get('/:asset_model', getAQChartByAssetModel)
router.post('/addAQChart', postAQChart)

module.exports = router;