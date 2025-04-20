const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');

const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

const archiveSchema = new mongoose.Schema({
    account_id: {type: String},
    username: {type: String},
    email: {type: String}, 
    password: {type: String}, 
    role: {type: String},
    status: {type: String},
    asset_model: {type: String},
    first_access: {type: String},
    device_notif: {type: String},
    avatarPath: {type: String},
    created_at: {
        type: String, 
        
    },
    updated_at: {
        type: String, 
        
    }
});

const Archive = mongoose.model('Archive', archiveSchema);
module.exports = Archive;