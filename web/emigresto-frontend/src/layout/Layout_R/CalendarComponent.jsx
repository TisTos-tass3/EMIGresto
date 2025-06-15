import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { API } from '../../services/apiService'

export default function CalendarComponent() {
  const [reservations, setReservations] = useState([])
  const [periods, setPeriods] = useState({})
  const [date, setDate] = useState(new Date())
  const [error, setError] = useState(null)

  useEffect(() => {
    API.reservation.list()
      .then(res => setReservations(res.results))
      .catch(() => setError("Impossible de charger les réservations."))
    API.periode.list()
      .then(res => {
        const m = {}
        res.results.forEach(p => m[p.id] = p.nomPeriode)
        setPeriods(m)
      })
      .catch(console.error)
  }, [])

  const daily = reservations.filter(r =>
    new Date(r.date).toDateString() === date.toDateString()
  )
  const byPeriod = daily.reduce((acc,r) => {
    acc[r.periode] = (acc[r.periode]||[]).concat(r)
    return acc
  }, {})

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Calendrier des Réservations</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}

      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({date:dt}) =>
          reservations.some(r=>new Date(r.date).toDateString()===dt.toDateString())
            ? 'bg-green-200 hover:bg-green-300'
            : ''
        }
        tileContent={({date:dt}) =>
          reservations.some(r=>new Date(r.date).toDateString()===dt.toDateString())
            ? <span className="text-green-700">📅</span>
            : null
        }
      />

      <div className="mt-6">
        <h3 className="font-semibold mb-2">
          Réservations du {date.toLocaleDateString()}
        </h3>
        {Object.keys(byPeriod).length>0
          ? Object.entries(byPeriod).map(([pid,list])=>(
              <div key={pid} className="mb-4">
                <h4 className="font-medium">Période : {periods[pid]}</h4>
                <p>Total : {list.length}</p>
              </div>
            ))
          : <p>Aucune réservation pour cette date.</p>
        }
      </div>
    </div>
  )
}
