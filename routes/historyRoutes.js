const express = require('express');
const router = express.Router();
const History = require('../models/History');

router.get('/', async (req, res) => {
    try {
        const getList = await History.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching data', error})
    }
})

router.post('/', async (req, res) => {
    const { date, pm2_5, co2, no2, timestamp } = req.body;
    const newData = new History({ date, pm2_5, co2, no2, timestamp });

    try {
        await newData.save();
        const getList = await History.find();
        res.status(201).json({message: 'Successfully added: ', getList})
    } catch (error) {
        res.status(500).json({message: 'Error submitting data', error})
    }
})

module.exports = router;