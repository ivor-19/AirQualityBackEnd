const Student = require('../models/Student');

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

module.exports = {getStudentList, addStudent, deleteStudent, getEmails};