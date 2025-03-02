const AQChart = require('../models/AQChart');
const moment = require('moment-timezone');

const getAQChartList = async (req, res) => {
  try {
      const aqReadings = await AQChart.find();  // Fetch all AQChart readings

      res.json({
          isSuccess: true,
          message: "Fetched AQ chart successfully",
          aqReadings
      });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error });
  }
};

const getAQChartByAssetModel = async (req, res) => {
    try {
        const { asset_model } = req.params;
        const getList = await AQChart.find({ asset_model });

        if (getList.length === 0) {
            return res.status(404).json({ isSuccess: false, message: `No data found for asset_model: ${asset_model}` });
        }
        res.json(getList);
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data for the asset_model', error });
    }
};

const postAQChart = async (req, res) => {
    const {aqi, pm2_5, co, no2, asset_model} = req.body;
    // const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const philippineTime = moment().tz('Asia/Manila').format('hh:mm A');
    const newData = new AQChart({aqi, pm2_5, co, no2, asset_model, time: philippineTime, date: philippineTime.split('T')[0]});
    try {
        await newData.save();
        const getList = await AQChart.find();
        res.status(201).json({isSuccess: true, message: 'New data is saved', getList})
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error saving data: ', error})
    }
}

module.exports = {getAQChartList, getAQChartByAssetModel, postAQChart }