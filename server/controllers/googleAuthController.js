const jwt = require('jsonwebtoken');
const config = require('../config/db');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d'
  });
};

// @desc    Handle Google authentication success
// @route   GET /api/auth/google/callback
exports.googleCallback = (req, res) => {
  try {
    // Generate JWT token
    const token = generateToken(req.user._id);

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/auth/google/success?token=${token}`);
  } catch (error) {
    console.error('Google auth callback error:', error);
    res.redirect('http://localhost:3000/auth/google/failure');
  }
};

// @desc    Handle Google authentication failure
// @route   GET /api/auth/google/failure
exports.googleFailure = (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Google authentication failed'
  });
};

// @desc    Get current user from Google auth
// @route   GET /api/auth/google/current-user
exports.getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
}; 