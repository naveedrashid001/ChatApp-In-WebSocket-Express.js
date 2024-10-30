// routes/userroutes.js
const express = require('express');
const User = require('../models/user'); // Import the User model
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jwt for token generation
const { createAvatar } = require('@dicebear/avatars');
const style = require('@dicebear/avatars-bottts-sprites');

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
  
      // Generate a random avatar SVG
      const avatarSvg = createAvatar(style, { seed: phoneNumber || Math.random().toString() });
  
      // Create a new user instance
      const newUser = new User({
        phoneNumber,
        name,
        password: hashedPassword, // Save the hashed password
        avatar: avatarSvg,        // Save the avatar SVG
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
        res.status(500).json({ message: 'Error adding friend' });
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

module.exports = router; // Export the router
