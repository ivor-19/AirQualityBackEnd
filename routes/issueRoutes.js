// routes/emailRoutes.js
const express = require('express');
const { getIssueList, postIssue, updateIssueStatus, updateIssueComment, deleteIssue } = require('../controllers/issueController');

const router = express.Router();

router.get('/', getIssueList);
router.post('/', postIssue);
router.post('/:id/status', updateIssueStatus);
router.post('/:id/comment', updateIssueComment);
router.post('/:id/delete', deleteIssue);

module.exports = router;