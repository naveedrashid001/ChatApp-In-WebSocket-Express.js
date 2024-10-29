const express = require('express');
const router = express.Router();
const { User1Messages, User2Messages } = require('../models/messages'); // Adjusted path

// Delete all messages for a specified user
router.delete('/delete-messages/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  let MessageModel;

  // Determine which model to use based on userId
  if (userId === 1) {
    MessageModel = User1Messages;
  } else if (userId === 2) {
    MessageModel = User2Messages;
  } else {
    return res.status(400).send('Invalid user ID');
  }

  try {
    // Delete all documents from the user's collection
    await MessageModel.deleteMany({});
    res.status(200).send(`All messages for User ${userId} have been deleted.`);
  } catch (err) {
    console.error('Error deleting messages:', err);
    res.status(500).send('An error occurred while deleting messages.');
  }
});

module.exports = router;
