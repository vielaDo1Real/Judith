// Path: frontend/src/pages/Dashboard.js
import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const Dashboard = () => {
  const { data, error, isLoading } = useQuery('data', () =>
    axios.get('/api/data', { withCredentials: true }).then(res => res.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{data.message}</p>
      {data.user && <p>Bem-vindo, {data.user.displayName}</p>}
    </div>
  );
};

export default Dashboard;