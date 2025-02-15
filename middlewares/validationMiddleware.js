const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateUserExists = async (user_id) => {
    const userExists = await User.findOne({ user_id });
    if (userExists) {
        throw new Error('User already exists.');
    }
};

const checkDuplicateUser = async (user_id, user) => {
    const userExists = user_id && user_id !== user.user_id ? await User.findOne({ user_id }) : null;
    if (userExists) {
        throw new Error('User already exists.');
    }

};

const hashPasswordIfNeeded = async (user, password) => {
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }
};

module.exports = { validateUserExists, checkDuplicateUser, hashPasswordIfNeeded };
