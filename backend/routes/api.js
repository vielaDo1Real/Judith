// Path: backend/routes/api.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/data', auth, (req, res) => {
  res.json({ message: 'API data', user: req.user });
});

router.get('/stats', auth, async (req, res) => {
  // Exemplo fictício - integrar com API do Twitter/Discord futuramente
  res.json({ posts: 42, followers: 100, user: req.user });
});

module.exports = router;