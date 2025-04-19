const mongoose = require('mongoose');

const blobSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: Buffer, required: true }, // Store binary data
  contentType: { type: String, required: true }, // e.g., 'image/png'
}, { timestamps: true });

module.exports = mongoose.model('Blob', blobSchema);