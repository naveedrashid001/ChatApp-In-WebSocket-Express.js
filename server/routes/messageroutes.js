const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Correctly import User model


// Route for sending messages
router.post('/send', async (req, res) => {
  const { text, recipientPhoneNumber, currentUserPhoneNumber } = req.body;

  // Debugging log
  console.log("Received data:", { text, recipientPhoneNumber, currentUserPhoneNumber });

  if (!text || !recipientPhoneNumber || !currentUserPhoneNumber) {
      return res.status(400).json({ error: "Required fields are missing." });
  }

  try {
      const newMessage = new Message({
          sender: currentUserPhoneNumber,
          recipient: recipientPhoneNumber,
          message: text,
          timestamp: new Date(),
      });

      await newMessage.save();
      return res.status(200).json({ message: "Message sent successfully.", newMessage });
  } catch (error) {
      console.error("Error saving message:", error.message);
      return res.status(500).json({ error: "Internal server error." });
  }
});


// Route to send a message
router.post('/message', async (req, res) => {
  const { senderPhoneNumber, recipientPhoneNumber, content } = req.body;

  try {
      // Find sender and recipient
      const sender = await User.findOne({ phoneNumber: senderPhoneNumber });
      const recipient = await User.findOne({ phoneNumber: recipientPhoneNumber });

      if (!sender || !recipient) {
          return res.status(404).json({ message: 'Sender or recipient not found.' });
      }

      // Create a message object
      const message = {
          to: recipient._id,
          content,
          timestamp: new Date(),
      };

      // Save the message to sender's messages
      sender.messages.push(message);
      await sender.save();

      // Optionally save the message to recipient's messages as well
      recipient.messages.push(message);
      await recipient.save();

      res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message' });
  }
});


// Route to add a friend
router.post('/add-friend', async (req, res) => {
  const senderPhoneNumber = req.cookies.phoneNumber; 
  const newFriendPhoneNumber = req.body.friendPhoneNumber; // Assume the friend’s phone number is sent in the request body

  if (!senderPhoneNumber || !newFriendPhoneNumber) {
    return res.status(400).json({ error: 'Phone numbers are missing.' });
  }

  try {
    const senderUser = await User.findOne({ phoneNumber: senderPhoneNumber });
    if (!senderUser) {
      return res.status(404).json({ error: 'Sender not found.' });
    }

    // Add friend if not already in the friends list
    if (!senderUser.friends.find(friend => friend.phoneNumber === newFriendPhoneNumber)) {
      senderUser.friends.push({ phoneNumber: newFriendPhoneNumber, messages: [] });
      await senderUser.save();
    }

    res.status(200).json({ success: true, message: 'Friend added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Route to get messages between two users
router.get('/:recipientPhoneNumber', async (req, res) => {
  const senderPhoneNumber = req.cookies.phoneNumber;
  const recipientPhoneNumber = req.params.recipientPhoneNumber;

  if (!senderPhoneNumber || !recipientPhoneNumber) {
      return res.status(400).json({ error: 'Phone numbers are missing.' });
  }

  try {
      const senderUser = await User.findOne({ phoneNumber: senderPhoneNumber });
      if (!senderUser) {
          return res.status(404).json({ error: 'Sender not found.' });
      }

      const friend = senderUser.friends.find(friend => friend.phoneNumber === recipientPhoneNumber);
      if (!friend) {
          return res.status(404).json({ error: 'Friend not found in your friends list.' });
      }

      // Return all messages
      res.status(200).json({ messages: friend.messages });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
  }
});


module.exports = router;
