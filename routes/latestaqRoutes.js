const express = require('express');
const router = express.Router();
const latestaqController = require('../controllers/latestaqController');

router.get('/', latestaqController.getLatestAQ);
router.post('/', latestaqController.postLatestAQ)

module.exports = router;