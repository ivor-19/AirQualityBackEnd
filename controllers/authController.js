const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { username, email, password, asset_model, first_access } = req.body;

        const userExists = await User.findOne({ username });
        if(userExists){
            return res.status(400).json({message: 'Username is already taken.'});
        }

        const emailExists = await User.findOne({ email });
        if(emailExists){
            return res.status(400).json({message: 'Email is already taken.'});
        }

        const newUser = new User({ username, email, password, asset_model, first_access});
        await newUser.save();
        return res.status(201).json({message: 'Account created successfully!'});
    } catch (error) {
        res.status(500).json({message: 'Server Error: Error creating account', error})
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email does not exists' });
        }
  
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
    
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('Generated Token:', token);
  
        return res.json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email,
                asset_model: user.asset_model,
                first_access: user.first_access
                // Do not send password to frontend for security reasons
            }
        });
    } catch (err) {
        console.error('Error during login:', err); 
        return res.status(500).json({ message: 'Server Error: Error logging account', error: err.message });
    }
  };

const getUsers = async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers)

    } catch (error) {
        res.status(500).json({message: 'Server Error: Error fetching data', error})
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, asset_model, first_access } = req.body;

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If password is being updated, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Check if the username or email already exists (if it's not the same as the current user)
        const usernameExists = username && username !== user.username ? await User.findOne({ username }) : null;
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const emailExists = email && email !== user.email ? await User.findOne({ email }) : null;
        if (emailExists) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        // Update the user's details
        user.username = username || user.username;
        user.email = email || user.email;
        user.asset_model = asset_model || user.asset_model;
        user.first_access = first_access || user.first_access;

        // Save the updated user
        await user.save();

        return res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).json({ message: 'Server Error: Error editing user', error });
    }
};

module.exports = {signup, login, getUsers, editUser};