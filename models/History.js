const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    date: String,
    timestamp: String,
    aqi: Number,
    pm2_5: Number,
    co: Number,
    no2: Number,
  });
  
const History = mongoose.model('History', historySchema);
module.exports = History;