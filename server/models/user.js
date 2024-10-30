const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      name: String,
      phoneNumber: String,
      avatar: { type: String, default: 'https://static.vecteezy.com/system/resources/previews/027/448/973/non_2x/avatar-account-icon-default-social-media-profile-photo-vector.jpg' }, // Optional avatar for friends
    },
  ],
  avatar: {
    type: String,
    required: true,
    default: 'https://static.vecteezy.com/system/resources/previews/027/448/973/non_2x/avatar-account-icon-default-social-media-profile-photo-vector.jpg', // Default avatar for user
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
