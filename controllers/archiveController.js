const Archive = require('../models/Archive')
const User = require('../models/User')

const getUsersArchive = async (req, res) => {
    try{
        const users = await Archive.find();  // Fetch all AQChart readings
        res.json({
            isSuccess: true,
            message: "Fetch Archive data successfully",
            users
        });  
    }
    catch(err){
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error });
    }
}

const restoreUser = async (req, res) => {
    const { id } = req.params;  
    try {
        // 1. Find the user first
        const user = await Archive.findById(id);
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: "User not found" });
        }

        // 2. Create archive record
        const userRecord = new User({
            account_id: user.account_id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            status: user.status,
            asset_model: user.asset_model,
            first_access: user.first_access,
            device_notif: user.device_notif,
            avatarPath: user.avatarPath,
            created_at: user.created_at,
            updated_at: user.updated_at
        });

        await userRecord.save();

        // 3. Delete the original user
        await Archive.findByIdAndDelete(id);

        res.status(200).json({ 
            isSuccess: true, 
            message: 'User restored successfully', 
            user: userRecord 
        });
    } catch (error) {
        res.status(500).json({ 
            isSuccess: false, 
            message: 'Error during archive and delete process', 
            error: error.message // Sending just the message to avoid sending entire error object
        });
    }
}

const deletePermanent = async (req, res) => {
    const { id } = req.params;  
    try {
        const user = await Archive.findByIdAndDelete(id); 
        if (!user) {
            return res.status(400).json({ isSuccess: false, message: "User not found" });
        }
        res.status(200).json({ isSuccess: true, message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error deleting user', error });
    }
}

module.exports = { getUsersArchive, restoreUser, deletePermanent }