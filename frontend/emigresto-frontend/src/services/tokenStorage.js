// src/services/tokenStorage.js
const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const EXPIRY_KEY = 'tokenExpiry'

// Helpers sécurisés
const safeGet = (key) => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

export const tokenStorage = {
  getAccess: async () => {
    const token = safeGet(ACCESS_KEY)
    const expiry = safeGet(EXPIRY_KEY)

    // Vérification de l'expiration
    if (token && expiry && Date.now() > parseInt(expiry, 10)) {
      safeRemove(ACCESS_KEY)
      safeRemove(EXPIRY_KEY)
      return null
    }

    return token
  },

  setAccess: async (token) => {
    const expiry = Date.now() + 15 * 60 * 1000 // 15 minutes
    safeSet(ACCESS_KEY, token)
    safeSet(EXPIRY_KEY, expiry.toString())
  },

  getRefresh: async () => safeGet(REFRESH_KEY),

  setRefresh: async (token) => safeSet(REFRESH_KEY, token),

  clear: async () => {
    safeRemove(ACCESS_KEY)
    safeRemove(REFRESH_KEY)
    safeRemove(EXPIRY_KEY)
  },

  // Fix: Correction de la référence this
  isTokenValid: async () => {
    const token = await tokenStorage.getAccess() // ← Utilise tokenStorage au lieu de this
    return !!token
  },
}