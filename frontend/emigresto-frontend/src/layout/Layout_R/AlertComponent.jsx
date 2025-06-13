import React, { useEffect, useState } from 'react'
import { API } from '../../services/apiServices'

export default function AlertComponent() {
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    API.reservation.list()
      .then(res => {
        const msgs = res.results
          .map(r => {
            const mat = r.etudiant?.matricule || 'Inconnu'
            return r.statut === 'ANNULE'
              ? `Réservation annulée pour ${mat}`
              : r.statut === 'VALIDE'
                ? `Réservation confirmée pour ${mat}`
                : null
          })
          .filter(Boolean)
        setAlerts(msgs)
      })
      .catch(() => setError("Impossible de charger les alertes."))
  }, [])

  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>

  return (
    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow">
      <h2 className="text-xl font-semibold">Alertes</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-700">
        {alerts.map((a,i) => <li key={i}>{a}</li>)}
      </ul>
    </div>
  )
}
