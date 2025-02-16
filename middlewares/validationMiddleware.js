const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateUserExists = async (account_id) => {

    const emailExists = await User.findOne({ account_id });
    if (emailExists) {
        throw new Error('Email is already taken.');
    }
};

const checkDuplicateEmailOrUsername = async (account_id, user) => {

    const emailExists = account_id && account_id !== user.account_id ? await User.findOne({ account_id }) : null;
    if (emailExists) {
        throw new Error('Email is already taken');
    }
};

const hashPasswordIfNeeded = async (user, password) => {
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }
};

module.exports = { validateUserExists, checkDuplicateEmailOrUsername, hashPasswordIfNeeded };
