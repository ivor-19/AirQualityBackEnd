const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.get('/', historyController.getHistoryData);
router.post('/', historyController.postHistoryData);

module.exports = router;