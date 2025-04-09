const mongoose = require('mongoose');
const { DateTime } = require('luxon');

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
    default: () => DateTime.now().setZone('Asia/Manila').toJSDate() // Use Luxon to get current date in Manila timezone
  }
});

const aqChartSchema = new mongoose.Schema({
  aqi: Number,
  pm2_5: Number,
  co: Number,
  no2: Number,
  asset_model: String,
  date: String
});

const assetSchema = new mongoose.Schema({
  assetName: String,
});

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sender: { type: String, required: true },
  role: { type: String, required: true },
  timestamp: { type: String },
  date: { type: String },
});

const expoTokenNotificationSchema = new mongoose.Schema({
  token_notif: String,
});

const historySchema = new mongoose.Schema({
  date: String,
  timestamp: String,
  aqi: Number,
  pm2_5: Number,
  co: Number,
  no2: Number,
  scanned_by: String,
  scanned_using_model: String,
  message: String,
});

const latestaqSchema = new mongoose.Schema({
  aqi: Number,
  pm2_5: Number,
  co: Number,
  no2: Number,
});

const studentSchema = new mongoose.Schema({
  student_id: {type: String, unique: true, required: true},
  name: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  phone_number: {type: String},
});

// Ensure that the models are only defined once
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
const LatestAQ = mongoose.models.LatestAQ || mongoose.model('LatestAQ', latestaqSchema);
const History = mongoose.models.History || mongoose.model('History', historySchema);
const ExpoTokenNotification = mongoose.models.ExpoTokenNotification || mongoose.model('ExpoTokenNotification', expoTokenNotificationSchema);
const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
const AirQualityReading = mongoose.models.AirQualityReading || mongoose.model('AirQualityReading', airQualityReadingSchema);
const AQChart = mongoose.models.AQChart || mongoose.model('AQChart', aqChartSchema);
const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);

module.exports = {
  Student,
  LatestAQ,
  History,
  ExpoTokenNotification,
  Chat,
  AirQualityReading,
  AQChart,
  Asset
};
