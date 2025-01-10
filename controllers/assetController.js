const Asset = require('../models/Asset');
const AirQualityReading = require('../models/AirQualityReading');

const getAssetList= async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 

        const skip = (page - 1) * limit;
        const asset = await Asset.find()
                                 .skip(skip)   
                                 .limit(limit)  
                                 .exec();      

        const totalAsset = await Asset.countDocuments();
        const lastPage = Math.ceil(totalAsset / limit);

        res.json({
            isSuccess: true,
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
            return res.status(400).json({isSuccess: false, message: "Can't find asset name"});
        }

        res.status(201).json({isSuccess: true, message: 'Asset name found', asset})
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error fetching assets', error})
    }
}

const postAssetNames = async (req, res) => {
    const {assetName} = req.body;
    const newAssetName = new Asset({assetName});
    try {
        await newAssetName.save();
        // const getList = await Asset.find();

        const newData = new AirQualityReading({aqi: 0, pm2_5: 0, co: 0, no2: 0, asset_model: assetName, last_updated: Date.now()});
        await newData.save();
        // const getList = await AirQualityReading.find();
        
        res.status(201).json({isSuccess: true, message: 'New asset added', newAssetName});
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error adding asset', error})
    }
}

const deleteAsset = async (req, res) => {
    const { id } = req.params;  
    try {
        const asset = await Asset.findByIdAndDelete(id); 
        if (!asset) {
            return res.status(400).json({ isSuccess: false, message: "Asset not found" });
        }
        res.status(200).json({ isSuccess: true, message: 'Asset deleted successfully', asset });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error deleting asset', error });
    }
}

module.exports = {getAssetList, getAssetName, postAssetNames, deleteAsset}