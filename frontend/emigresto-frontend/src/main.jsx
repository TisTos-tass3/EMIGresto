<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

<<<<<<< HEAD:web/emigresto-frontend/src/main.jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
=======
=======
// src/main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

>>>>>>> parent of 58a43359 (Changement au front-end avec nouvelles fonctions)
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
>>>>>>> parent of 58a43359 (Changement au front-end avec nouvelles fonctions):frontend/emigresto-frontend/src/main.jsx
