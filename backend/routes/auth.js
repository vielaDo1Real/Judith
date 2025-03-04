// Path: backend/routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/twitter', passport.authenticate('twitter'));

router.post('/twitter/pin', (req, res, next) => {
  const pin = req.body.pin;
  passport.authenticate('twitter', { verifier: pin })(req, res, next);
}, (req, res) => {
  if (req.user) {
    res.json({ message: 'Autenticação concluída com sucesso', user: req.user });
  } else {
    res.status(401).json({ message: 'Falha na autenticação' });
  }
});

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);


router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', 
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;