const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    account_id: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true},
    email: {type: String, default: " "}, // Remove unique and default since it's no longer primary
    password: {type: String}, // Remove unique constraint for password
    role: {type: String, required: true, default: 'Student'},
    status: {type: String, default: 'Ready'},
    asset_model: {type: String, default: " "},
    first_access: {type: String, default: "Yes"},
    device_notif: {type: String, default: " "}
});
  
userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;