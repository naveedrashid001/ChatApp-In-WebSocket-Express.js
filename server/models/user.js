// models/User.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true, // Ensure phone numbers are unique
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, // Add the password field here
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
