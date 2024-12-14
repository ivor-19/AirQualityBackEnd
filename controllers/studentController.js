const Student = require('../models/Student');
const XLSX = require('xlsx');
const upload = require('../middlewares/fileUploadMiddleware');

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
            query.student_id = { $reges: filters.student_id, $options: 'i'};
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

const importExcel = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ isSuccess: false, message: 'Error uploading file', error: err.message });
        }

        try {
            // Read the uploaded Excel file
            const workbook = XLSX.readFile(req.file.path);
            const sheet_name_list = workbook.SheetNames;
            const sheet = workbook.Sheets[sheet_name_list[0]]; // Get the first sheet

            // Parse the sheet into JSON data
            const data = XLSX.utils.sheet_to_json(sheet);

            // Iterate over the data and save to the database
            for (const row of data) {
                const { student_id, name, email, phone_number } = row;

                // Check if student already exists
                const existingStudent = await Student.findOne({ student_id });
                if (!existingStudent) {
                    const newStudent = new Student({ student_id, name, email, phone_number });
                    await newStudent.save();
                }
            }

            // Respond with success message
            res.status(200).json({ isSuccess: true, message: 'Students imported successfully' });
        } catch (error) {
            res.status(500).json({ isSuccess: false, message: 'Error importing students', error: error.message });
        }
    });
};


module.exports = {getStudentList, addStudent, deleteStudent, getEmails, editStudent, importExcel};