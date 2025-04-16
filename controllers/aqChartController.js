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
    const {aqi, pm2_5, pm10, co, no2, asset_model} = req.body;
    const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    // const philippineTime = moment().tz('Asia/Manila');
    // const time = philippineTime.format('hh:mm A');
    // const date = philippineTime.format('YYYY-MM-DD');
    const newData = new AQChart({aqi, pm2_5, pm10, co, no2, asset_model, date: moment().tz('Asia/Manila').toDate()});
    try {
        await newData.save();
        const getList = await AQChart.find();
        res.status(201).json({isSuccess: true, message: 'New data is saved', getList})
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error saving data: ', error})
    }
}

const getAQHourlyAverages = async (req, res) => {
  try {
    // Get current time in Manila timezone as a Moment object
    const now = moment().tz('Asia/Manila');
    
    // Calculate exactly 1 hour ago from current time
    const oneHourAgo = now.clone().subtract(1, 'hour');
    
    // Get all readings from the past hour
    const readings = await AQChart.find({
      date: {
        $gte: oneHourAgo.toDate(), // Convert to JavaScript Date for MongoDB
        $lt: now.toDate() // Convert to JavaScript Date for MongoDB
      }
    });

    if (readings.length === 0) {
      return res.json({
        isSuccess: true,
        message: `No data available from ${oneHourAgo.format('h:mm A')} to ${now.format('h:mm A')}`,
        hourlyAverages: null
      });
    }

    // Calculate averages
    const sums = readings.reduce((acc, reading) => {
      acc.aqi += reading.aqi;
      acc.pm2_5 += reading.pm2_5;
      acc.pm10 += reading.pm10;
      acc.co += reading.co;
      acc.no2 += reading.no2;
      return acc;
    }, {
      aqi: 0,
      pm2_5: 0,
      pm10: 0,
      co: 0,
      no2: 0
    });

    const count = readings.length;
    const hourlyAverages = {
      aqi: parseFloat((sums.aqi / count).toFixed(2)),
      pm2_5: parseFloat((sums.pm2_5 / count).toFixed(2)),
      pm10: parseFloat((sums.pm10 / count).toFixed(2)),
      co: parseFloat((sums.co / count).toFixed(2)),
      no2: parseFloat((sums.no2 / count).toFixed(2)),
      count: count,
      timeRange: {
        start: oneHourAgo.format('YYYY-MM-DD HH:mm:ss'),
        end: now.format('YYYY-MM-DD HH:mm:ss')
      }
    };

    res.json({
      isSuccess: true,
      message: `Averages calculated from ${oneHourAgo.format('h:mm A')} to ${now.format('h:mm A')}`,
      hourlyAverages
    });
  } catch (error) {
    res.status(500).json({ 
      isSuccess: false,
      message: 'Error calculating hourly averages', 
      error: error.message 
    });
  }
};

module.exports = {getAQChartList, getAQChartByAssetModel, postAQChart, getAQHourlyAverages }