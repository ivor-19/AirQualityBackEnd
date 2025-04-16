const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateUserExists = async (account_id) => {
    const accountExists = await User.findOne({ account_id });
    if (accountExists) {
        throw new Error('User already exists.');
    }
};

const validateEmailExists = async (email) => {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error('Email already exists.');
    }
};

const checkDuplicateUser = async (account_id, user) => {
    const accountExists = account_id && account_id !== user.account_id ? await User.findOne({ account_id }) : null;
    if (accountExists) {
        throw new Error('User already exists.');
    }

};

const hashPasswordIfNeeded = async (user, password) => {
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }
};

module.exports = { validateUserExists, checkDuplicateUser, hashPasswordIfNeeded, validateEmailExists };
