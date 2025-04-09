const LatestAQ = require('../models/myModels');

const getLatestAQ = async (req, res) => {
    try {
        const getList = await LatestAQ.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching data', error})
    }
}

const postLatestAQ = async (req, res) => {
    const {aqi, pm2_5, co, no2} = req.body;
    const newData = new LatestAQ({aqi, pm2_5, co, no2});
    try {
        await newData.save();
        const getList = await LatestAQ.find();
        res.status(201).json({message: 'New data is saved', getList})
    } catch (error) {
        res.status(500).json({message: 'Error saving data: ', error})
    }
}

module.exports = {getLatestAQ, postLatestAQ}