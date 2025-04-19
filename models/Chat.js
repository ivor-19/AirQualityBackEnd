const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    role: { type: String, required: true },
    timestamp: { type: String },
    avatarPath: { type: String },
    date: { type: String },
  });
  
const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;