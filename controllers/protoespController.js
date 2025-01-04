const ProtoEsp = require('../models/ProtoEsp');


const getList = async(req, res) => {
  try{
    const list = await ProtoEsp.find();
    res.json(list);
  }
  catch(error){
    res.status(500).json({message: 'Error fetching data', error})
  }
}

const updateReadings = async (req, res) => {
  const {temperature, humidity} = req.body;
  const newReadings = new ProtoEsp({temperature, humidity});

  try{
    await newReadings.save();
    res.status(201).json({message: 'Success esp'});
  }
  catch(error){
    res.status(500).json({message: 'Error adding in esp', error});
  }
}

module.exports = {getList, updateReadings};