// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/messages');
const { verifyToken } = require('../verifyToken'); // Auth middleware

// Route to send a message
router.post('/send', verifyToken, async (req, res) => {
  try {
    // Extract sender ID from the authenticated user
    const senderId = req.user._id;
    const { recipientId, message } = req.body;

    // Check if recipient and message are provided
    if (!recipientId || !message) {
      return res.status(400).json({ error: 'Recipient ID and message content are required.' });
    }

    // Create a new message
    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      message,
    });

    // Save the message in the database
    await newMessage.save();

    // Emit the new message event via Socket.IO
    req.io.emit('chat message', newMessage);

    // Send a success response with the message data
    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
