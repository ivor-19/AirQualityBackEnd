const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const saveFile = (file) => {
    const uploadDir = process.env.VERCEL
        ? path.join('/tmp', 'uploads') // Vercel uses /tmp
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
                console.log('File saved successfully at:', filePath);
                resolve(filePath);
            }
        });
    });
};

const uploadExcel = async (req, res) => {
    try {
        if (!req.files || !req.files.excelFile) {
            return res.status(400).json({ isSuccess: false, message: 'No file uploaded' });
        }

        const excelFilePath = await saveFile(req.files.excelFile);

        if (!fs.existsSync(excelFilePath)) {
            return res.status(500).json({ isSuccess: false, message: 'File not found after upload' });
        }

        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        console.log(`Parsed ${data.length} rows from Excel`);

        const savedUsers = [];

        for (let row of data) {
            const { account_id, username, email } = row;

            if (!account_id || !username || !email) {
                console.log('Skipping row with missing data:', row);
                continue;
            }

            try {
                const existingUser = await User.findOne({ account_id });

                if (existingUser) {
                    console.log(`User with account_id ${account_id} already exists. Skipping.`);
                    continue;
                }

                const newUser = new User({ account_id, username, email });
                await newUser.save();

                savedUsers.push(newUser);
                console.log(`Saved user: ${account_id}`);
            } catch (error) {
                console.error(`Error saving user ${account_id}:`, error.message);
            }
        }

        fs.unlinkSync(excelFilePath); // Clean up temp file

        return res.status(200).json({
            isSuccess: true,
            message: `${savedUsers.length} users added successfully`,
            savedUsers,
        });

    } catch (error) {
        console.error('Unhandled error in uploadExcel:', error);
        return res.status(500).json({
            isSuccess: false,
            message: 'Error processing Excel file',
            error: error.message,
        });
    }
};

module.exports = { uploadExcel };
