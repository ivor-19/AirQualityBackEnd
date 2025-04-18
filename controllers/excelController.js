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
  if (!email || email.trim() === '') {
    console.log(`No email provided for account ${account_id}, skipping email`);
    return null;
  }

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

    const savedUsers = [], duplicateUsers = [], invalidUsers = [];
    const emailResults = { sent: [], failed: [] };
    
    for (let row of data) {
      const account_id = row.account_id || row['account_id'];
      const username = row.username || row['username'];
      const email = (row.email || row['email'] || '').trim(); // Clean up email
      
      if (!account_id || !username) { 
        invalidUsers.push(row); 
        continue; 
      }

      try {
        // Check if account_id OR email already exists
        const existingUser = await User.findOne({ 
          $or: [
            { account_id },
            ...(email ? [{ email }] : []) // Only check email if it exists in the row
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
          email: email || ' ', // Store empty string as single space if empty
          password: "@Student01", 
          role: "Student", 
          status: "Available",
          asset_model: " ", 
          first_access: "Yes", 
          device_notif: " "
        });
        
        await newUser.save();
        savedUsers.push(newUser);

        // Send welcome email if email exists
        if (email) {
          try {
            await sendWelcomeEmail(email, account_id);
            emailResults.sent.push({ account_id, email });
          } catch (error) {
            emailResults.failed.push({ account_id, email, error: error.message });
          }
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
      duplicateDetails: duplicateUsers, // Now includes reason for duplication
      invalidEntries: invalidUsers.length, 
      invalidDetails: invalidUsers,
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



// const User = require('../models/User');
// const fs = require('fs');
// const path = require('path');
// const xlsx = require('xlsx');

// const saveFile = (file) => {
//   const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '../tmp');
//   if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
//   const fileName = Date.now() + path.extname(file.name);
//   const filePath = path.join(uploadDir, fileName);
//   return new Promise((resolve, reject) => {
//     file.mv(filePath, (err) => {
//       if (err) { console.error('Error moving file:', err); reject('Error uploading file: ' + err); }
//       else { console.log('File saved successfully to:', filePath); resolve(filePath); }
//     });
//   });
// };

// const uploadExcel = async (req, res) => {
//   try {
//     if (!req.files || !req.files.excelFile) return res.status(400).json({ isSuccess: false, message: 'No file uploaded' });
//     const excelFilePath = await saveFile(req.files.excelFile);
//     if (!fs.existsSync(excelFilePath)) return res.status(500).json({ isSuccess: false, message: 'File not found at expected path' });
    
//     const workbook = xlsx.readFile(excelFilePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(worksheet);
//     console.log('Parsed data:', JSON.stringify(data, null, 2));

//     const savedUsers = [], duplicateUsers = [], invalidUsers = [];
//     for (let row of data) {
//       const account_id = row.account_id || row['account_id'];
//       const username = row.username || row['username'];
//       const email = row.email || row['email'] || ''; // Allow empty email
      
//       if (!account_id || !username) { invalidUsers.push(row); continue; }

//       try {
//         const existingUser = await User.findOne({ account_id });
//         if (existingUser) { duplicateUsers.push(row); continue; }
//         const newUser = new User({
//           account_id, username,
//           email: email || ' ', // Store empty string as single space if empty
//           password: "@Student01", role: "Student", status: "Available",
//           asset_model: " ", first_access: "Yes", device_notif: " "
//         });
//         await newUser.save();
//         savedUsers.push(newUser);
//       } catch (error) { invalidUsers.push({...row, error: error.message}); }
//     }

//     fs.unlinkSync(excelFilePath);
//     res.status(200).json({
//       isSuccess: true,
//       message: `${savedUsers.length} users added successfully`,
//       savedUsers, duplicates: duplicateUsers.length,
//       invalidEntries: invalidUsers.length, totalProcessed: data.length
//     });

//   } catch (error) {
//     console.error('Error processing Excel file:', error);
//     res.status(500).json({ isSuccess: false, message: 'Error processing Excel file', error: error.message });
//   }
// };

// module.exports = { uploadExcel };