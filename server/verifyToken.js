// middleware/auth.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = '1234';

// Middleware to verify the token and extract user info
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ error: 'User not authenticated' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: 'Token is invalid' });
    req.user = user; // Set user info from token
    next();
  });
};

module.exports = { verifyToken };
