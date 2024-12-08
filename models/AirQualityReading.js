const mongoose = require('mongoose');

const airQualityReadingSchema = new mongoose.Schema({
    aqi: Number,
    pm2_5: Number,
    co: Number,
    no2: Number,
    asset_model: String,
  });
  
const AirQualityReading = mongoose.model('AirQualityReading', airQualityReadingSchema);
module.exports = AirQualityReading;