const express = require('express');
const { getBlob, postBlob } = require('../controllers/blobController');
const router = express.Router();


router.get('/', getBlob)
router.post('/', postBlob)


module.exports = router