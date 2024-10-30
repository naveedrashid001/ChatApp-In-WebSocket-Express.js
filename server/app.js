const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package

// const messageRoutes = require('./routes/messageroutes'); // Import message routes
const userroutes = require('./routes/userroutes'); // Import auth routes
const { User1Messages, User2Messages } = require('./models/messages'); // Adjust this path if needed

const app = express();
const server = createServer(app);
const io = new Server(server);

// Enable CORS for all routes and origins
app.use(cors()); // This enables CORS for all origins
// Alternatively, customize CORS settings like this:
// app.use(cors({ origin: 'http://localhost:5173' }));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatapp')
  .then(() => console.log('Connected to MongoDB (chatapp)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '/public/index.html'));
});

// User registration route (using the imported auth routes)
app.use('/userroutes', userroutes); // Mount the auth routes on /userroutes path

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'chat message' events
  socket.on('chat message', (data) => {
    // Choose the correct model based on the user
    const MessageModel = data.user === 1 ? User1Messages : User2Messages;

    // Save the message to the appropriate user's collection
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

// Use the message routes
// app.use('/messages', messageRoutes); // Mount the message routes on /messages path

// Start the server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
