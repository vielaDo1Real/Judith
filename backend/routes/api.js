// Path: backend/routes/api.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Notification = require('../models/Notification');
const TrackedProfile = require('../models/TrackedProfile');
const twitterService = require('../services/twitterService');



router.get('/data', auth, (req, res) => {
  res.json({ message: 'API data', user: req.user });
});

router.get('/stats', auth, async (req, res) => {
  // Exemplo fictício - integrar com API do Twitter/Discord futuramente
  res.json({ posts: 42, followers: 100, user: req.user });
});

// Endpoint para buscar seguidores
router.get('/followers', auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user.twitterId || !user.token || !user.tokenSecret) {
      return res.status(400).json({ message: 'Usuário não autenticado via Twitter' });
    }

    const followers = await twitterService.getFollowers(user.twitterId, user.token, user.tokenSecret);
    res.json({ followers });
  } catch (err) {
    console.error('Erro ao buscar seguidores:', err);
    res.status(500).json({ message: 'Erro ao buscar seguidores' });
  }
});

// Endpoint para buscar posts
router.get('/posts/:userId?', auth, async (req, res) => {
  try {
    const user = req.user;
    const targetUserId = req.params.userId || user.twitterId;

    if (!user.token || !user.tokenSecret) {
      return res.status(400).json({ message: 'Usuário não autenticado via Twitter' });
    }

    const posts = await twitterService.getPosts(targetUserId, user.token, user.tokenSecret);
    res.json({ posts });
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
    res.status(500).json({ message: 'Erro ao buscar posts' });
  }
});

// Endpoint para marcar (set) um perfil para rastreamento
router.post('/track-profile', auth, async (req, res) => {
  try {
    const user = req.user;
    const { profileId, platform } = req.body;

    if (!profileId || !platform) {
      return res.status(400).json({ message: 'profileId e platform são obrigatórios' });
    }

    // Verificar se o perfil já está sendo rastreado
    let trackedProfile = await TrackedProfile.findOne({ userId: user._id, profileId, platform });
    if (trackedProfile) {
      return res.status(400).json({ message: 'Perfil já está sendo rastreado' });
    }

    // Buscar os últimos posts do perfil
    const posts = await twitterRequest(
      `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${profileId}&count=5`,
      user.token,
      user.tokenSecret
    );

    // Criar novo perfil rastreado
    trackedProfile = new TrackedProfile({
      userId: user._id,
      profileId,
      platform,
      lastPostId: posts[0]?.id_str || null,
      lastPosts: posts.map(post => ({
        text: post.text,
        createdAt: new Date(post.created_at),
      })),
    });

    await trackedProfile.save();
    res.json({ message: 'Perfil marcado para rastreamento', trackedProfile });
  } catch (err) {
    console.error('Erro ao marcar perfil:', err);
    res.status(500).json({ message: 'Erro ao marcar perfil' });
  }
});

// Endpoint para listar perfis rastreados
router.get('/tracked-profiles', auth, async (req, res) => {
  try {
    const user = req.user;
    const trackedProfiles = await TrackedProfile.find({ userId: user._id });
    res.json({ trackedProfiles });
  } catch (err) {
    console.error('Erro ao listar perfis rastreados:', err);
    res.status(500).json({ message: 'Erro ao listar perfis rastreados' });
  }
});


// Endpoint para verificar novos posts e emitir alertas
router.get('/check-new-posts', auth, async (req, res) => {
  try {
    const user = req.user;
    const trackedProfiles = await TrackedProfile.find({ userId: user._id });

    const notifications = [];

    for (const profile of trackedProfiles) {
      const posts = await twitterRequest(
        `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${profile.profileId}&count=1`,
        user.token,
        user.tokenSecret
      );

      const latestPost = posts[0];
      if (!latestPost) continue;

      if (profile.lastPostId && latestPost.id_str !== profile.lastPostId) {
        // Novo post encontrado
        const notification = new Notification({
          userId: user._id,
          message: `Novo post de ${profile.profileId}: ${latestPost.text}`,
        });
        await notification.save();
        notifications.push(notification);

        // Atualizar o último post conhecido
        profile.lastPostId = latestPost.id_str;
        profile.lastPosts = [
          { text: latestPost.text, createdAt: new Date(latestPost.created_at) },
          ...profile.lastPosts.slice(0, 4), // Manter apenas os últimos 5 posts
        ];
        await profile.save();
      }
    }

    res.json({ notifications });
  } catch (err) {
    console.error('Erro ao verificar novos posts:', err);
    res.status(500).json({ message: 'Erro ao verificar novos posts' });
  }
});

// Endpoint para listar notificações
router.get('/notifications', auth, async (req, res) => {
  try {
    const user = req.user;
    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (err) {
    console.error('Erro ao listar notificações:', err);
    res.status(500).json({ message: 'Erro ao listar notificações' });
  }
});

// Path: backend/routes/api.js (modificar o endpoint /track-profile)
router.post('/track-profile', auth, async (req, res) => {
  try {
    const user = req.user;
    const { profileId, platform } = req.body;

    if (!profileId || !platform) {
      return res.status(400).json({ message: 'profileId e platform são obrigatórios' });
    }

    let trackedProfile = await TrackedProfile.findOne({ userId: user._id, profileId, platform });
    if (trackedProfile) {
      return res.status(400).json({ message: 'Perfil já está sendo rastreado' });
    }

    // Buscar os últimos posts do perfil
    const posts = await twitterRequest(
      `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${profileId}&count=5`,
      user.token,
      user.tokenSecret
    );

    // Buscar os seguidores atuais do perfil
    const followers = await twitterRequest(
      `https://api.twitter.com/1.1/followers/list.json?user_id=${profileId}&count=20`,
      user.token,
      user.tokenSecret
    );

    trackedProfile = new TrackedProfile({
      userId: user._id,
      profileId,
      platform,
      lastPostId: posts[0]?.id_str || null,
      lastPosts: posts.map(post => ({
        text: post.text,
        createdAt: new Date(post.created_at),
      })),
      knownFollowers: followers.users.map(follower => ({
        id: follower.id_str,
        name: follower.name,
        screenName: follower.screen_name,
      })),
    });

    await trackedProfile.save();
    res.json({ message: 'Perfil marcado para rastreamento', trackedProfile });
  } catch (err) {
    console.error('Erro ao marcar perfil:', err);
    res.status(500).json({ message: 'Erro ao marcar perfil' });
  }
});

// Path: backend/routes/api.js (adicionar ao final)
// Endpoint para verificar novos seguidores dos perfis rastreados
router.get('/check-new-followers', auth, async (req, res) => {
  try {
    const user = req.user;
    const trackedProfiles = await TrackedProfile.find({ userId: user._id });

    const notifications = [];

    for (const profile of trackedProfiles) {
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

      // Comparar com os seguidores conhecidos
      const newFollowers = currentFollowers.filter(
        follower => !profile.knownFollowers.some(known => known.id === follower.id)
      );

      if (newFollowers.length > 0) {
        // Criar notificações para novos seguidores
        for (const follower of newFollowers) {
          const notification = new Notification({
            userId: user._id,
            message: `O perfil ${profile.profileId} começou a seguir ${follower.name} (@${follower.screenName})`,
          });
          await notification.save();
          notifications.push(notification);
        }

        // Atualizar os seguidores conhecidos
        profile.knownFollowers = currentFollowers;
        await profile.save();
      }
    }

    res.json({ notifications });
  } catch (err) {
    console.error('Erro ao verificar novos seguidores:', err);
    res.status(500).json({ message: 'Erro ao verificar novos seguidores' });
  }
});

// Path: backend/routes/api.js (adicionar ao final)
// Endpoint para desmarcar um perfil
router.delete('/untrack-profile/:profileId', auth, async (req, res) => {
  try {
    const user = req.user;
    const profileId = req.params.profileId;

    const result = await TrackedProfile.deleteOne({ userId: user._id, _id: profileId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Perfil não encontrado' });
    }

    res.json({ message: 'Perfil desmarcado com sucesso' });
  } catch (err) {
    console.error('Erro ao desmarcar perfil:', err);
    res.status(500).json({ message: 'Erro ao desmarcar perfil' });
  }
});

// Endpoint para marcar uma notificação como lida
router.put('/notification/read/:notificationId', auth, async (req, res) => {
  try {
    const user = req.user;
    const notificationId = req.params.notificationId;

    const notification = await Notification.findOne({ _id: notificationId, userId: user._id });
    if (!notification) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    notification.read = true;
    await notification.save();

    res.json({ message: 'Notificação marcada como lida' });
  } catch (err) {
    console.error('Erro ao marcar notificação como lida:', err);
    res.status(500).json({ message: 'Erro ao marcar notificação como lida' });
  }
});

// Endpoint para limpar todas as notificações
router.delete('/notifications/clear', auth, async (req, res) => {
  try {
    const user = req.user;
    await Notification.deleteMany({ userId: user._id });
    res.json({ message: 'Notificações limpas com sucesso' });
  } catch (err) {
    console.error('Erro ao limpar notificações:', err);
    res.status(500).json({ message: 'Erro ao limpar notificações' });
  }
});

module.exports = router;

