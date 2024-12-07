const Asset = require('../models/Asset');

const getAssetNames = async () => {
    try {
        const getList = await Asset.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching assets', error})
    }
}

module.exports = {getAssetNames}