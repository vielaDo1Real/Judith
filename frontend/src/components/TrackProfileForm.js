// Path: frontend/src/components/TrackProfileForm.js
import React, { useState } from 'react';

const TrackProfileForm = ({ onTrackProfile }) => {
  const [profileId, setProfileId] = useState('');

  const handleSubmit = () => {
    if (profileId) {
      onTrackProfile({ profileId, platform: 'twitter' });
      setProfileId('');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Rastrear um Perfil</h2>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Digite o ID do perfil (Twitter)"
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={handleSubmit} style={{ padding: '8px 16px', background: '#1da1f2', color: 'white', border: 'none', borderRadius: '4px' }}>
          Marcar Perfil
        </button>
      </div>
    </div>
  );
};

export default TrackProfileForm;