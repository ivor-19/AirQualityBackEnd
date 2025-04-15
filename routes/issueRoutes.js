// routes/emailRoutes.js
const express = require('express');
const { getIssueList, postIssue, updateIssueStatus, updateIssueComment } = require('../controllers/issueController');

const router = express.Router();

router.get('/', getIssueList);
router.post('/', postIssue);
router.post('/:id/status', updateIssueStatus);
router.post('/:id/comment', updateIssueComment);

module.exports = router;