const Asset = require('../models/Asset');

const getAssetList= async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 6; 

        const skip = (page - 1) * limit;
        const asset = await Asset.find()
                                 .skip(skip)   
                                 .limit(limit)  
                                 .exec();      

        const totalAsset = await Asset.countDocuments();
        const lastPage = Math.ceil(totalAsset / limit);

        res.json({
            asset,
            pagination: {
                total: totalAsset,            // Total number of users
                per_page: limit,              // Number of users per page
                current_page: page,           // Current page number
                last_page: lastPage           // Last page number
            }
        });
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