// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { API } from '../services/apiServices'

// 1) on crée le contexte **en haut** du fichier, une seule fois
export const AuthContext = createContext({
  user: null,
  ready: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
})

// 2) hook de consommation (ne change jamais de signature)
export function useAuth() {
  return useContext(AuthContext)
}

// 3) provider
export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [ready, setReady] = useState(false)

  // Au montage, on appelle /me/. L’intercepteur gère le rafraîchissement si nécessaire.
  useEffect(() => {
    API.auth
      .me()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  // Fonctions d’authent
  const login = async (email, password) => {
    // 1) on récupère access+refresh
    await API.auth.login({ email, password })
    // 2) on rafraîchit le user
    const u = await API.auth.me()
    setUser(u)
  }

  const register = async data => {
    await API.auth.register(data)
    // si tu veux auto-login : await login(data.email, data.password)
  }

  const logout = async () => {
    await API.auth.logout()
    setUser(null)
  }

  // tant que ready===false, on bloque l’UI
  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Chargement de la session…</p>
      </div>
    )
  }

  // on fournit toujours les mêmes clés pour être HMR-safe
  const value = { user, ready, login, register, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
