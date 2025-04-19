// models/Blob.js
const mongoose = require('mongoose');

const blobSchema = new mongoose.Schema({
  name: String,
  image: {
    data: Buffer
  },
});

module.exports = mongoose.model('Blob', blobSchema);