const express = require('express');
const { postAQChart, getAQChartByAssetModel, getAQChartList } = require('../controllers/aqChartController');
const authenticateJWT = require('../middlewares/authenticateJWT');
const router = express.Router();

router.get('/', getAQChartList);
router.get('/:asset_model', getAQChartByAssetModel)
router.post('/addAQChart', postAQChart)

module.exports = router;