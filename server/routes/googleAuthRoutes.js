const express = require('express');
const router = express.Router();
const passport = require('../middlewares/googleAuthMiddleware');
const {
  googleCallback,
  googleFailure,
  getCurrentUser
} = require('../controllers/googleAuthController');

// Google OAuth login route
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google/failure',
    session: false
  }),
  googleCallback
);

// Google auth failure route
router.get('/google/failure', googleFailure);

// Get current user route (requires authentication)
router.get(
  '/google/current-user',
  (req, res, next) => {
    // This middleware is a placeholder for session-based auth
    // Our app is using JWT primarily, but this is for Google OAuth flow
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
  },
  getCurrentUser
);

module.exports = router; 