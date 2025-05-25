// src/services/apiServices.js
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { tokenStorage } from './tokenStorage'

/** Instance Axios **/
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
})

/** 1) REQUEST – injecte l’access token **/
api.interceptors.request.use(
  async config => {
    const token = await tokenStorage.getAccess()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  err => Promise.reject(err)
)

/** 2) RESPONSE – gère le 401 et rafraîchit le token **/
let isRefreshing = false
let pendingRequests = []

api.interceptors.response.use(
  res => res,
  async err => {
    const { response, config } = err
    if (response?.status === 401 && !config._retry) {
      config._retry = true

      // 2.a) lancement du refresh si pas déjà en cours
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const refresh = await tokenStorage.getRefresh()
          const { data } = await api.post('auth/token/refresh/', { refresh })
          await tokenStorage.setAccess(data.access)
          isRefreshing = false
          pendingRequests.forEach(cb => cb(data.access))
          pendingRequests = []
        } catch {
          await tokenStorage.clear()
          isRefreshing = false
          // ici on pourrait rediriger vers /login
        }
      }

      // 2.b) mise en file d’attente des requêtes arrivant pendant le refresh
      return new Promise(resolve => {
        pendingRequests.push(newAccess => {
          config.headers.Authorization = `Bearer ${newAccess}`
          resolve(api(config))
        })
      })
    }

    return Promise.reject(err)
  }
)

/** 3) Gestion centralisée des erreurs **/
const handleError = err => {
  if (err.response) {
    console.error('API Error:', err.response.status, err.response.data)
    throw err.response.data
  }
  console.error('Network Error:', err.message)
  throw { detail: 'Network Error' }
}

/** 4) BaseService – CRUD générique **/
class BaseService {
  constructor(path) {
    this.path = path.replace(/\/?$/, '/')
  }
  list   = params => api.get(this.path, { params }).then(r => r.data).catch(handleError)
  get    = id     => api.get(`${this.path}${id}/`).then(r => r.data).catch(handleError)
  create = data   => api.post(this.path, data).then(r => r.data).catch(handleError)
  update = (id, data) =>
    api.patch(`${this.path}${id}/`, data).then(r => r.data).catch(handleError)
  delete = id     => api.delete(`${this.path}${id}/`).then(r => r.data).catch(handleError)
}

/** 5) AuthService **/
class AuthService {
  me = () =>
    api.get('auth/me/').then(r => r.data).catch(handleError)

  login = async creds => {
    // 5.a) Slash final pour coller à Django
    const { data } = await api.post('auth/token/', creds).catch(handleError)
    await tokenStorage.setAccess(data.access)
    await tokenStorage.setRefresh(data.refresh)
    return data
  }

  refresh = async () => {
    const refresh = await tokenStorage.getRefresh()
    const { data } = await api.post('auth/token/refresh/', { refresh }).catch(handleError)
    await tokenStorage.setAccess(data.access)
    return data.access
  }

  register = data =>
    api.post('auth/register/', data).then(r => r.data).catch(handleError)

  logout = async () => {
    const refresh = await tokenStorage.getRefresh()
    await api.post('auth/logout/', { refresh }).catch(handleError)
    await tokenStorage.clear()
  }
}

/** 6) Services spécifiques **/
export const API = {
  auth:         new AuthService(),
  etudiant:     new BaseService('etudiants'),
  jour:         new BaseService('jours'),
  reservation:  new BaseService('reservations'),
  ticket:       new BaseService('tickets'),
  paiement:     new BaseService('paiements'),
  transaction:  new BaseService('transactions'),
  recu:         new BaseService('recus'),
  notification: new BaseService('notifications'),
  personnel:    new BaseService('personnels'),
  utilisateur:  new BaseService('utilisateurs'),
}
