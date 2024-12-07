const Asset = require('../models/Asset');

const getAssetList= async (req, res) => {
    try {
        const getList = await Asset.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching assets', error})
    }
}

const getAssetName= async (req, res) => {
    const {assetName} = req.body;
    try {
        const asset = await Asset.findOne({assetName});
        if(!asset){
            return res.status(400).json({message: "Can't find asset name"});
        }

        res.status(201).json({message: 'Asset name found', asset})
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
        res.status(201).json({message: 'New asset added', getList});
    } catch (error) {
        res.status(500).json({message: 'Error adding asset', error})
    }
}

module.exports = {getAssetList, getAssetName, postAssetNames}