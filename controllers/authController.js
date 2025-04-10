const User = require('../models/User');
const { generateToken } = require('../services/authServices');
const { validateUserExists, hashPasswordIfNeeded, checkDuplicateUser } = require('../middlewares/validationMiddleware');
const moment = require('moment-timezone');

const signup = async (req, res) => {
    try {
        const { account_id, username, email, password, role, status, asset_model, first_access, device_notif } = req.body;

        await validateUserExists(account_id);

        const newUser = new User({ account_id, username, email, password, role, status, asset_model, first_access, device_notif });
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
                status: user.status,
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
        const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
        
        // Default to `null` (or `Infinity`) for limit if not provided
        const limit = req.query.limit ? parseInt(req.query.limit) : null; 

        const skip = (page - 1) * (limit || 0);  // If there's no limit, skip 0 (no limit on number of results)

        const filters = {
            username: req.query.username || null,
            email: req.query.email || null,
            asset_model: req.query.asset_model || null,
            role: req.query.role || null,  // Filter by role
            search: req.query.search || null,
        }

        const query = {};  // Initialize the query object

        // Filter conditions for username, email, asset_model, and role
        if (filters.username) {
            query.username = { $regex: filters.username, $options: 'i' };
        }

        if (filters.email) {
            query.email = { $regex: filters.email, $options: 'i' };
        }

        if (filters.asset_model) {
            query.asset_model = { $regex: filters.asset_model, $options: 'i' };
        }

        if (filters.role) {  // Filter by role
            query.role = filters.role;
        }

        // If a search term is provided, search in multiple fields (username, email, asset_model)
        if (filters.search) {
            query.$or = [
                { username: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { asset_model: { $regex: filters.search, $options: 'i' } },
            ]
        }

        // Fetch the users with pagination (skip, limit) and the constructed query
        const usersQuery = User.find(query)
            .skip(skip); // Skip the appropriate number of records based on page

        // Apply the limit if it's defined
        if (limit) {
            usersQuery.limit(limit); // Apply limit only if it's not null/undefined
        }

        const users = await usersQuery.exec();

        // Get the total number of users matching the query (for pagination metadata)
        const totalUsers = await User.countDocuments(query);
        
        // Calculate the last page number
        const lastPage = limit ? Math.ceil(totalUsers / limit) : 1;  // If no limit, last page is 1

        // Return the response with users and pagination metadata
        res.json({
            isSuccess: true,
            users,
            pagination: {
                total: totalUsers,            // Total number of users found
                per_page: limit || totalUsers, // Number of users per page (if limit is not defined, show total count)
                current_page: page,           // Current page number
                last_page: lastPage,          // Last page number
            }
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error });
    }
};

// const getUsers = async (req, res) => {
//     try{
//         const users = await User.find();  // Fetch all AQChart readings
//         res.json({
//             isSuccess: true,
//             message: "Fetch Users successfully",
//             users
//         });  
//     }
//     catch(err){
//         res.status(500).json({ isSuccess: false, message: 'Error fetching data', error });
//     }
// }

const editUser = async (req, res) => {
    try {
        const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const { id } = req.params;
        const { account_id, username, email, password, role, status, asset_model, first_access, device_notif } = req.body;

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
        if (status) user.status = status;
        if (asset_model) user.asset_model = asset_model;
        if (first_access !== undefined) user.first_access = first_access;
        if (device_notif !== undefined) user.device_notif = device_notif;
        
        // Always update the updated_at timestamp
        user.updated_at = philippineTimeFull;

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
                status: user.status,
                asset_model: user.asset_model,
                first_access: user.first_access,
                device_notif: user.device_notif,
                updated_at: user.updated_at
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

const getEmails = async (req, res) => {
    try {
        const emails = await User.find({}).select('email');
        res.status(200).json({
            isSuccess: true,
            message: 'Emails retrieved successfully',
            emails
        })
    } catch (error) {
        res.status(500).json({isSuccess: false, message: 'Error fetching emails', error})
    }
}

const getAllAndAdminDeviceNotifs = async (req, res) => {
    try {
        const allUsers = await User.find().select('device_notif role');

        const allNotifs = allUsers
            .map(user => user.device_notif?.trim())
            .filter(notif => notif && notif !== " ")
            .filter((notif, index, self) => self.indexOf(notif) === index);

        const adminNotifs = allUsers
            .filter(user => user.role === 'Admin')
            .map(user => user.device_notif?.trim())
            .filter(notif => notif && notif !== " ")
            .filter((notif, index, self) => self.indexOf(notif) === index);

        res.status(200).json({
            isSuccess: true,
            message: 'All device notifications and admin device notifications retrieved',
            allDeviceNotifs: allNotifs,
            adminDeviceNotifs: adminNotifs
        });
    } catch (error) {
        console.error('Error in getAllAndAdminDeviceNotifs:', error);
        res.status(500).json({
            isSuccess: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};


module.exports = {signup, login, getUsers, editUser, deleteUser, getSpecificUser, getEmails, getAllAndAdminDeviceNotifs};