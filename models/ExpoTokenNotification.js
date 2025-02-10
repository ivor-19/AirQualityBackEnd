const mongoose = require('mongoose');

const expoTokenNotificationSchema = new mongoose.Schema({
    token_notif: String,
  });
  
const ExpoTokenNotification = mongoose.model('ExpoTokenNotification', expoTokenNotificationSchema);
module.exports = ExpoTokenNotification;