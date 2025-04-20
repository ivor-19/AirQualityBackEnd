const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');

const philippineTimeFull = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

const userSchema = new mongoose.Schema({
    account_id: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    email: {type: String}, // Remove unique and default since it's no longer primary
    password: {type: String}, // Remove unique constraint for password
    role: {type: String},
    status: {type: String, default: 'Available'},
    asset_model: {type: String, default: " "},
    first_access: {type: String, default: "Yes"},
    device_notif: {type: String, default: " "},
    avatarPath: {type: String, default: "lemur"},
    created_at: {
        type: String, 
        default: function() {
            return moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        }
    },
    updated_at: {
        type: String, 
        default: function() {
            return moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        }
    }
});
  
userSchema.pre('save', async function(next) {
    if (!this.isNew) {
        this.updated_at = moment().tz('Asia/Manila').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    }

    if (this.isModified('password')) {
        // Check if it's already a bcrypt hash (starts with $2a$, $2b$, or $2y$)
        const isHashed = /^\$2[aby]\$/.test(this.password);
        if (!isHashed) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;