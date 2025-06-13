import React, { useEffect, useState } from 'react'
import { API } from '../../services/apiServices'

const HistoryComponent = () => {
  const [hist, setHist]       = useState([])
  const [periods, setPeriods] = useState({})
  const [error, setError]     = useState(null)

  useEffect(() => {
    API.reservation.list()
      .then(res => setHist(res.results))
      .catch(() => setError('Impossible de charger l’historique.'))

    API.periode.list()
      .then(res => {
        const m = {}
        res.results.forEach(p=>m[p.id]=p.nomPeriode)
        setPeriods(m)
      })
      .catch(()=>{/* silent */})
  }, [])

  const byPeriod = hist.reduce((acc,r)=>{
    acc[r.periode] = (acc[r.periode]||0)+1
    return acc
  },{})

  return (
    <div className="p-4 bg-white rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Historique</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {Object.entries(byPeriod).length>0 ? (
        Object.entries(byPeriod).map(([pid,count])=>(
          <div key={pid} className="mb-2">
            <strong>{periods[pid] ?? 'Inconnu'}</strong> : {count} réservation(s)
          </div>
        ))
      ) : (
        <p className="text-gray-500">Aucune donnée.</p>
      )}
    </div>
  )
}

export default HistoryComponent
