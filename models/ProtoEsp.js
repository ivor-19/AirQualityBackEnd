const mongoose = require('mongoose');

const protoSchema =  new mongoose.Schema({
  name: {type: String}
})
const ProtoEsp = mongoose.model('ProtoEsp', protoSchema);
module.exports = ProtoEsp;