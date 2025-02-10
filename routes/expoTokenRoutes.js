const express = require('express');
const { getToken, postToken } = require('../controllers/expoTokenController');
const router = express.Router();

router.get('/', getToken);
router.post('/', postToken);

module.exports = router;