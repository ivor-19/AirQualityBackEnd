const ExpoTokenNotification = require('../models');

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
    const { token_notif } = req.body;

    try {
        const existingToken = await ExpoTokenNotification.findOne({ token_notif });
        if (existingToken) {
            return res.status(200).json({
                isSuccess: true,
                message: 'Token already exists, no action taken.',
            });
        }

        const newToken = new ExpoTokenNotification({ token_notif });
        await newToken.save();

        res.status(201).json({
            isSuccess: true,
            message: 'New token saved successfully',
        });
    } catch (error) {
        res.status(500).json({ isSuccess: false, message: 'Error saving token', error });
    }
};


module.exports = {getToken, postToken};