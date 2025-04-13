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
    const {sender_id, sender_accountId, sender_name, title, content, status, reply} = req.body;
    // const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    const philippineTime = moment().tz('Asia/Manila');
    const time = philippineTime.format('hh:mm A');
    const date = philippineTime.format('YYYY-MM-DD');

    const datetime = date + ' ' + time;
    const newData = new Issue({sender_id, sender_accountId, sender_name, title, content, status, reply, created_at: datetime, updated_at: datetime});
    try {
        await newData.save();
        res.status(201).json({isSuccess: true, message: 'New data is saved'})
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error saving data: ', error})
    }
}

module.exports = {getIssueList, postIssue }