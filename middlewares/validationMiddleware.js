const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateUserExists = async (student_id) => {
    const studentExists = await User.findOne({ student_id });
    if (studentExists) {
        throw new Error('Student ID already existed.');
    }
};

const checkDuplicateStudentId = async (student_id, user) => {
    const studentIdExists = student_id && student_id !== user.student_id ? await User.findOne({ student_id }) : null;
    if (studentIdExists) {
        throw new Error('Student ID already existed.');
    }

};

const hashPasswordIfNeeded = async (user, password) => {
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }
};

module.exports = { validateUserExists, checkDuplicateStudentId, hashPasswordIfNeeded };
