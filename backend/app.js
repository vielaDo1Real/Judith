// Path: backend/app.js
const https = require('https'); // Adiciona o módulo https
const fs = require('fs'); // Para ler os arquivos de certificado
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Conexão com o MongoDB
require('./config/db')();

// Middlewares
app.use(cors({
  origin: 'https://localhost:3000',
  credentials: true,
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Permitir inline styles (usado no frontend)
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

server.listen(PORT, () => console.log(`Servidor HTTPS rodando na porta ${PORT}`));