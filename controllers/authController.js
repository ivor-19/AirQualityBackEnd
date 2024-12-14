const User = require('../models/User');
const { generateToken } = require('../services/authServices');
const { validateUserExists, hashPasswordIfNeeded, checkDuplicateEmailOrUsername } = require('../middlewares/validationMiddleware');

const signup = async (req, res) => {
    try {
        const { username, email, password, asset_model, first_access } = req.body;

        await validateUserExists(username, email);

        const newUser = new User({ username, email, password, asset_model, first_access});
        await newUser.save();
        return res.status(201).json({isSuccess: true, message: 'Account created successfully!'});
    } catch (error) {
        if (error.message === 'Username is already taken.' || error.message === 'Email is already taken.') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ isSuccess: false, message: 'Server Error: Error creating account', error})
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'Email does not exists' });
        }
  
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ isSuccess: false, message: 'Invalid email or password' });
        }
    
        const token = generateToken(user);
        console.log('Generated Token:', token);
        return res.json({
            isSuccess: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                asset_model: user.asset_model,
                first_access: user.first_access
                // Do not send password to frontend for security reasons
            }
        });
    } catch (err) {
        console.error('Error during login:', err); 
        return res.status(500).json({ isSuccess: false, message: 'Server Error: Error logging account', error: err.message });
    }
  };

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;

        const filters = {
            username: req.query.username || null,
            email: req.query.email || null,
            asset_model: req.query.asset_model || null,
            search: req.query.search || null,
        }
        const query = {};

        if(filters.username){
            query.username = { $regex: filters.username, $options: 'i'}
        }

        if(filters.email){
            query.email = { $regex: filters.email, $options: 'i'}
        }

        if(filters.asset_model){
            query.asset_model = { $regex: filters.asset_model, $options: 'i'}
        }

        if(filters.search){
            query.$or = [
                { username: {$regex: filters.search, $options: 'i'} },
                { email: { $regex: filters.search, $options: 'i'} },
                { asset_model: { $regex: filters.search, $options: 'i'} },
            ]
        }

        const users = await User.find(query)
                                 .skip(skip)   
                                 .limit(limit)  
                                 .exec();      

        const totalUsers = await User.countDocuments(query);
        const lastPage = Math.ceil(totalUsers / limit);

        res.json({
            isSuccess: true,
            users,
            pagination: {
                total: totalUsers,            // Total number of users
                per_page: limit,              // Number of users per page
                current_page: page,           // Current page number
                last_page: lastPage           // Last page number
            }
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error})
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, asset_model, first_access } = req.body;

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ isSuccess: false, message: 'User not found' });
        }

        // If password is being updated, hash it
        await hashPasswordIfNeeded(user, password)

        await checkDuplicateEmailOrUsername(username, email, user)

        // Update the user's details
        user.username = username || user.username;
        user.email = email || user.email;
        user.asset_model = asset_model || user.asset_model;
        user.first_access = first_access || user.first_access;

        // Save the updated user
        await user.save();

        return res.status(200).json({ isSuccess: true, message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).json({ isSuccess: false, message: 'Server Error: Error editing user', error });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;  
    try {
        const user = await User.findByIdAndDelete(id); 
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: "User not found" });
        }
        res.status(200).json({ isSuccess: true, message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error deleting user', error });
    }
}

module.exports = {signup, login, getUsers, editUser, deleteUser};