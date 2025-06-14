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
=======
// src/App.jsx
import { toast } from 'react-hot-toast'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './layout/Header'
import { menuItems, userOptions } from './layout/Layout_R/SidebarData_R'
import Sidebar from './layout/Sidebar'
import Dashboard from './pages/Guichet/DashboardGuichet'
import Reservation from './pages/Guichet/Reservation'
import StudentList from './pages/Guichet/StudentList'
>>>>>>> origin/master
import History from './pages/History'
import LoginPage from './pages/LoginPage'
import ManageReservations from './pages/ManageReservations'
import RegisterPage from './pages/RegisterPage'
import SellTicket from './pages/SellTicket'

<<<<<<< HEAD
// Layout commun pour les pages privées
function PrivateLayout({ children, title, role }) {
  return (
    <div className="h-screen flex">
      <Sidebar menuItems={menuItems} userOptions={userOptions} />
      <div className="flex-1 flex flex-col">
        <Header h_title={title} h_user="Utilisateur" h_role={role} />
=======
// Wrapper pour les routes privées avec layout
function PrivateLayout({ children, title, role }) {
  return (
    <div className="h-screen flex w-full overflow-hidden">
      <Sidebar menuItems={menuItems} userOptions={userOptions} />
      <div className="flex-1 flex flex-col h-screen">
        <Header h_title={title} h_role={role} h_user="Utilisateur" />
>>>>>>> origin/master
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )
}

<<<<<<< HEAD
// Route protégée
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
=======
// Composant pour routes privées
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

>>>>>>> origin/master
  if (loading) return null
  if (!user) {
    toast.info('Veuillez vous connecter')
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

<<<<<<< HEAD
// Route publique
=======
// Composant pour routes publiques
>>>>>>> origin/master
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
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* routes privées */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PrivateLayout title="Tableau de bord" role="Administrateur">
                  <Dashboard />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <PrivateRoute>
                <PrivateLayout title="Réservations" role="Vendeur">
                  <Reservation />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/etudiants"
            element={
              <PrivateRoute>
                <PrivateLayout title="Liste des étudiants" role="Administrateur">
                  <StudentList />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <PrivateRoute>
                <PrivateLayout title="Vendre un ticket" role="Vendeur">
                  <SellTicket />
                </PrivateLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <PrivateLayout title="Historique" role="Vendeur">
                  <History />
                </PrivateLayout>
              </PrivateRoute>
            }
          />

          {/* catch-all */}
>>>>>>> origin/master
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
