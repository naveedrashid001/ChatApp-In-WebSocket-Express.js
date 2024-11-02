const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    avatar: { type: String, default: 'default_avatar_url_here' },
});

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    friends: [friendSchema], // An array of friends
    avatar: { type: String, default: 'default_avatar_url_here' }
});

module.exports = mongoose.model('User', userSchema);
