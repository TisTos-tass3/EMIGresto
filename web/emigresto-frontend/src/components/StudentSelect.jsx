// src/components/StudentSelect.jsx
import { useQuery } from '@tanstack/react-query'
import { API } from '../services/apiService'
import Spinner from './Spinner'

/**
 * @param {string|number} value
 * @param {(newId:string) => void} onChange
 * @param {boolean} [disabled]
 */
export default function StudentSelect({ value, onChange, disabled }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: () => API.etudiant.list({ page_size: 500 }),
    staleTime: 1000 * 60 * 5,     // cache 5min
    keepPreviousData: true,       // évite le flash
  })

  if (isLoading) return <Spinner />
  if (isError)   return <div className="text-red-600">Erreur de chargement</div>

  return (
    <select
      className="w-full border px-3 py-2 rounded"
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      required
    >
      <option value="">Sélectionner un étudiant</option>
      {data.results.map(s => (
        <option key={s.id} value={s.id}>
          {s.nom} {s.prenom} — {s.matricule}
        </option>
      ))}
    </select>
  )
}
