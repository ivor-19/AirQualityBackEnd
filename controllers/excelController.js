const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const saveFile = (file) => {
  const uploadDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads') // Vercel uses /tmp for file storage
  : path.join(__dirname, '../tmp');
  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); 
  }

  const fileName = Date.now() + path.extname(file.name);  
  const filePath = path.join(uploadDir, fileName); 

  console.log('Attempting to save file at:', filePath); 

  return new Promise((resolve, reject) => {
      file.mv(filePath, (err) => {
          if (err) {
              console.error('Error moving file:', err);
              reject('Error uploading file: ' + err);
          } else {
              console.log('File moved successfully to:', filePath);
              resolve(filePath);  
          }
      });
  });
};

const uploadExcel = async (req, res) => {
  try {
      console.log(req.files);
      if (!req.files || !req.files.excelFile) {
          return res.status(400).json({ isSuccess: false, message: 'No file uploaded' });
      }

      const excelFilePath = await saveFile(req.files.excelFile);  // Use await here
      console.log('File saved to:', excelFilePath);

      if (!fs.existsSync(excelFilePath)) {
          return res.status(500).json({ isSuccess: false, message: 'File not found at expected path' });
      }
      const workbook = xlsx.readFile(excelFilePath);
      const sheetName = workbook.SheetNames[0]; 
      const worksheet = workbook.Sheets[sheetName];

      const data = xlsx.utils.sheet_to_json(worksheet);

      const savedUsers = [];
      for (let row of data) {
          const { account_id, username, email } = row;

          if (!account_id || !username || !email ) {
              continue; // Skip if required data is missing
          }

          const newUser = new User({account_id, username, email,});
          try {
              await newUser.save();
              savedUsers.push(newUser);
          } catch (error) {
              console.error('Error creating users:', error);
          }
      }
      res.status(200).json({
          isSuccess: true,
          message: `${savedUsers.length} users added successfully`,
          savedUsers,
      });

      fs.unlinkSync(excelFilePath);

  } catch (error) {
      console.error('Error processing Excel file:', error);
      res.status(500).json({ isSuccess: false, message: 'Error processing Excel file', error });
  }
};

module.exports = {uploadExcel};