const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const googleConfig = require('../config/google');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '30d'
  });
};

// Configure Passport to use Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: googleConfig.clientID,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ['profile', 'email'],
      state: true, // Add state parameter for CSRF protection
      accessType: 'offline', // Request refresh token
      prompt: 'consent'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in our database
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // If user exists, return the user
          return done(null, user);
        }

        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // If user exists but doesn't have Google ID, update the user
          existingUser.googleId = profile.id;
          if (profile.photos && profile.photos.length > 0) {
            existingUser.picture = profile.photos[0].value;
          }
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create a new user
        const username = profile.displayName.replace(/\s+/g, '.').toLowerCase() + 
                         Math.floor(Math.random() * 1000);
        
        const newUser = await User.create({
          username: username,
          email: profile.emails[0].value,
          googleId: profile.id,
          picture: profile.photos[0].value,
          role: 'user'
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Configure Passport serialization/deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 