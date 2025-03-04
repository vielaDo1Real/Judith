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
const TrackedProfile = require('./models/TrackedProfiles');
const Notification = require('./models/Notifications');
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

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

// Configuração do Socket.IO
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://localhost:3000'],
    credentials: true,
  },
});

// Configuração OAuth para Twitter API
const oauth = OAuth({
  consumer: {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  },
});

const twitterRequest = async (url, token, tokenSecret) => {
  const requestData = {
    url,
    method: 'GET',
  };
  const tokenData = {
    key: token,
    secret: tokenSecret,
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, tokenData));
  const response = await axios.get(url, { headers });
  return response.data;
};

// Lógica para verificar novos posts e seguidores periodicamente
const checkUpdates = async () => {
  try {
    const users = await User.find({ twitterId: { $ne: null } });
    for (const user of users) {
      const trackedProfiles = await TrackedProfile.find({ userId: user._id });

      // Verificar novos posts
      for (const profile of trackedProfiles) {
        const posts = await twitterRequest(
          `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${profile.profileId}&count=1`,
          user.token,
          user.tokenSecret
        );

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

        // Verificar novos seguidores
        const followers = await twitterRequest(
          `https://api.twitter.com/1.1/followers/list.json?user_id=${profile.profileId}&count=20`,
          user.token,
          user.tokenSecret
        );

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

// Iniciar verificação periódica
setInterval(checkUpdates, 60000); // Verifica a cada 60 segundos

// Gerenciar conexões WebSocket
io.on('connection', (socket) => {
  console.log('Novo cliente conectado:', socket.id);

  // Quando o cliente se conecta, ele envia seu userId
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`Cliente ${socket.id} entrou na sala ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Servidor HTTPS rodando na porta ${PORT}`));