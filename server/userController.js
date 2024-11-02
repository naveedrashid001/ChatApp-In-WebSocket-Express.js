const User = require('./models/User'); // Adjust the path based on your file structure

// Send Message Function
const sendMessage = async (req, res) => {
  const { senderId, recipientId, messageContent } = req.body;

  try {
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    // Create message object
    const message = {
      to: recipientId,
      content: messageContent,
    };

    // Add message to sender's and recipient's message list
    sender.messages.push(message);
    recipient.messages.push(message);

    await sender.save();
    await recipient.save();

    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add Friend Function
const addFriend = async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Friend added successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { sendMessage, addFriend };
