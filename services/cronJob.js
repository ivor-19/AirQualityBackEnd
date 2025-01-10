const cron = require('node-cron');
const AirQualityReading = require('../models/AirQualityReading');

const updateOutdatedReadings = async () => {
    try {
        const currentTime = new Date();
        const outdatedReadings = await AirQualityReading.find({
            last_updated: { $lt: new Date(new Date() - 3 * 60 * 1000) }
        });
        console.log(`Found ${outdatedReadings.length} outdated readings`);

        if (outdatedReadings.length > 0) {
            for (let reading of outdatedReadings) {
                reading.status = 'off';
                reading.aqi = 0;
                reading.pm2_5 = 0;
                reading.co = 0;
                reading.no2 = 0;
                reading.last_updated = currentTime;
                await reading.save();
                console.log(`Updated reading for asset_model ${reading.asset_model}`);
            }
        }
    } catch (error) {
        console.error('Error updating outdated readings:', error);
    }
};

cron.schedule('* * * * *', () => {
    console.log('Checking for outdated readings...');
    updateOutdatedReadings();
});

module.exports = { updateOutdatedReadings };
