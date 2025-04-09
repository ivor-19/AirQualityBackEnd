const mongoose = require('mongoose');

const protoSchema =  new mongoose.Schema({
  temperature: {type: Number},
  humidity: {type: Number},
  asset_model: {type: String}
})
const ProtoEsp = mongoose.model('ProtoEsp', protoSchema);
module.exports = ProtoEsp;