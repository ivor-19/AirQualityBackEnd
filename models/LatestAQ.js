const mongoose = require('mongoose');

const latestaqSchema = new mongoose.Schema({
    aqi: Number,
    pm2_5: Number,
    co: Number,
    no2: Number,
  });
  
const LatestAQ = mongoose.model('LatestAQ', latestaqSchema);
module.exports = LatestAQ;