// Path: frontend/src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Faz uma requisição ao backend para obter informações do usuário autenticado
    axios.get('https://dodo-sterling-globally.ngrok-free.app/api/data', { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(err => {
        console.error('Erro ao buscar usuário:', err);
      });
  }, []);

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <p>Bem-vindo, {user.displayName}!</p>
      ) : (
        <p>Você não está autenticado. Faça login!</p>
      )}
      <p>TESTE</p>
    </div>
  );
};

export default Home;