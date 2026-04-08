const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 1. Fetch the user
      req.user = await User.findById(decoded.id).select('-password');

      // 2. THE CRITICAL FIX: If the token is valid but the user doesn't exist anymore, STOP!
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists in database. Please log out and sign up again.' });
      }

      next(); 
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };