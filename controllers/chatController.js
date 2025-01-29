const Chat = require('../models/Chat');

const getChat = async (req, res) => {
    try{
      const list = await Chat.find();
      res.json(list);
  
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error})
    }
}

const postChat = async (req, res) => {
    const {message, sender} = req.body;
    const newChat = new Chat({message, sender, date: Date.now()});

    try {
        await newChat.save();
        const getChat = await Chat.find();
        res.status(201).json({ isSuccess: true, message: 'New chat is saved: ', getChat})
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error saving chat: ', error})
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

module.exports = {getChat, postChat};