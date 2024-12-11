const Student = require('../models/Student');

const getStudentList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 

        const skip = (page - 1) * limit;
        const student = await Student.find()
                                 .skip(skip)   
                                 .limit(limit)  
                                 .exec();      

        const totalStudent = await Student.countDocuments();
        const lastPage = Math.ceil(totalStudent / limit);

        res.json({
            isSuccess: true,
            student,
            pagination: {
                total: totalStudent,            // Total number of students
                per_page: limit,              // Number of students per page
                current_page: page,           // Current page number
                last_page: lastPage           // Last page number
            }
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error})
    }
}


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

module.exports = {getStudentList, addStudent, deleteStudent};