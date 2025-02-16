const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true,},
    account_id: {type: String, unique: true, required: true},
    email: {type: String, default: " "},
    password: {type: String},
    role: {type: String, required: true, default: 'Student'},
    asset_model: {type: String, default: " "},
    first_access: {type: String, default: "Yes"}
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