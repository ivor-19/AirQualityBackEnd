// routes/emailRoutes.js
const express = require('express');
const { getIssueList, postIssue } = require('../controllers/issueController');

const router = express.Router();

router.get('/', getIssueList);
router.post('/', postIssue);

module.exports = router;