// Path: backend/middlewares/sessions.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/judith',
    ttl: 14 * 24 * 60 * 60, // 14 dias
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production' || true, // Força secure em HTTPS
    httpOnly: true, // Impede acesso ao cookie via JavaScript
    sameSite: 'lax', // Protege contra CSRF
  },
});