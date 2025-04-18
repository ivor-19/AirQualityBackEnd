const Issue = require('../models/Issue');
const moment = require('moment-timezone');

const getIssueList = async (req, res) => {
  try {
      const issueList = await Issue.find();  // Fetch all AQChart readings

      res.json({
          isSuccess: true,
          message: "Fetched issues successfully",
          issueList
      });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error });
  }
};

const postIssue = async (req, res) => {
    const {sender_id, sender_accountId, sender_name, email, title, comment, description} = req.body;
    // const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const philippineTime = moment().tz('Asia/Manila');
    const time = philippineTime.format('hh:mm A');
    const date = philippineTime.format('YYYY-MM-DD');

    const datetime = date + ' ' + time;
    const newData = new Issue({sender_id, sender_accountId, sender_name, email, title, comment: '', description, created_at: datetime, updated_at: ''});
    try {
        await newData.save();
        res.status(201).json({isSuccess: true, message: 'New data is saved'})
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error saving data: ', error})
    }
}

const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const philippineTime = moment().tz('Asia/Manila');
    const time = philippineTime.format('hh:mm A');
    const date = philippineTime.format('YYYY-MM-DD');

    const datetime = date + ' ' + time;
    
    const updatedIssue = await Issue.findByIdAndUpdate(id,
      { 
        status,
        updated_at: datetime
      },
      { new: true } // Return the updated document
    );

    if (!updatedIssue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, issue: updatedIssue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateIssueComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body
    
    const updatedIssue = await Issue.findByIdAndUpdate(id,
      { 
        comment
      },
      { new: true } // Return the updated document
    );

    if (!updatedIssue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    res.json({ success: true, issue: updatedIssue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteIssue = async (req, res) => {
  const { id } = req.params;  
  try {
      const issue = await Issue.findByIdAndDelete(id); 
      if (!issue) {
          return res.status(400).json({ isSuccess: false, message: "Issue not found" });
      }
      res.status(200).json({ isSuccess: true, message: 'Issue deleted successfully', issue });
  } catch (error) {
      res.status(500).json({ isSuccess: false, message: 'Error deleting issue', error });
  }
}

module.exports = {getIssueList, postIssue, updateIssueStatus, updateIssueComment, deleteIssue}