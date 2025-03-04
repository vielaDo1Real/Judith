// Path: backend/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

const BASE_URL = process.env.NGROK_URL || 'https://localhost:5000'; // Fallback para localhost

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Path: backend/config/passport.js (trecho relevante)
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://judith-app.ngrok-free.app/auth/google/callback',
  scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Google Auth Response:', { accessToken, profile }); // Debug
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      user = await User.create({
        googleId: profile.id,
        displayName: profile.displayName,
        email: email,
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

  // Estratégia do Twitter
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${BASE_URL}/auth/twitter/callback`,
    userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
  }, async (token, tokenSecret, profile, done) => {
    console.log('Twitter Auth Response:', { token, tokenSecret, profile });
    try {
      let user = await User.findOne({ twitterId: profile.id });
      if (!user) {
        user = await User.create({
          twitterId: profile.id,
          displayName: profile.displayName,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
          token: token,
          tokenSecret: tokenSecret,
        });
      } else {
        user.token = token;
        user.tokenSecret = tokenSecret;
        await user.save();
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));

  // Estratégia do Discord
  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/discord/callback`,
    scope: ['identify', 'email', 'guilds'],
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ discordId: profile.id });
      if (!user) {
        const email = profile.email ? profile.email : null;
        user = await User.create({
          discordId: profile.id,
          displayName: profile.username,
          email: email,
        });
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
};