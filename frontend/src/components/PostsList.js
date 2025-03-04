// Path: frontend/src/components/PostsList.js
import React from 'react';

const PostsList = ({ posts, isLoading, error }) => {
  if (isLoading) return <div>Carregando posts...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro ao carregar posts: {error.message}</div>;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Seus Últimos Posts</h2>
      {posts?.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map(post => (
            <li key={post.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <p>{post.text}</p>
              <small>Postado em: {new Date(post.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum post encontrado.</p>
      )}
    </div>
  );
};

export default PostsList;