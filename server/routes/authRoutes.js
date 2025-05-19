const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  getUserProfile, 
  getUserByToken
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/user-by-token', getUserByToken);

// Protected Routes
router.get('/profile', protect, getUserProfile);

module.exports = router;