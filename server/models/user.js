const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    recipient: { type: String, required: true }, // Recipient's phone number
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg' },
    about: { type: String, default: '' }, // Add the "about" field here
    friends: [{ 
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        avatar: { type: String, default: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg' }
    }],
    messages: [messageSchema]
});

module.exports = mongoose.model('User', userSchema);
