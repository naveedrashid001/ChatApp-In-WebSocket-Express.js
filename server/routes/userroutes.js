const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// User registration route
router.post('/register', async (req, res) => {
    const { phoneNumber, name, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance without manually setting an avatar (model's default will be used)
        const newUser = new User({
            phoneNumber,
            name,
            password: hashedPassword // Save the hashed password
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// User login route
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    // Find the user by phone number
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Route to add a friend
// Route to add a friend
router.post('/friend', async (req, res) => {
    const { phoneNumber, currentUserPhoneNumber } = req.body;
    console.log("Incoming request - Phone Number:", phoneNumber, "Current User Phone Number:", currentUserPhoneNumber);

    try {
        // Find the friend by their phone number
        const friend = await User.findOne({ phoneNumber });
        if (!friend) {
            return res.status(404).json({ message: 'There is no account with this number.' });
        }

        // Find the current user by phone number
        const currentUser = await User.findOne({ phoneNumber: currentUserPhoneNumber });
        if (!currentUser) {
            return res.status(404).json({ message: 'Current user not found.' });
        }

        // Check if the friend is already in the user's friend list
        const isFriendAlreadyAdded = currentUser.friends.some(f => f.phoneNumber === friend.phoneNumber);
        if (isFriendAlreadyAdded) {
            return res.status(400).json({ message: 'Friend is already added.' });
        }

        // Create a friend object to add to the current user's friends list
        const friendToAdd = {
            name: friend.name,
            phoneNumber: friend.phoneNumber,
            avatar: (friend.avatar && typeof friend.avatar === 'string') ? friend.avatar : 'https://static.vecteezy.com/system/resources/previews/027/448/973/non_2x/avatar-account-icon-default-social-media-profile-photo-vector.jpg' // Default avatar if not set
        };

        // Add the friend to the current user's friends list
        currentUser.friends.push(friendToAdd);
        await currentUser.save();

        // Respond with success and friend info, including avatar
        res.status(200).json({
            message: 'Friend added successfully!',
            friend: friendToAdd // Include friend data with avatar
        });
    } catch (error) {
        console.error('Error adding friend:', error);
        // Check if the error has a specific message
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ message: 'Validation Error', details: error.errors });
        }
        res.status(500).json({ message: 'Error adding friend', error: error.message });
    }
});



// Route to get all friends for the current user
router.get('/friends/:phoneNumber', async (req, res) => {
    const { phoneNumber } = req.params;
    try {
        // Log for debugging
        console.log(`Fetching friends for user with phone number: ${phoneNumber}`);

        const user = await User.findOne({ phoneNumber });
        
        if (!user) {
            console.log('User not found with this phone number:', phoneNumber);
            return res.status(404).json({ message: 'User not found.' });
        }

        // Respond with the user's friends list, including avatars
        res.status(200).json(user.friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Error fetching friends' });
    }
});

// // Check if the user exists based on the phone number
router.get('/checkUser', async (req, res) => {
  const { phoneNumber } = req.query;

  try {
    const user = await User.findOne({ phoneNumber });

    if (user) {
      res.status(200).json({ message: 'User exists' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ message: 'Server error while checking user' });
  }
});


// Route to add an image URL to the user profile
router.post('/addImage', async (req, res) => {
    const { phoneNumber, imageUrl } = req.body;
  
    try {
      // Find the user by phone number
      const user = await User.findOne({ phoneNumber });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's image URL if provided, else keep the default
      if (imageUrl) {
        user.avatar = imageUrl;
      }
      await user.save();
  
      res.status(200).json({ message: 'Image saved successfully' });
    } catch (error) {
      console.error('Error saving image:', error);
      res.status(500).json({ message: 'Server error while saving image' });
    }
  });

  // profile page 
router.get('/user/avatar', async (req, res) => {
    const phoneNumber = req.query.phoneNumber;

    try {
        const user = await User.findOne({ phoneNumber });
        
        if (user) {
            res.status(200).json({ avatar: user.avatar });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user avatar:', error);
        res.status(500).json({ message: 'Error fetching user avatar' });
    }
});

// Route to get user for profile page  no need 
router.get('/user', async (req, res) => {
    const { phoneNumber } = req.query;
  
    try {
      const user = await User.findOne({ phoneNumber });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  });

router.post('/user/update', async (req, res) => {
    const { phoneNumber, avatar, name, about } = req.body;

    try {
        // Find and update the user based on their phone number
        const user = await User.findOneAndUpdate(
            { phoneNumber },
            { avatar, name, about },
            { new: true } // Return the updated document
        );

        if (user) {
            res.status(200).json({ message: 'User profile updated successfully', user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
});


// Update friend's name
router.put('/friend/update', async (req, res) => {
    const { phoneNumber, friendOldName, friendNewName } = req.body;

    try {
        // Find the user by phone number
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Find the friend in the user's friends array
        const friend = user.friends.find(f => f.name === friendOldName);
        if (!friend) {
            return res.status(404).json({ message: "Friend not found." });
        }

        // Update friend's name
        friend.name = friendNewName;
        await user.save();

        // Return updated friends list
        res.json(user.friends);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

router.delete('/friend/:friendId', async (req, res) => {
    const { friendId } = req.params;
    const { phoneNumber } = req.body; // Assuming you need to validate the request with the phone number
  
    try {
      // Find the user by their phone number
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the friend from the user's friends array
      user.friends = user.friends.filter(friend => friend._id.toString() !== friendId);
      await user.save(); // Save the updated user data
  
      res.status(200).json(user.friends); // Return the updated friends list
    } catch (error) {
      console.error('Error deleting friend:', error);
      res.status(500).json({ message: 'Error deleting friend' });
    }
  });
  

  // Route to get all users
router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  });
  
// Get user details route
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from the result

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details', error });
  }
});

/////      MESSAGES ROUTE 

// sendd meesages 
router.post('/send', async (req, res) => {
    const { text, recipientPhoneNumber, senderPhoneNumber } = req.body;

    if (!text || !recipientPhoneNumber || !senderPhoneNumber) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    try {
        // Find both sender and recipient users
        const sender = await User.findOne({ phoneNumber: senderPhoneNumber });
        const recipient = await User.findOne({ phoneNumber: recipientPhoneNumber });

        if (!recipient) {
            return res.status(404).json({ error: "Recipient not found." });
        }

        // Create a message object
        const message = {
            recipient: recipientPhoneNumber,
            message: text,
            timestamp: new Date(),
        };

        // Add the message to the recipient's messages
        recipient.messages.push(message);
        await recipient.save();

        // Optionally, save the message to the sender's messages as well
        sender.messages.push({
            recipient: recipientPhoneNumber,
            message: text,
            timestamp: new Date(),
        });
        await sender.save();

        return res.status(200).json({ message: "Message sent successfully.", message });
    } catch (error) {
        console.error("Error sending message:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
});


//  get messages
// Fetch messages for a specific recipient
router.get('/:recipientPhoneNumber', async (req, res) => {
    const senderPhoneNumber = req.cookies.phoneNumber; // Get the sender's phone number from cookies
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

        // Find the messages related to the friend from the sender's messages
        const friendMessages = senderUser.messages.filter(msg => msg.recipient === recipientPhoneNumber);
        res.status(200).json({ messages: friendMessages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router; // Export the router
