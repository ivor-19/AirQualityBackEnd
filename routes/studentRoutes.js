const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async (req, res) => {
    try {
        const getList = await Student.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching data', error})
    }
})

router.post('/', async (req, res) => {
    const {name, age} = req.body;
    const newStudent = new Student({name, age});

    try {
        await newStudent.save();
        const getList = await Student.find();
        res.status(201).json({message: 'Student is added in the database', getList})
    } catch (error) {
        res.status(500).json({message: 'Error adding student', error})
    }
})



module.exports = router;