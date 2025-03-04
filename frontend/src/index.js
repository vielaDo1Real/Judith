// Path: frontend/src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Importa createRoot
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

// Cria a raiz de renderização
const root = createRoot(document.getElementById('root'));

// Renderiza a aplicação
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);