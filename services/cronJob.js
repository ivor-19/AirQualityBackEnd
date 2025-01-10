const cron = require('node-cron');
const AirQualityReading = require('../models/AirQualityReading');
const moment = require('moment-timezone');

const updateOutdatedReadings = async () => {
    try {
        const philippineTime = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        const currentTime = moment();
        
        // Find readings where the last_updated timestamp is older than 3 minutes
        const outdatedReadings = await AirQualityReading.find({
            last_updated: { $lt: new Date(currentTime.subtract(3, 'minutes')) }
        });

        console.log(`Found ${outdatedReadings.length} outdated readings`);

        if (outdatedReadings.length > 0) {
            for (let reading of outdatedReadings) {
                // Check if the status is already 'off', skip if so
                if (reading.status === 'off') {
                    console.log(`Reading for asset_model ${reading.asset_model} is already off, skipping update.`);
                    continue;
                }

                // Otherwise, update the reading
                reading.status = 'off';
                reading.aqi = 0;
                reading.pm2_5 = 0;
                reading.co = 0;
                reading.no2 = 0;
                reading.last_updated = philippineTime;  // Update the last_updated timestamp
                await reading.save();
                console.log(`Updated reading for asset_model ${reading.asset_model}`);
            }
        }
    } catch (error) {
        console.error('Error updating outdated readings:', error);
    }
};

// Schedule the task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Checking for outdated readings...');
    updateOutdatedReadings();
});

module.exports = { updateOutdatedReadings };
