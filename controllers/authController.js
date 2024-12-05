const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if(userExists){
            return res.status(400).json({message: 'Email already taken.'});
        }

        const newUser = new User({ username, email, password});
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
            return res.status(400).json({ message: 'Invalid email or password' });
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
  
        return res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err); 
        return res.status(500).json({ message: process.env.JWT_SECRET, error: err.message });
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

module.exports = {signup, login, getUsers};