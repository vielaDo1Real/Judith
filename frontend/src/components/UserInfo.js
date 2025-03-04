// Path: frontend/src/components/UserInfo.js
import React from 'react';

const UserInfo = ({ user }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Informações do Usuário</h2>
      {user ? (
        <p>Bem-vindo, <strong>{user.displayName}</strong>!</p>
      ) : (
        <p>Você não está autenticado. Faça login!</p>
      )}
    </div>
  );
};

export default UserInfo;