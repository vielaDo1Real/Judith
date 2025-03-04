// Path: backend/services/twitterService.js
const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

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

exports.getFollowers = async (userId, token, tokenSecret) => {
  return twitterRequest(
    `https://api.twitter.com/1.1/followers/list.json?user_id=${userId}&count=20`,
    token,
    tokenSecret
  );
};

exports.getPosts = async (userId, token, tokenSecret, count = 10) => {
  return twitterRequest(
    `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${userId}&count=${count}`,
    token,
    tokenSecret
  );
};