// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { API } from '../services/apiServices'
import { tokenStorage } from '../services/tokenStorage'

// 1) Création du contexte
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
})
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 2) checkAuth une seule fois au mount
  useEffect(() => {
    async function checkAuth() {
      const tok = await tokenStorage.getAccess()
      if (!tok) {
        setLoading(false)  // pas de token => on passe à ready
        return
      }
      try {
        const u = await API.auth.me()
        setUser(u)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  // 3) login
  const login = async (email, password) => {
    const data = await API.auth.login({ email, password })
    const u = await API.auth.me()
    setUser(u)
    toast.success('Connexion réussie')
    return data
  }

  // 4) register
  const register = async (payload) => {
    const res = await API.auth.register(payload)
    toast.success('Inscription réussie')
    return res
  }

  // 5) logout
  const logout = async () => {
    await API.auth.logout()
    setUser(null)
    toast.success('Déconnexion réussie')
  }

  // 6) pendant le chargement initial, on bloque tout
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Chargement de la session…</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
