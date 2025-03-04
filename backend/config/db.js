// Path: backend/config/db.js
const mongoose = require('mongoose');

const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.log('Erro na conexão com MongoDB:', err);
    setTimeout(connectWithRetry, 5000); // Tenta novamente após 5 segundos
  });
};

module.exports = connectWithRetry;