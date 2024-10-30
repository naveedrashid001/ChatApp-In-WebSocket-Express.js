// Import necessary modules
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const userroutes = require('./routes/userroutes');
const { User1Messages, User2Messages } = require('./models/messages'); 

const app = express();
const server = createServer(app);
const io = new Server(server);

// Enable CORS for frontend connection (customize if needed)
app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatapp')
  .then(() => console.log('Connected to MongoDB (chatapp)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Serve static file
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/public/index.html'));
});

// Use user routes
app.use('/userroutes', userroutes);

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (data) => {
    const MessageModel = data.user === 1 ? User1Messages : User2Messages;

    const newMessage = new MessageModel({
      message: data.message,
    });

    newMessage.save()
      .then(() => console.log(`Message from User ${data.user} saved to MongoDB`))
      .catch((err) => console.error('Error saving message:', err));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
