const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    sender_id: String,
    sender_accountId: String,
    sender_name: String,
    title: String,
    content: String,
    status: String,
    reply: String,
    created_at: String,
    updated_at: String,
  });
  
const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;