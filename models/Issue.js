const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  sender_id: String,
  sender_accountId: String,
  sender_name: String,
  email: String,
  title: String,
  description: String,
  comment: String,
  status: {
    type: String,
    default: 'Pending'
  },
  created_at: String,
  updated_at: String,
});

const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;
