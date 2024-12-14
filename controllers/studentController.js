const Student = require('../models/Student');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const saveFile = (file) => {
    const uploadDir = path.join('../tmp', 'uploads');
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

        const savedStudents = [];
        for (let row of data) {
            const { student_id, name, email, phone_number } = row;

            if (!student_id || !name || !email || !phone_number) {
                continue; // Skip if required data is missing
            }

            const newStudent = new Student({
                student_id,
                name,
                email,
                phone_number,
            });

            try {
                await newStudent.save();
                savedStudents.push(newStudent);
            } catch (error) {
                console.error('Error saving student:', error);
            }
        }

        res.status(200).json({
            isSuccess: true,
            message: `${savedStudents.length} students added successfully`,
            savedStudents,
        });

        fs.unlinkSync(excelFilePath);

    } catch (error) {
        console.error('Error processing Excel file:', error);
        res.status(500).json({ isSuccess: false, message: 'Error processing Excel file', error });
    }
};

const getStudentList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;

        // Extract filters from the query parameters
        const filters = {
            student_id: req.query.student_id || null,
            name: req.query.name || null,
            email: req.query.email || null,
            phone_number: req.query.phone_number || null,
            search: req.query.search || null,
        };

        // Build the query object
        const query = {};

        if (filters.student_id) {
            query.student_id = { $regex: filters.student_id, $options: 'i'};
        }

        if (filters.name) {
            query.name = { $regex: filters.name, $options: 'i' }; // Case-insensitive partial match
        }

        if (filters.email) {
            query.email = { $regex: filters.email, $options: 'i' };
        }

        if (filters.phone_number) {
            query.phone_number = { $regex: filters.phone_number, $options: 'i' };
        }

        if (filters.search) {
            query.$or = [
                { student_id: { $regex: filters.search, $options: 'i' } },
                { name: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { phone_number: { $regex: filters.search, $options: 'i' } },
            ];
        }

        // Execute the query with pagination
        const students = await Student.find(query)
                                      .skip(skip)
                                      .limit(limit)
                                      .exec();

        const totalStudent = await Student.countDocuments(query); 
        const lastPage = Math.ceil(totalStudent / limit);

        res.json({
            isSuccess: true,
            students,
            pagination: {
                total: totalStudent,           // Total number of students
                per_page: limit,               // Number of students per page
                current_page: page,            // Current page number
                last_page: lastPage            // Last page number
            }
        });
    } catch (error) {
        res.status(500).json({ 
            isSuccess: false, 
            message: 'Error fetching data', 
            error 
        });
    }
};


const addStudent = async (req, res) => {
    const {student_id, name, email, phone_number} = req.body;
    const newStudent = new Student({student_id, name, email, phone_number});

    try {
        await newStudent.save();
        const list = await Student.find();
        res.status(201).json({ isSuccess: true, message: 'New student is saved: ', list})
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error saving data: ', error})
    }
}

const deleteStudent = async (req, res) => {
    const { id } = req.params;  
    try {
        const data = await Student.findByIdAndDelete(id); 
        if (!data) {
            return res.status(400).json({ isSuccess: false, message: "Data not found" });
        }
        res.status(200).json({ isSuccess: true, message: 'Student Data deleted successfully', data });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error deleting student', error });
    }
}

const getEmails = async (req, res) => {
    try {
        const emails = await Student.find({}).select('email');

        res.status(200).json({
            isSuccess: true,
            message: 'Emails retrieved successfully',
            emails
        })
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error fetching emails', error})
    }
}

const editStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { student_id, name, email, phone_number } = req.body;

        const student = await Student.findById(id);
        if(!student){
            res.status(404).json({ isSuccess: false, message: 'Student not found ', error});
        }

        student.student_id = student_id || student.student_id;
        student.name = name || student.name;
        student.email = email || student.email;
        student.phone_number = phone_number || student.phone_number;

        await student.save();
        res.status(200).json({ isSuccess: true, message: 'Student updated successfully', student})

    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).json({ isSuccess: false, message: 'Server Error: Error editing user', error });
    }
};



module.exports = {getStudentList, addStudent, deleteStudent, getEmails, editStudent, uploadExcel};