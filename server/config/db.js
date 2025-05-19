module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret', // Use env or fallback
  // MONGODB_URI is loaded from environment in server.js
};
