const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const User1Messages = mongoose.model('User1Messages', messageSchema);
const User2Messages = mongoose.model('User2Messages', messageSchema);

module.exports = { User1Messages, User2Messages };
