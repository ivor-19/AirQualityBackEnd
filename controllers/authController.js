const User = require('../models/User');
const { generateToken } = require('../services/authServices');
const { validateUserExists, hashPasswordIfNeeded, checkDuplicateUser } = require('../middlewares/validationMiddleware');

const signup = async (req, res) => {
    try {
        const { account_id, username, email, password, role, asset_model, first_access, device_notif } = req.body;

        await validateUserExists(account_id);

        const newUser = new User({ account_id, username, email, password, role, asset_model, first_access, device_notif });
        await newUser.save();
        return res.status(201).json({isSuccess: true, message: 'Account created successfully!', newUser});
    } catch (error) {
        if (error.message === 'User already exists.') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ isSuccess: false, message: 'Server Error: Error creating account', error})
    }
}

const login = async (req, res) => {
    try {
        const { account_id, password } = req.body;
  
        const user = await User.findOne({ account_id });
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: 'Student does not exists' });
        }
  
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ isSuccess: false, message: 'Invalid id or password' });
        }
    
        const token = generateToken(user);
        console.log('Generated Token:', token);
        return res.json({
            isSuccess: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                account_id: user.account_id,
                username: user.username,
                email: user.email,
                role: user.role,  // Include the role in the response
                asset_model: user.asset_model,
                first_access: user.first_access,
                device_notif: user.device_notif,
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
            role: req.query.role || null,  // Filter by role
            search: req.query.search || null,
        }
        const query = {};

        if (filters.username) {
            query.username = { $regex: filters.username, $options: 'i' };
        }

        if (filters.email) {
            query.email = { $regex: filters.email, $options: 'i' };
        }

        if (filters.asset_model) {
            query.asset_model = { $regex: filters.asset_model, $options: 'i' };
        }

        if (filters.role) {  // Add role filter
            query.role = filters.role;
        }

        if (filters.search) {
            query.$or = [
                { username: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { asset_model: { $regex: filters.search, $options: 'i' } },
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
                total: totalUsers,            
                per_page: limit,              
                current_page: page,           
                last_page: lastPage           
            }
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error })
    }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { account_id, username, email, password, role, asset_model, first_access, device_notif } = req.body;

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ isSuccess: false, message: 'User not found' });
        }

        // If username or email is being updated, check for duplicates
        if (account_id) {
            await checkDuplicateUser(account_id, user);
        }

        // Update user fields if provided
        if (account_id) user.account_id = account_id;
        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (asset_model) user.asset_model = asset_model;
        if (first_access !== undefined) user.first_access = first_access;
        if (device_notif !== undefined) user.device_notif = device_notif;

        // Handle password update specifically
        if (password) {
            // The password will be automatically hashed by the pre-save middleware
            user.password = password;
        }

        // Save the updated user
        await user.save();

        return res.status(200).json({ 
            isSuccess: true, 
            message: 'User updated successfully',
            user: {
                _id: user._id,
                account_id: user.account_id,
                username: user.username,
                email: user.email,
                role: user.role,
                asset_model: user.asset_model,
                first_access: user.first_access,
                device_notif: user.device_notif
            }
        });
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

const getSpecificUser = async (req, res) => {
    const { id } = req.params;  
    try {
        const user = await User.findById(id); 
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: "User not found" });
        }
        res.status(200).json({ isSuccess: true, message: 'User found', user });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error finding user', error });
    }
}

module.exports = {signup, login, getUsers, editUser, deleteUser, getSpecificUser};