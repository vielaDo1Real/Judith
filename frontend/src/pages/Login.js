// Path: frontend/src/pages/Login.js
import React from 'react';

const NGROK_URL = process.env.REACT_APP_NGROK_URL || 'https://localhost:5000';

const Login = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <a href={`${NGROK_URL}/auth/google`} style={{ padding: '10px', background: '#4285f4', color: 'white', textDecoration: 'none' }}>Login com Google</a>
        <a href={`${NGROK_URL}/auth/twitter`} style={{ padding: '10px', background: '#1da1f2', color: 'white', textDecoration: 'none' }}>Login com Twitter</a>
        <a href={`${NGROK_URL}/auth/discord`} style={{ padding: '10px', background: '#7289da', color: 'white', textDecoration: 'none' }}>Login com Discord</a>
      </div>
    </div>
  );
};

export default Login;