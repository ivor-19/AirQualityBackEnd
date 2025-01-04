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

  try{
    const newReadings = await ProtoEsp.findOneAndUpdate({}, {temperature, humidity}, {new: True});
    if(!newReadings){
      return res.status(404).json({message: 'No data found to update'})
    }
    res.status(201).json({message: 'Updated Successfully', newReadings});
  }
  catch(error){
    res.status(500).json({message: 'Error adding in esp', error});
  }
}

module.exports = {getList, updateReadings};