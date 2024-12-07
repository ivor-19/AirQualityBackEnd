const History = require('../models/History');

const getHistoryData = async (req, res) => {
    try {
        const getList = await History.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching data', error})
    }
}


const postHistoryData = async (req, res) => {
    const {date, timestamp, aqi, pm2_5, co, no2, scanned_by, scanned_using_model} = req.body;
    const newData = new History({date, timestamp, aqi, pm2_5, co, no2, scanned_by, scanned_using_model});

    try {
        await newData.save();
        const getList = await History.find();
        res.status(201).json({message: 'New data is saved: ', getList})
    } catch (error) {
        res.status(500).json({message: 'Error saving data: ', error})
    }
}

module.exports = {getHistoryData, postHistoryData};