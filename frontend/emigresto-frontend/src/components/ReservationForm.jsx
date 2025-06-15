import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { API } from '../services/apiServices'
import Spinner from './Spinner'
import StudentSelect from './StudentSelect'

export default function ReservationForm({ onClose, initial = null }) {
  const qc = useQueryClient()

  // Charger jours & périodes
  const { data: jours, isLoading: jLoading }         = useQuery(['jours'],     () => API.jour.list())
  const { data: periodes, isLoading: pLoading }     = useQuery(['periodes'], () => API.periode.list())
  const loadingLookups = jLoading || pLoading

  const [etudiantId, setEtudiantId] = useState(initial?.etudiant || '')
  const [jourId, setJourId]         = useState(initial?.jour || '')
  const [periodeId, setPeriodeId]   = useState(initial?.periode || '')
  const [date, setDate]             = useState(initial?.date ? new Date(initial.date) : new Date())
  const [heure, setHeure]           = useState(initial?.heure || '12:00')

  const mut = useMutation(
    () => {
      const payload = { etudiant: etudiantId, jour: jourId, periode: periodeId, date, heure }
      return initial
        ? API.reservation.update(initial.id, payload)
        : API.reservation.create(payload)
    },
    {
      onSuccess: () => {
        qc.invalidateQueries(['reservations'])
        onClose()
      }
    }
  )

  if (loadingLookups) return <Spinner />

  return (
    <form onSubmit={e => { e.preventDefault(); mut.mutate() }}
          className="space-y-4 p-6 bg-white rounded shadow-lg">
      <h2 className="text-xl font-semibold">
        {initial ? 'Modifier' : 'Nouvelle'} réservation
      </h2>

      {mut.isError && (
        <p className="text-red-600">
          {mut.error.detail || 'Erreur lors de la sauvegarde.'}
        </p>
      )}

      <div>
        <label className="block mb-1">Étudiant</label>
        <StudentSelect value={etudiantId} onChange={setEtudiantId} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Jour</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={jourId}
            onChange={e => setJourId(e.target.value)}
            required
          >
            <option value="">–</option>
            {jours.results.map(j => (
              <option key={j.id} value={j.id}>{j.nomJour}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Période</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={periodeId}
            onChange={e => setPeriodeId(e.target.value)}
            required
          >
            <option value="">–</option>
            {periodes.results.map(p => (
              <option key={p.id} value={p.id}>{p.nomPeriode}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1">Date</label>
        <DatePicker
          className="w-full border px-2 py-1 rounded"
          selected={date}
          onChange={setDate}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div>
        <label className="block mb-1">Heure</label>
        <input
          type="time"
          className="w-full border px-2 py-1 rounded"
          value={heure}
          onChange={e => setHeure(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={mut.isLoading}
        className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 disabled:opacity-50"
      >
        {mut.isLoading ? '…Enregistrement' : (initial ? 'Enregistrer' : 'Réserver')}
      </button>
    </form>
  )
}
