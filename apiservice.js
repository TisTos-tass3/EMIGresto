// src/services/apiService.js
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

/** Configuration Axios **/
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 10000,
})

/** Interceptor pour JWT **/
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  err => Promise.reject(err)
)

/** Gestion centralisée des erreurs **/
const handleError = err => {
  if (err.response) {
    console.error('API Error:', err.response.status, err.response.data)
    throw err.response.data
  }
  console.error('Network Error:', err.message)
  throw { detail: 'Network Error' }
}

/** Classe de service générique pour CRUD **/
class BaseService {
  constructor(path) { this.path = path }
  list = params => api.get(this.path, { params }).then(r => r.data).catch(handleError)
  get  = id     => api.get(`${this.path}${id}/`).then(r => r.data).catch(handleError)
  create = data => api.post(this.path, data).then(r => r.data).catch(handleError)
  update = (id, data) => api.patch(`${this.path}${id}/`, data).then(r => r.data).catch(handleError)
  delete = id     => api.delete(`${this.path}${id}/`).then(r => r.data).catch(handleError)
}

/** Services spécifiques **/
class AuthService {
  login    = creds => api.post('auth/login/', creds).then(r => r.data).catch(handleError)
  register = data  => api.post('auth/register/', data).then(r => r.data).catch(handleError)
  logout   = ()    => api.post('auth/logout/').then(r => r.data).catch(handleError)
}

class EtudiantService extends BaseService {
  constructor() { super('etudiants/') }
}

class JourService extends BaseService {
  constructor() { super('jours/') }
}

class ReservationService extends BaseService {
  constructor() { super('reservations/') }
}

class TicketService extends BaseService {
  constructor() { super('tickets/') }
}

class PaiementService extends BaseService {
  constructor() { super('paiements/') }
}

class TransactionService extends BaseService {
  constructor() { super('transactions/') }
}

class RecuService extends BaseService {
  constructor() { super('recus/') }
}

class NotificationService extends BaseService {
  constructor() { super('notifications/') }
}

class PersonnelService extends BaseService {
  constructor() { super('personnels/') }
}

class UtilisateurService extends BaseService {
  constructor() { super('utilisateurs/') }
}

/** Export centralisé **/
export const API = {
  auth: new AuthService(),
  etudiant: new EtudiantService(),
  jour: new JourService(),
  reservation: new ReservationService(),
  ticket: new TicketService(),
  paiement: new PaiementService(),
  transaction: new TransactionService(),
  recu: new RecuService(),
  notification: new NotificationService(),
  personnel: new PersonnelService(),
  utilisateur: new UtilisateurService(),
}
