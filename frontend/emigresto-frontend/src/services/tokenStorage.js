// src/services/tokenStorage.js

const ACCESS_KEY  = 'accessToken'
const REFRESH_KEY = 'refreshToken'

export const tokenStorage = {
  getAccess: ()   => Promise.resolve(localStorage.getItem(ACCESS_KEY)),
  setAccess: tok => {
    localStorage.setItem(ACCESS_KEY, tok)
    return Promise.resolve()
  },
  getRefresh: ()  => Promise.resolve(localStorage.getItem(REFRESH_KEY)),
  setRefresh: tok => {
    localStorage.setItem(REFRESH_KEY, tok)
    return Promise.resolve()
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    return Promise.resolve()
  }
  
}
