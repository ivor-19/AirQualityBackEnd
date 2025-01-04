const express = require('express');
const { add } = require('../controllers/protoespController');
const router = express.Router();

router.post('/addEsp', add);

module.exports = router;  // Corrected export
