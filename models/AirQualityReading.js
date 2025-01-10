const mongoose = require('mongoose');

const airQualityReadingSchema = new mongoose.Schema({
    aqi: Number,
    pm2_5: Number,
    co: Number,
    no2: Number,
    asset_model: String,
    status: {
      type: String,
      enum: ['on', 'off'],  // Only 'on' or 'off' are allowed
      default: 'off',       // Set the default value as 'off'
  }
  });
  
const AirQualityReading = mongoose.model('AirQualityReading', airQualityReadingSchema);
module.exports = AirQualityReading;