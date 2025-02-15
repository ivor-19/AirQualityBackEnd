const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateUserExists = async (username, email) => {
    const userExists = await User.findOne({ username });
    if (userExists) {
        throw new Error('Username is already taken.');
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error('Email is already taken.');
    }
};

const checkDuplicateEmailOrUsername = async (username, email, user) => {
    const usernameExists = username && username !== user.username ? await User.findOne({ username }) : null;
    if (usernameExists) {
        throw new Error('Username is already taken');
    }

    const emailExists = email && email !== user.email ? await User.findOne({ email }) : null;
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
