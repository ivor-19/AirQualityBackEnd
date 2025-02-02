const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    role: { type: String, required: true },
    date: { type: Date, default: Date.now },
  });
  
const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;