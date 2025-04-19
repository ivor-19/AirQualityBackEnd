const { put } = require('@vercel/blob');
const Blob = require('../models/Blob');

// GET all blobs
const getBlobs = async (req, res) => {
  try {
    const blobs = await Blob.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blobs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// POST a new blob
const createBlob = async (req, res) => {
  try {
    const { name, fileData, fileName, contentType, size } = req.body;

    if (!name || !fileData || !contentType) {
      return res.status(400).json({ 
        success: false, 
        error: "Name, file data, and content type are required" 
      });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(fileData, 'base64');

    // Upload to Vercel Blob
    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: contentType
    });

    // Store metadata in MongoDB
    const newBlob = await Blob.create({
      name,
      blobUrl: blob.url,
      contentType,
      size: size || buffer.length
    });

    res.status(201).json({ 
      success: true, 
      data: {
        _id: newBlob._id,
        name: newBlob.name,
        url: newBlob.blobUrl,
        size: newBlob.size,
        contentType: newBlob.contentType,
        createdAt: newBlob.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading blob:', error);
    res.status(500).json({ success: false, error: 'Failed to upload file' });
  }
};

module.exports = {
  getBlobs,
  createBlob
};