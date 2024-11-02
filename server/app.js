// app.js
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userroutes = require('./routes/userroutes');
const messageRoutes = require('./routes/messageRoutes'); // Import message routes

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
  credentials: true, // Allow credentials for CORS
}));
app.use(express.json());
app.use(cookieParser());

// Attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatapp')
  .then(() => console.log('Connected to MongoDB (chatapp)'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/userroutes', userroutes);
app.use('/messages', messageRoutes); // Use the message route

// Start server
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
