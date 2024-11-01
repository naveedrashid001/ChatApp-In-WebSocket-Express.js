// models/User.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const friendSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  avatar: String,
  messages: [messageSchema], // Array to store messages with each friend
});

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://static.vecteezy.com/system/resources/previews/027/448/973/non_2x/avatar-account-icon-default-social-media-profile-photo-vector.jpg' },
  about: { type: String, default: '' },
  friends: [friendSchema],
});

module.exports = mongoose.model('User', userSchema);
