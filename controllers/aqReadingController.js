const AirQualityReading = require('../models');
const moment = require('moment-timezone');

const getAQReadingsList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 

        const skip = (page - 1) * limit;
        const aqReadings = await AirQualityReading.find()
                                 .skip(skip)   
                                 .limit(limit)  
                                 .exec();      

        const totalAQReadings = await AirQualityReading.countDocuments();
        const lastPage = Math.ceil(totalAQReadings / limit);

        res.json({
            isSuccess: true,
            aqReadings,
            pagination: {
                total: totalAQReadings,            // Total number of users
                per_page: limit,              // Number of users per page
                current_page: page,           // Current page number
                last_page: lastPage           // Last page number
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Error fetching data', error})
    }
}

const getAQReadingsByAssetModel = async (req, res) => {
    try {
        const { asset_model } = req.params;
        const aqReadings = await AirQualityReading.find({ asset_model });

        if (aqReadings.length === 0) {
            return res.status(404).json({ isSuccess: false, message: `No data found for asset_model: ${asset_model}` });
        }
        res.json({
            isSuccess: true,
            message: "Fetched AQ readings successfully",
            aqReadings
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data for the asset_model', error });
    }
};

const postAQReadings = async (req, res) => {
    const {aqi, pm2_5, co, no2, asset_model} = req.body;
    const newData = new AirQualityReading({aqi, pm2_5, co, no2, asset_model});
    try {
        await newData.save();
        const getList = await AirQualityReading.find();
        res.status(201).json({isSuccess: true, message: 'New data is saved', getList})
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error saving data: ', error})
    }
}

const updateAQReadings = async (req, res) => {
    const {aqi, pm2_5, co, no2, status} = req.body;
  
    try{
      const { asset_model } = req.params;
        
      
      const newReadings = await AirQualityReading.findOneAndUpdate({asset_model}, {aqi, pm2_5, co, no2, status, last_updated: Date.now()}, {new: true});
      if(!newReadings){
        return res.status(404).json({message: 'No data found to update'})
      }
      res.status(200).json({message: 'Updated Successfully', newReadings});
    }
    catch(error){
      res.status(500).json({message: 'Error updating', error});
    }
  
  }

module.exports = {getAQReadingsList, getAQReadingsByAssetModel, postAQReadings, updateAQReadings}