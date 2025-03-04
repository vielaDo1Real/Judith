// Path: frontend/src/components/FollowersList.js
import React from 'react';

const FollowersList = ({ followers, isLoading, error }) => {
  if (isLoading) return <div>Carregando seguidores...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro ao carregar seguidores: {error.message}</div>;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Seus Seguidores</h2>
      {followers?.users?.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {followers.users.map(follower => (
            <li key={follower.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              {follower.name} (@{follower.screen_name}) - ID: {follower.id}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum seguidor encontrado.</p>
      )}
    </div>
  );
};

export default FollowersList;