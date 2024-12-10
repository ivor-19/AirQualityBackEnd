const express = require('express');
const { getHistoryData, postHistoryData, deleteHistory } = require('../controllers/historyController');
const router = express.Router();

router.get('/', getHistoryData);
router.post('/', postHistoryData);
router.post('/deleteHistory/:id', deleteHistory);

module.exports = router;