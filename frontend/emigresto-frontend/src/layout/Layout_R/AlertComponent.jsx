import React, { useEffect, useState } from 'react'
import { API } from '../../services/apiServices'

const AlertComponent = () => {
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    API.reservation.list()
      .then(res => {
        // res.results : liste de réservations
        const newAlerts = res.results
          .map(r => {
            // r.etudiant est maintenant un objet grâce au serializer
            const mat = r.etudiant?.matricule || 'Inconnu'
            if (r.statut === 'ANNULE') {
              return `Réservation annulée pour l'étudiant ${mat}.`
            }
            if (r.statut === 'VALIDE') {
              return `Réservation confirmée pour l'étudiant ${mat}.`
            }
            return null
          })
          .filter(a => a)
        setAlerts(newAlerts)
      })
      .catch(() => setError("Impossible de charger les alertes."))
  }, [])

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
  }

  return (
    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-md shadow-md">
      <h2 className="text-xl font-semibold">Alertes</h2>
      <ul className="list-disc pl-5 mt-2">
        {alerts.map((alert, idx) => (
          <li key={idx} className="text-sm text-gray-700">
            {alert}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AlertComponent
