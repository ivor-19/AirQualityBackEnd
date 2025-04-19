const Blob = require('../models/Blob');

// GET all blobs (convert Buffer to Base64 for frontend)
const getBlob = async (req, res) => {
  try {
    const blobs = await Blob.find();
    const blobsWithBase64 = blobs.map(blob => ({
      ...blob._doc,
      image: `data:${blob.contentType};base64,${blob.image.toString('base64')}`
    }));
    res.status(200).json({ success: true, data: blobsWithBase64 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST a new blob (accept Base64 from frontend)
const postBlob = async (req, res) => {
  const { name, image, contentType } = req.body;

  if (!name || !image || !contentType) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    // Extract Base64 data (remove "data:image/...;base64," prefix)
    const base64Data = image.replace(/^data:\w+\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const newBlob = await Blob.create({ name, image: buffer, contentType });
    res.status(201).json({ success: true, data: newBlob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {getBlob, postBlob};