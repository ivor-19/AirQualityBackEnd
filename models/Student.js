const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    student_id: {type: String, unique: true, required: true,},
    name: {type: String, unique: true, required: true,},
    email: {type: String, unique: true, required: true,},
    phone_number: {type: String},
  });
  
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;