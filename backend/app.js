// Path: backend/app.js
const https = require('https');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const socketIo = require('socket.io'); // Importa socket.io
const User = require('./models/User');
const TrackedProfile = require('./models/TrackedProfile');
const Notification = require('./models/Notification');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const twitterService = require('./services/twitterService');

dotenv.config();

const app = express();

// Conexão com o MongoDB
require('./config/db')();

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true,
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./middlewares/logger'));
app.use(require('./middlewares/sessions'));

// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.get('/', (req, res) => {
  res.send('Bem-vindo à aplicação!');
});
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno no servidor' });
});

// Configuração do servidor HTTPS
const PORT = process.env.PORT || 5000;
const server = https.createServer(
  {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  },
  app
);

const checkUpdates = async () => {
  try {
    const users = await User.find({ twitterId: { $ne: null } });
    for (const user of users) {
      const trackedProfiles = await TrackedProfile.find({ userId: user._id });

      for (const profile of trackedProfiles) {
        const posts = await twitterService.getPosts(profile.profileId, user.token, user.tokenSecret, 1);
        const latestPost = posts[0];
        if (!latestPost) continue;

        if (profile.lastPostId && latestPost.id_str !== profile.lastPostId) {
          const notification = new Notification({
            userId: user._id,
            message: `Novo post de ${profile.profileId}: ${latestPost.text}`,
          });
          await notification.save();
          io.to(user._id.toString()).emit('notification', notification);

          profile.lastPostId = latestPost.id_str;
          profile.lastPosts = [
            { text: latestPost.text, createdAt: new Date(latestPost.created_at) },
            ...profile.lastPosts.slice(0, 4),
          ];
          await profile.save();
        }

        const followers = await twitterService.getFollowers(profile.profileId, user.token, user.tokenSecret);
        const currentFollowers = followers.users.map(follower => ({
          id: follower.id_str,
          name: follower.name,
          screenName: follower.screen_name,
        }));

        const newFollowers = currentFollowers.filter(
          follower => !profile.knownFollowers.some(known => known.id === follower.id)
        );

        if (newFollowers.length > 0) {
          for (const follower of newFollowers) {
            const notification = new Notification({
              userId: user._id,
              message: `O perfil ${profile.profileId} começou a seguir ${follower.name} (@${follower.screenName})`,
            });
            await notification.save();
            io.to(user._id.toString()).emit('notification', notification);
          }

          profile.knownFollowers = currentFollowers;
          await profile.save();
        }
      }
    }
  } catch (err) {
    console.error('Erro ao verificar atualizações:', err);
  }
};

server.listen(PORT, () => console.log(`Servidor HTTPS rodando na porta ${PORT}`));