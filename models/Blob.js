// models/Blob.js
const mongoose = require('mongoose');

const blobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    data: {
      type: Buffer,
      required: true,
      validate: {
        validator: function(value) {
          return value.length <= 10 * 1024 * 1024; // 10MB limit
        },
        message: 'Image size must be less than 10MB'
      }
    },
    contentType: {
      type: String,
      required: true
    }
  },
},
);

module.exports = mongoose.model('Blob', blobSchema);