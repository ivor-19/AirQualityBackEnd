const express = require('express');
const { getAssetList, getAssetName, postAssetNames, deleteAsset } = require('../controllers/assetController');
const router = express.Router();


router.get('/', getAssetList)
router.post('/getAssetName', getAssetName)
router.post('/addAsset', postAssetNames)
router.delete('/deleteAsset/:id', deleteAsset)

module.exports = router