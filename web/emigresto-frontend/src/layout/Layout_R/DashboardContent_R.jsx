import React, { useEffect, useState } from 'react'
import { API } from '../../services/apiServices'
import CalendarComponent from './CalendarComponent'
import GraphComponent from './GraphComponent'
import HistoryComponent from './HistoryComponent'

const joursSemaine = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
const getTodayName  = () => joursSemaine[new Date().getDay()]

export default function DashboardContent_R() {
  const [stats, setStats]     = useState({ allCount:0, petitDejCount:0, lunchCount:0, dinnerCount:0 })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const tomorrow = joursSemaine[(joursSemaine.indexOf(getTodayName()) + 1) % 7]

  useEffect(() => {
    API.jour
      .list()
      .then(res => {
        const data = res.results.find(j => j.nomJour === tomorrow)
        if (data) {
          setStats({
            allCount: data.nbre_reserve_jour,
            petitDejCount: data.nbre_reserve_lendemain_petitDej,
            lunchCount: data.nbre_reserve_lendemain_dejeuner,
            dinnerCount: data.nbre_reserve_lendemain_diner,
          })
        }
      })
      .catch(() => setError('Erreur récupération stats'))
      .finally(() => setLoading(false))
  }, [tomorrow])

  if (loading) return <div>Chargement…</div>
  if (error)   return <div className="text-red-600">{error}</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-2">Réservations pour {tomorrow}</h2>
        <p>Total : {stats.allCount}</p>
        <p>Petit-déj : {stats.petitDejCount}</p>
        <p>Déj : {stats.lunchCount}</p>
        <p>Dîner : {stats.dinnerCount}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 lg:col-span-1">
        <HistoryComponent />
      </div>

      <div className="bg-white shadow rounded-lg p-4 lg:col-span-2">
        <CalendarComponent />
      </div>

      <div className="bg-white shadow rounded-lg p-4 lg:col-span-2">
        <GraphComponent />
      </div>
    </div>
  )
}
