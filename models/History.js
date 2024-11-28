const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    date: String,
    timestamp: String,
    pm2_5: Number,
    co2: Number,
    no2: Number,
  });
  
const History = mongoose.model('History', historySchema);
module.exports = History;