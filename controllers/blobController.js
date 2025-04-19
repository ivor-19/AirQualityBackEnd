const Blob = require('../models/Blob');

const getBlob = async (req, res) => {
    try{
      const list = await Blob.find();
      res.json(list);
  
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error})
    }
}

const postBlob = async (req, res) => {
    const {name, image} = req.body;
    const newBlob = new Blob({name, image});

    try {
        await newBlob.save();
        const getBlob = await Blob.find();
        res.status(201).json({ isSuccess: true, message: 'New chat is saved: ', getBlob})
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

module.exports = {getBlob, postBlob};
