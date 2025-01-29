const express = require('express');
const { getChat, postChat } = require('../controllers/chatController');
const router = express.Router();

router.get('/', getChat);
router.post('/', postChat);

module.exports = router;