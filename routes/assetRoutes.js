const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.get('/', assetController.getAssetNames)
router.post('/', assetController.postAssetNames)

module.exports = router