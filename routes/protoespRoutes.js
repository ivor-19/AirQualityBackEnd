const express = require('express');
const {getList, add} = require('../controllers/protoespController');
const router = express.Router();

router.get('/getEsp', getList);
router.post('/addEsp', add);

module.exports = router;  // Corrected export
