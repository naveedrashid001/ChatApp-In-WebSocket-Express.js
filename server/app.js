const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const User = require('./models/User'); // Import User model
const userroutes = require('./routes/userroutes');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials for Socket.IO
  }
});

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatapp')
  .then(() => console.log('Connected to MongoDB (chatapp)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO functionality
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages
  socket.on('sendMessage', async ({ sender, recipient, message }) => {
    try {
      // Save message to the user's messages array
      await User.updateOne(
        { phoneNumber: sender }, 
        { $push: { messages: { recipient, message } } }
      );

      // Emit message to the recipient
      socket.to(recipient).emit('receiveMessage', { sender, message });

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
});

app.use('/userroutes', userroutes);

// Start server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
