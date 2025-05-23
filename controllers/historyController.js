const History = require('../models/History');
const moment = require('moment-timezone');

const getHistoryData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;  // If no limit, fetch all records

        const skip = (page - 1) * (limit || 0);  // If no limit, skip 0 (no limit)
        const history = await History.find()
                                     .skip(skip)
                                     .limit(limit || 0)  // If no limit, fetch all records
                                     .exec();

        const totalHistory = await History.countDocuments();
        const lastPage = limit ? Math.ceil(totalHistory / limit) : 1;  // If no limit, treat it as 1 page

        // Return the response with history and pagination metadata
        res.json({
            isSuccess: true,
            history,
            pagination: {
                total: totalHistory,            // Total number of records found
                per_page: limit || totalHistory, // Number of records per page (if limit is not defined, show total count)
                current_page: page,             // Current page number
                last_page: lastPage,            // Last page number
            }
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching data', error });
    }
}




const postHistoryData = async (req, res) => {
    const philippineTime = moment().tz('Asia/Manila');
    const timeNow = philippineTime.format('hh:mm A');
    const dateNow = philippineTime.format('YYYY-MM-DD');

    const {aqi, pm2_5, pm10, co, no2, scanned_by, scanned_using_model, message} = req.body;
    const newData = new History({date: dateNow, timestamp: timeNow, aqi, pm2_5, pm10, co, no2, scanned_by, scanned_using_model, message});

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