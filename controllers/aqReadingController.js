const AirQualityReading = require('../models/AirQualityReading');

const getAQReadingsList = async (req, res) => {
    try {
        const getList = await AirQualityReading.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching data', error})
    }
}

const getModelReading= async (req, res) => {
    const {asset_model} = req.query;
    try {
        const asset = await AirQualityReading.findOne({asset_model});
        if(!asset){
            return res.status(400).json({message: "Can't find model"});
        }

        res.status(201).json({message: 'Model found', asset})
    } catch (error) {
        res.status(500).json({message: 'Error fetching model', error})
    }
}

const postAQReadings = async (req, res) => {
    const {aqi, pm2_5, co, no2, asset_model} = req.body;
    const newData = new AirQualityReading({aqi, pm2_5, co, no2, asset_model});
    try {
        await newData.save();
        const getList = await AirQualityReading.find();
        res.status(201).json({message: 'New data is saved', getList})
    } catch (error) {
        res.status(500).json({message: 'Error saving data: ', error})
    }
}

module.exports = {getAQReadingsList, getModelReading, postAQReadings}