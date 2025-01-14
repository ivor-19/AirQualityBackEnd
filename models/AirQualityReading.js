const mongoose = require('mongoose');
const moment = require('moment-timezone');

const airQualityReadingSchema = new mongoose.Schema({
  aqi: Number,
  pm2_5: Number,
  co: Number,
  no2: Number,
  asset_model: String,
  status: {
    type: String,
    enum: ['on', 'off'],
    default: 'off',
  },
  last_updated: { 
    type: Date, 
    default: () => moment().tz('Asia/Manila').toDate()  // Use moment to get a Date object
  }
});

  
const AirQualityReading = mongoose.model('AirQualityReading', airQualityReadingSchema);
module.exports = AirQualityReading;