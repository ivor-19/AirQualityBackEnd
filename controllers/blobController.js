const Blob = require('../models/Blob');

// GET all blobs
const getBlob = async (req, res) => {
  try {
    const blobs = await Blob.find().sort({ createdAt: -1 }); // Newest first
    const blobsWithBase64 = blobs.map(blob => ({
      _id: blob._id,
      name: blob.name,
      image: `data:${blob.image.contentType};base64,${blob.image.data.toString('base64')}`,
      createdAt: blob.createdAt
    }));
    res.status(200).json({ success: true, data: blobsWithBase64 });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// POST a new blob
const postBlob = async (req, res) => {
  const { name, image, contentType } = req.body;

  if (!name || !image || !contentType) {
    return res.status(400).json({ success: false, error: "Name, image and content type are required" });
  }

  try {
    const base64Data = image.replace(/^data:\w+\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Check size before creating
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: "Image size exceeds 10MB limit" });
    }

    const newBlob = await Blob.create({ 
      name, 
      image: {
        data: buffer,
        contentType
      } 
    });

    res.status(201).json({ 
      success: true, 
      data: {
        _id: newBlob._id,
        name: newBlob.name,
        createdAt: newBlob.createdAt
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { getBlob, postBlob };