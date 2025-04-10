const express = require('express');
const { getToken, postToken, sendNotification } = require('../controllers/expoTokenController');
const router = express.Router();

router.get('/', getToken);
router.post('/', postToken);
router.post('/sendNotification', sendNotification)

module.exports = router;