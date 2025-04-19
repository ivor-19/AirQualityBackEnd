const mongoose = require('mongoose');

const blobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  blobUrl: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  // You can add any other metadata you want to store
})

module.exports = mongoose.model('Blob', blobSchema);