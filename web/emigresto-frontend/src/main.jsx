// src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


const queryClient = new QueryClient({
  defaultOptions: {
    // On fournit explicitement un objet mutations / queries
    mutations: {
      // ici, tu peux mettre tes options globales (retry, onError, etc.)
    },
    queries: {
      // idem pour les requêtes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
