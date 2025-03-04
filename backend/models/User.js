// Path: backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, index: true, sparse: true },
  twitterId: { type: String, index: true, sparse: true },
  discordId: { type: String, index: true, sparse: true },
  displayName: String,
  email: { type: String, required: false },
  token: { type: String, required: false },
  tokenSecret: { type: String, required: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;