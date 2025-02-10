const ExpoTokenNotification = require('../models/ExpoTokenNotification');

const getToken = async (req, res) => {
    try{
      const list = await ExpoTokenNotification.find();
      res.json(list);
  
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching tokens', error})
    }
}

const postToken = async (req, res) => {
    const {token_notif} = req.body;
    const newToken = new ExpoTokenNotification({token_notif});

    try {
        await newToken.save();
        const getToken = await ExpoTokenNotification.find();
        res.status(201).json({ isSuccess: true, message: 'New token is saved: ', getToken})
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error saving token: ', error})
    }
}

// const deleteHistory = async (req, res) => {
//     const { id } = req.params;  
//     try {
//         const data = await History.findByIdAndDelete(id); 
//         if (!data) {
//             return res.status(400).json({ isSuccess: false, message: "Data not found" });
//         }
//         res.status(200).json({ isSuccess: true, message: 'History Data deleted successfully', data });
//     } catch (error) {
//         res.status(500).json({ isSuccess: false, message: 'Error deleting data history', error });
//     }
// }

module.exports = {getToken, postToken};