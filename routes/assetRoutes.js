const express = require('express');
const { getAssetList, getAssetName, postAssetNames, deleteAsset } = require('../controllers/assetController');
const router = express.Router();


router.get('/', getAssetList)
router.post('/getAsset', getAssetName)
router.post('/addAsset', postAssetNames)
router.delete('/deleteAsset', deleteAsset)

module.exports = router