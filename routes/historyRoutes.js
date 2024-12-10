const express = require('express');
const { getHistoryData, postHistoryData } = require('../controllers/historyController');
const router = express.Router();

router.get('/', getHistoryData);
router.post('/', postHistoryData);

module.exports = router;