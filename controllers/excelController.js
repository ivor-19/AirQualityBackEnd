const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const saveFile = (file) => {
  const uploadDir = process.env.VERCEL
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '../tmp');
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); 
  }

  const fileName = Date.now() + path.extname(file.name);  
  const filePath = path.join(uploadDir, fileName); 

  return new Promise((resolve, reject) => {
    file.mv(filePath, (err) => {
      if (err) {
        console.error('Error moving file:', err);
        reject('Error uploading file: ' + err);
      } else {
        console.log('File saved successfully to:', filePath);
        resolve(filePath);  
      }
    });
  });
};

const validateExcelData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No valid data found in Excel file');
  }

  const requiredFields = ['account_id', 'username', 'email'];
  const missingFields = requiredFields.filter(field => !data[0].hasOwnProperty(field));

  if (missingFields.length > 0) {
    throw new Error(`Missing required columns: ${missingFields.join(', ')}`);
  }
};

const processUser = async (row) => {
  const { account_id, username, email } = row;

  if (!account_id || !username || !email) {
    return { 
      success: false, 
      reason: 'Missing required fields',
      data: row 
    };
  }

  try {
    const existingUser = await User.findOne({ account_id });
    if (existingUser) {
      return { 
        success: false, 
        reason: 'Account ID already exists',
        data: row 
      };
    }

    const newUser = new User({
      account_id,
      username,
      email,
      password: "@Student01",
      role: "Student",
      status: "Ready",
      asset_model: " ",
      first_access: "Yes",
      device_notif: " "
    });

    await newUser.save();
    return { success: true, user: newUser };
  } catch (error) {
    return { 
      success: false, 
      reason: error.message,
      data: row 
    };
  }
};

const uploadExcel = async (req, res) => {
  try {
    if (!req.files || !req.files.excelFile) {
      return res.status(400).json({ 
        isSuccess: false, 
        message: 'No file uploaded' 
      });
    }

    const excelFilePath = await saveFile(req.files.excelFile);
    
    if (!fs.existsSync(excelFilePath)) {
      return res.status(500).json({ 
        isSuccess: false, 
        message: 'File not found at expected path' 
      });
    }

    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; 
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate Excel structure
    validateExcelData(data);

    const results = {
      total: data.length,
      successCount: 0,
      failedCount: 0,
      savedUsers: [],
      failedUsers: []
    };

    // Process all users
    for (const row of data) {
      const result = await processUser(row);
      if (result.success) {
        results.successCount++;
        results.savedUsers.push(result.user);
      } else {
        results.failedCount++;
        results.failedUsers.push({
          data: result.data,
          reason: result.reason
        });
      }
    }

    // Clean up the file
    fs.unlinkSync(excelFilePath);

    return res.status(200).json({
      isSuccess: true,
      message: `${results.successCount} users added successfully, ${results.failedCount} failed`,
      totalRecords: results.total,
      savedUsers: results.savedUsers,
      failedUsers: results.failedUsers
    });

  } catch (error) {
    console.error('Error processing Excel file:', error);
    return res.status(500).json({ 
      isSuccess: false, 
      message: 'Error processing Excel file',
      error: error.message 
    });
  }
};

module.exports = { uploadExcel };