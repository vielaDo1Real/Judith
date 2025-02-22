import React from 'react';

const Login = () => {
  return (
    <div>
      <h1>Login</h1>
      <a href="http://localhost:5000/auth/google">Login with Google</a>
      <a href="http://localhost:5000/auth/twitter">Login with Twitter</a>
      <a href="http://localhost:5000/auth/discord">Login with Discord</a>
    </div>
  );
};

export default Login;