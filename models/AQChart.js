const mongoose = require('mongoose');
const { DateTime } = require('luxon'); 

const aqChartSchema = new mongoose.Schema({
  aqi: Number,
  pm2_5: Number,
  co: Number,
  no2: Number,
  asset_model: String,
  last_updated: { 
    type: Date, 
    default: () => DateTime.now().setZone('Asia/Manila').toJSDate() // Use Luxon to get current date in Manila timezone
  }
});

// Define the model
const AQChart = mongoose.model('AQChart', aqChartSchema);

module.exports = AQChart;
