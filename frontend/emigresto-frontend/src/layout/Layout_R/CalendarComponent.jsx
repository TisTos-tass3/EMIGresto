import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { API } from '../../services/apiServices'

const CalendarComponent = () => {
  const [reservations, setReservations] = useState([])
  const [periods, setPeriods] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [error, setError] = useState(null)

  useEffect(() => {
    API.reservation.list()
      .then(res => {
        setReservations(res.results)
        setError(null)
      })
      .catch(() => setError("Impossible de charger les réservations."))

    API.periode.list()
      .then(res => {
        const map = {}
        res.results.forEach(p => { map[p.id] = p.nomPeriode })
        setPeriods(map)
      })
      .catch(err => console.error("Erreur périodes :", err))
  }, [])

  const handleDateChange = date => setSelectedDate(date)

  const daily = reservations.filter(r =>
    new Date(r.date).toDateString() === selectedDate.toDateString()
  )

  const byPeriod = daily.reduce((acc, r) => {
    const pid = r.periode // ou r.periode_id selon le champ renvoyé
    if (!acc[pid]) acc[pid] = []
    acc[pid].push(r)
    return acc
  }, {})

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">
        Calendrier des Réservations
      </h2>
      {error && (
        <div className="text-red-500 my-4 p-2 border border-red-500 rounded">
          {error}
        </div>
      )}
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={({ date }) =>
          reservations.some(r => new Date(r.date).toDateString() === date.toDateString())
            ? 'bg-green-200 hover:bg-green-300'
            : ''
        }
        tileContent={({ date }) =>
          reservations.some(r => new Date(r.date).toDateString() === date.toDateString()) ? (
            <span className="text-sm text-green-700">📅</span>
          ) : null
        }
      />
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Réservations du {selectedDate.toLocaleDateString()}
        </h3>
        {Object.keys(byPeriod).length > 0 ? (
          Object.entries(byPeriod).map(([pid, items]) => (
            <div key={pid} className="mb-4">
              <h4 className="text-md font-semibold text-gray-800">
                Période : {periods[pid] || 'Inconnue'}
              </h4>
              <p className="text-gray-600">Total : {items.length}</p>
            </div>
          ))
        ) : (
          <p>Aucune réservation pour cette date.</p>
        )}
      </div>
    </div>
  )
}

export default CalendarComponent
