const mongoose = require('mongoose');

const blobSchema = new mongoose.Schema({
  name: string,
  image: data,
});

// Define the model
const Blob = mongoose.model('Blob', blobSchema);

module.exports = Blob;
