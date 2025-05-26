const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  clientID: process.env.GOOGLE_CLIENT_ID ,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
  callbackURL: process.env.GOOGLE_CALLBACK_URL ,
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
}; 