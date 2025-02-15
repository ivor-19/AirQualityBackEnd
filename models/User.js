const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    student_id: {type: String, unique: true, required: true},
    username: {type: String, unique: true, required: true,},
    email: {type: String, unique: true},
    password: {type: String, unique: true,},
    role: {type: String, required: true, default: 'Student'},
    status: {type: String, default: 'Active'},
    asset_model: {type: String},
    first_access: {type: String},
    device_notif: {type: String}
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