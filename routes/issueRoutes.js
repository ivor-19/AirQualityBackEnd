// routes/emailRoutes.js
const express = require('express');
const { getIssueList, postIssue, updateIssueStatus } = require('../controllers/issueController');

const router = express.Router();

router.get('/', getIssueList);
router.post('/', postIssue);
router.post('/:id/status', updateIssueStatus);

module.exports = router;