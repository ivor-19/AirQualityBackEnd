const History = require('../models/History');

const getHistoryData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  
        const limit = parseInt(req.query.limit) || 10; 

        const skip = (page - 1) * limit;
        const history = await History.find()
                                 .skip(skip)   
                                 .limit(limit)  
                                 .exec();      

        const totalHistory = await History.countDocuments();
        const lastPage = Math.ceil(totalHistory / limit);

        res.json({
            isSuccess: true,
            history,
            pagination: {
                total: totalHistory,            // Total number of users
                per_page: limit,              // Number of users per page
                current_page: page,           // Current page number
                last_page: lastPage           // Last page number
            }
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error})
    }
}


const postHistoryData = async (req, res) => {
    const {date, timestamp, aqi, pm2_5, co, no2, scanned_by, scanned_using_model} = req.body;
    const newData = new History({date, timestamp, aqi, pm2_5, co, no2, scanned_by, scanned_using_model});

    try {
        await newData.save();
        const getList = await History.find();
        res.status(201).json({ isSuccess: true, message: 'New data is saved: ', getList})
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error saving data: ', error})
    }
}

const deleteHistory = async (req, res) => {
    const { id } = req.params;  
    try {
        const data = await History.findByIdAndDelete(id); 
        if (!data) {
            return res.status(400).json({ isSuccess: false, message: "Data not found" });
        }
        res.status(200).json({ isSuccess: true, message: 'History Data deleted successfully', data });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error deleting data history', error });
    }
}

module.exports = {getHistoryData, postHistoryData, deleteHistory};