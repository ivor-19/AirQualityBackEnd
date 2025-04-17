const Archive = require('../models/Archive')

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

module.exports = { getUsersArchive }