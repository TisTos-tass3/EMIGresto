<<<<<<< HEAD
import { toast } from 'react-hot-toast'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from '../../../web/emigresto-frontend/src/layout/Header'
import { menuItems, userOptions } from './layout/Layout_R/SidebarData_R'
import Sidebar from '../../../web/emigresto-frontend/src/layout/Sidebar'
import Dashboard from '../../../web/emigresto-frontend/src/pages/Guichet/DashboardGuichet'
import Reservation from '../../../web/emigresto-frontend/src/pages/Guichet/Reservation'
import StudentList from '../../../web/emigresto-frontend/src/pages/Guichet/StudentList'
import History from './pages/History'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SellTicket from './pages/SellTicket'

// Layout commun pour les pages privées
function PrivateLayout({ children, title, role }) {
  return (
    <div className="h-screen flex">
      <Sidebar menuItems={menuItems} userOptions={userOptions} />
      <div className="flex-1 flex flex-col">
        <Header h_title={title} h_user="Utilisateur" h_role={role} />
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}

// Route protégée
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
=======
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
>>>>>>> parent of 58a43359 (Changement au front-end avec nouvelles fonctions)
  if (!user) {
    toast.info('Veuillez vous connecter')
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

<<<<<<< HEAD
// Route publique
=======
// Composant pour routes publiques (login/register)
>>>>>>> parent of 58a43359 (Changement au front-end avec nouvelles fonctions)
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
<<<<<<< HEAD
          {/* Public */}
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Privé */}
          <Route path="/" element={
            <PrivateRoute>
              <PrivateLayout title="Tableau de bord" role="Guichet">
                <Dashboard />
              </PrivateLayout>
            </PrivateRoute>
          }/>
          <Route path="/reservations" element={
            <PrivateRoute>
              <PrivateLayout title="Réservations" role="Guichet">
                <Reservation />
              </PrivateLayout>
            </PrivateRoute>
          }/>
          <Route path="/profile_R" element={
            <PrivateRoute>
              <PrivateLayout title="profile" role="Guichet">
                <Reservation />
              </PrivateLayout>
            </PrivateRoute>
          }/>
          <Route path="/etudiants" element={
            <PrivateRoute>
              <PrivateLayout title="Liste des étudiants" role="Guichet">
                <StudentList />
              </PrivateLayout>
            </PrivateRoute>
          }/>
          <Route path="/sell" element={
            <PrivateRoute>
              <PrivateLayout title="Vendre un ticket" role="Vendeur">
                <SellTicket />
              </PrivateLayout>
            </PrivateRoute>
          }/>
          <Route path="/history" element={
            <PrivateRoute>
              <PrivateLayout title="Historique" role="Vendeur">
                <History />
              </PrivateLayout>
            </PrivateRoute>
          }/>

          {/* Catch-all */}
=======
          {/* routes publiques */}
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* routes privées */}
          <Route path="/"           element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/sell"       element={<PrivateRoute><SellTicket /></PrivateRoute>} />
          <Route path="/history"    element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/reservations" element={<PrivateRoute><ManageReservations /></PrivateRoute>} />

          {/* catch-all */}
>>>>>>> parent of 58a43359 (Changement au front-end avec nouvelles fonctions)
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
