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
        // 1. Find the archived user
        const archivedUser = await Archive.findById(id);
        if (!archivedUser) {
            return res.status(400).json({ isSuccess: false, message: "Archived user not found" });
        }

        // 2. Create new user record
        const userRecord = new User({
            ...archivedUser._doc,
            updated_at: new Date() // Update the timestamp
        });

        // Remove archive-specific fields if needed
        delete userRecord._doc.archivedAt;

        await userRecord.save();

        // 3. Delete the archive record
        await Archive.findByIdAndDelete(id);

        res.status(200).json({ 
            isSuccess: true, 
            message: 'User restored successfully', 
            user: userRecord 
        });
    } catch (error) {
        res.status(500).json({ 
            isSuccess: false, 
            message: 'Error during restoration process', 
            error: error.message
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