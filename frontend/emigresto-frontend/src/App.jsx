// src/App.jsx
import { toast } from 'react-hot-toast'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import LoginPage from './pages/LoginPage'
import ManageReservations from './pages/ManageReservations'
import RegisterPage from './pages/RegisterPage'
import SellTicket from './pages/SellTicket'

// Composant pour routes privées
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null  // déjà géré par AuthProvider, mais on double-sécurise
  if (!user) {
    toast.info('Veuillez vous connecter')
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

// Composant pour routes publiques (login/register)
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) {
    toast.success('Vous êtes déjà connecté')
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* routes publiques */}
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* routes privées */}
          <Route path="/"           element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/sell"       element={<PrivateRoute><SellTicket /></PrivateRoute>} />
          <Route path="/history"    element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/reservations" element={<PrivateRoute><ManageReservations /></PrivateRoute>} />

          {/* catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
