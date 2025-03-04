// Path: backend/models/TrackedProfile.js
const mongoose = require('mongoose');

const trackedProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileId: { type: String, required: true },
  platform: { type: String, required: true, enum: ['twitter', 'discord'] },
  lastPostId: { type: String },
  lastPosts: [{ text: String, createdAt: Date }],
  knownFollowers: [{ id: String, name: String, screenName: String }], // Seguidores conhecidos
  createdAt: { type: Date, default: Date.now },
});

const TrackedProfile = mongoose.model('TrackedProfile', trackedProfileSchema);

module.exports = TrackedProfile;