const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: String,
  twitterId: String,
  discordId: String,
  username: String,
  email: String,
});

module.exports = mongoose.model('User', UserSchema);