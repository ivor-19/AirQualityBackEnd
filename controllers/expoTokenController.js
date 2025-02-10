const ExpoTokenNotification = require('../models/ExpoTokenNotification');

const getToken = async (req, res) => {
    try{
      const tokens = await ExpoTokenNotification.find();
      res.status(200).json({
          isSuccess: true,
          message: 'Notification Tokens retrieved successfully',
          tokens,
      })
  
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error fetching tokens', error})
    }
}

const postToken = async (req, res) => {
    const {token_notif} = req.body;
    const newToken = new ExpoTokenNotification({token_notif});

    try {
        await newToken.save();
        const getToken = await ExpoTokenNotification.find();
        res.status(201).json({ isSuccess: true, message: 'New token is saved: ', getToken})
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error saving token: ', error})
    }
}

module.exports = {getToken, postToken};