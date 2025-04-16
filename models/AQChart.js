const mongoose = require('mongoose');
const moment = require('moment-timezone');

const aqChartSchema = new mongoose.Schema({
  aqi: Number,
  pm2_5: Number,
  pm10: Number,
  co: Number,
  no2: Number,
  asset_model: String,
  date: Date
});

// Define the model
const AQChart = mongoose.model('AQChart', aqChartSchema);

module.exports = AQChart;
