const express = require('express');
const router = express.Router();
const LatestAQ = require('../models/LatestAQ');

router.get('/', async (req, res) => {
    try {
        const getList = await LatestAQ.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching data', error})
    }
})

router.post('/', async (req, res) => {
    const { date, timestamp, aqi, pm2_5, co, no2 } = req.body;
    const newData = new LatestAQ({ date, timestamp, aqi, pm2_5, co, no2 });

    try {
        await newData.save();
        const getList = await LatestAQ.find();
        res.status(201).json({message: 'Successfully added: ', getList})
    } catch (error) {
        res.status(500).json({message: 'Error submitting data', error})
    }
})

module.exports = router;