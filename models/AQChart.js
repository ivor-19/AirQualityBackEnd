const mongoose = require('mongoose');
const { DateTime } = require('luxon'); 

const aqChartSchema = new mongoose.Schema({
  aqi: Number,
  pm2_5: Number,
  co: Number,
  no2: Number,
  asset_model: String,
  date: String
});

// Define the model
const AQChart = mongoose.model('AQChart', aqChartSchema);

module.exports = AQChart;
