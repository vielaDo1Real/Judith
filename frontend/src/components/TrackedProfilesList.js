// Path: frontend/src/components/TrackedProfilesList.js
import React from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';

const TrackedProfilesList = ({ trackedProfiles, isLoading, error }) => {
  const queryClient = useQueryClient();

  const untrackProfileMutation = useMutation(
    (profileId) => axios.delete(`https://dodo-sterling-globally.ngrok-free.app/api/untrack-profile/${profileId}`, { withCredentials: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trackedProfiles');
      },
    }
  );

  const handleUntrackProfile = (profileId) => {
    untrackProfileMutation.mutate(profileId);
  };

  if (isLoading) return <div>Carregando perfis rastreados...</div>;
  if (error) return <div style={{ color: 'red' }}>Erro ao carregar perfis rastreados: {error.message}</div>;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Perfis Rastreados</h2>
      {trackedProfiles?.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {trackedProfiles.map(profile => (
            <li key={profile._id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Perfil ID: {profile.profileId} ({profile.platform})</p>
                <button
                  onClick={() => handleUntrackProfile(profile._id)}
                  style={{ padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Desmarcar
                </button>
              </div>
              <h4>Últimos Posts:</h4>
              {profile.lastPosts?.length > 0 ? (
                <ul style={{ listStyle: 'none', paddingLeft: '20px' }}>
                  {profile.lastPosts.map((post, index) => (
                    <li key={index}>
                      <p>{post.text}</p>
                      <small>Postado em: {new Date(post.createdAt).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum post recente.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum perfil rastreado.</p>
      )}
    </div>
  );
};

export default TrackedProfilesList;