const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.get('/', assetController.getAssetList)
router.post('/getAsset', assetController.getAssetName)
router.post('/addAsset', assetController.postAssetNames)

module.exports = router