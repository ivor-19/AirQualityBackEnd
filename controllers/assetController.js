const Asset = require('../models/Asset');

const getAssetNames = async (req, res) => {
    try {
        const getList = await Asset.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching assets', error})
    }
}

const postAssetNames = async (req, res) => {
    const {assetName} = req.body;
    const newAssetName = new Asset({assetName});
    try {
        await newAssetName.save();
        const getList = await Asset.find();
        res.status().json({messag: 'New asset added', getList});
    } catch (error) {
        res.status(500).json({message: 'Error fetching assets', error})
    }
}

module.exports = {getAssetNames, postAssetNames}