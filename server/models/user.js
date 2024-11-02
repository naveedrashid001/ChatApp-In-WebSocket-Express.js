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
    friends: [{ 
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        avatar: { type: String, default: 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg' } // Use the same default avatar for friends
    }], // An array of friends
    messages: [messageSchema] // An array of messages sent/received by the user
});

module.exports = mongoose.model('User', userSchema);
