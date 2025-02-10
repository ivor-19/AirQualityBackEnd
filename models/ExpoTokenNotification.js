const mongoose = require('mongoose');

const expoTokenNotificationSchema = new mongoose.Schema({
    token_notif: String,
  });
  
const ExpoTokenNotification = mongoose.model('Asset', expoTokenNotificationSchema);
module.exports = ExpoTokenNotification;