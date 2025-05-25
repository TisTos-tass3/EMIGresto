// src/App.jsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import LoginPage from './pages/LoginPage'
import ManageReservations from './pages/ManageReservations'
import RegisterPage from './pages/RegisterPage'
import SellTicket from './pages/SellTicket'

/*
 * Composant qui protège l'accès aux routes privées.
 * Tant que l'AuthContext n'a pas fini de charger (ready=false), 
 * on affiche un loader global.
 */
function PrivateRoute({ children }) {
  const { user, ready } = useAuth()

  // Si on est encore en train de vérifier le token (call /me/)
  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement…</p>
      </div>
    )
  } 

  // Si pas d'utilisateur connecté, redirection vers /login
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes privées */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <PrivateRoute>
                <SellTicket />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <ManageReservations />
              </PrivateRoute>
            }
          />

          {/* Catch-all : redirige vers le dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

