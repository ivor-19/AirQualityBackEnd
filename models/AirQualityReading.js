const mongoose = require('mongoose');
const { DateTime } = require('luxon'); 

const airQualityReadingSchema = new mongoose.Schema({
  aqi: Number,
  pm2_5: Number,
  pm10: Number,
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
    default: () => DateTime.now().setZone('Asia/Manila').toJSDate() // Use Luxon to get current date in Manila timezone
  }
});

// Define the model
const AirQualityReading = mongoose.model('AirQualityReading', airQualityReadingSchema);

module.exports = AirQualityReading;
