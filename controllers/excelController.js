const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

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

    const savedUsers = [], duplicateUsers = [], invalidUsers = [], blankEmailUsers = [];
    for (let row of data) {
      const account_id = row.account_id || row['account_id'];
      const username = row.username || row['username'];
      const email = row.email || row['email'] || '';
      
      if (!account_id || !username) { invalidUsers.push(row); continue; }
      if (!email) { blankEmailUsers.push(row); continue; } // Skip blank emails

      try {
        const existingUser = await User.findOne({ account_id });
        if (existingUser) { duplicateUsers.push(row); continue; }
        const newUser = new User({
          account_id, username, email,
          password: "@Student01", role: "Student", status: "Ready",
          asset_model: " ", first_access: "Yes", device_notif: " "
        });
        await newUser.save();
        savedUsers.push(newUser);
      } catch (error) { invalidUsers.push({...row, error: error.message}); }
    }

    fs.unlinkSync(excelFilePath);
    res.status(200).json({
      isSuccess: true,
      message: `${savedUsers.length} users added successfully`,
      savedUsers, duplicates: duplicateUsers.length,
      invalidEntries: invalidUsers.length, blankEmails: blankEmailUsers.length,
      totalProcessed: data.length
    });

  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ isSuccess: false, message: 'Error processing Excel file', error: error.message });
  }
};

module.exports = { uploadExcel };