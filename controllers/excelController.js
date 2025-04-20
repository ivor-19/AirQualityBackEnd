const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const transporter = require('../config/nodeMailerConfig');

const saveFile = (file) => {
  const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '../tmp');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const fileName = Date.now() + path.extname(file.name);
  const filePath = path.join(uploadDir, fileName);
  return new Promise((resolve, reject) => {
    file.mv(filePath, (err) => {
      if (err) { console.error('Error moving file:', err); reject('Error uploading file: ' + err); }
      else { console.log('File saved successfully to:', filePath); resolve(filePath); }
    });
  });
};

const sendWelcomeEmail = async (email, account_id) => {
  const mailOptions = {
    from: process.env.EMAIL_USER_AG,
    to: email.trim(),
    subject: 'Welcome to AirGuard – Your Account Details',
    html: `
      <p>Dear User,</p>
      <p>Your account has been successfully created. Here are your login credentials:</p>
      <p><strong>Account ID:</strong> ${account_id}</p>
      <p><strong>Temporary Password:</strong> @Student01</p>
      <p>
        Please log in using these credentials and update your password to something secure and personal.
        If you have any questions or need assistance, feel free to reach out to our support team.
        We're glad to have you on board!
      </p>
      <p>Download link: https://expo.dev/artifacts/eas/ejntmBViKhoXK2z4HfMkik.apk</p>
      <p>Best regards,</p>
      <p>The AirGuard Team</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.response}`);
    return info;
  } catch (error) {
    console.error(`Error sending email to ${email}: ${error.message}`);
    throw error;
  }
};

const uploadExcel = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) return res.status(400).json({ isSuccess: false, message: 'No file uploaded' });
    const excelFilePath = await saveFile(req.files.excelFile);
    if (!fs.existsSync(excelFilePath)) return res.status(500).json({ isSuccess: false, message: 'File not found at expected path' });
    
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    console.log('Parsed data:', JSON.stringify(data, null, 2));

    const savedUsers = [], duplicateUsers = [], invalidUsers = [], skippedUsers = [];
    const emailResults = { sent: [], failed: [] };
    
    for (let row of data) {
      const account_id = row.account_id || row['account_id'];
      const username = row.username || row['username'];
      const email = (row.email || row['email'] || '').trim();
      
      // Skip if no email provided
      if (!email) {
        skippedUsers.push({...row, reason: 'No email provided'});
        continue;
      }
      
      if (!account_id || !username) { 
        invalidUsers.push({...row, reason: 'Missing account_id or username'}); 
        continue; 
      }

      try {
        // Check if account_id OR email already exists
        const existingUser = await User.findOne({ 
          $or: [
            { account_id },
            { email }
          ]
        });

        if (existingUser) {
          const duplicateReason = existingUser.account_id === account_id 
            ? 'account_id already exists' 
            : 'email already exists';
          
          duplicateUsers.push({...row, reason: duplicateReason});
          continue;
        }
        
        const newUser = new User({
          account_id, 
          username,
          email,
          password: "@Password01", 
          role: "Student", 
          status: "Available",
          asset_model: " ", 
          first_access: "Yes", 
          device_notif: " ",
          avatarPath: "lemur",
        });
        
        await newUser.save();
        savedUsers.push(newUser);

        try {
          await sendWelcomeEmail(email, account_id);
          emailResults.sent.push({ account_id, email });
        } catch (error) {
          emailResults.failed.push({ account_id, email, error: error.message });
        }
      } catch (error) { 
        invalidUsers.push({...row, error: error.message}); 
      }
    }

    fs.unlinkSync(excelFilePath);
    res.status(200).json({
      isSuccess: true,
      message: `${savedUsers.length} users added successfully`,
      savedUsers, 
      duplicates: duplicateUsers.length,
      duplicateDetails: duplicateUsers,
      invalidEntries: invalidUsers.length, 
      invalidDetails: invalidUsers,
      skippedEntries: skippedUsers.length,
      skippedDetails: skippedUsers,
      totalProcessed: data.length,
      emailResults: {
        sent: emailResults.sent.length,
        failed: emailResults.failed.length,
        failedDetails: emailResults.failed
      }
    });

  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ isSuccess: false, message: 'Error processing Excel file', error: error.message });
  }
};

module.exports = { uploadExcel };