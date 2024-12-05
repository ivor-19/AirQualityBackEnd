const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const getList = await User.find();
        res.json(getList);
    } catch (error) {
        res.status(500).json({message: 'Error fetching data', error})
    }
}


const postUsers = async (req, res) => {
    const {username, email, password} = req.body;
    const newData = new User({username, email, password});

    try {
        await newData.save();
        const getList = await User.find();
        res.status(201).json({message: 'New data is saved: ', getList})
    } catch (error) {
        res.status(500).json({message: 'Error saving data: ', error})
    }
}

module.exports = {getUsers, postUsers};