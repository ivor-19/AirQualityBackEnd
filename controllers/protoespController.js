const ProtoEsp = require('../models/ProtoEsp');

const add = async (req, res) => {
  const {name} = req.body;
  const newName = new ProtoEsp({name});

  try{
    await newName.save();
    res.status(201).json({message: 'Success esp'});
  }
  catch(error){
    res.status(500).json({message: 'Error adding in esp', error});
  }
}

module.exports = add;