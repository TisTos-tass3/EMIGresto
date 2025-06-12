// src/components/ReservationGrid.jsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API } from '../services/apiServices'
import Spinner from './Spinner'

export default function ReservationGrid() {
  const qc = useQueryClient()

  // 1) Chargement des 4 ressources
  const { data: studentsData, isLoading: stLoad, isError: stErr } = useQuery({
    queryKey: ['students'],
    queryFn: () => API.etudiant.list({ page_size: 500 }),
    keepPreviousData: true,
  })
  const { data: joursData, isLoading: jLoad, isError: jErr } = useQuery({
    queryKey: ['jours'],
    queryFn: () => API.jour.list({ page_size: 7 }),
  })
  const { data: periodesData, isLoading: pLoad, isError: pErr } = useQuery({
    queryKey: ['periodes'],
    queryFn: () => API.periode.list(),
  })
  const { data: reservData, isLoading: rLoad, isError: rErr } = useQuery({
    queryKey: ['reservations'],
    queryFn: () => API.reservation.list({ page_size: 1000 }),
    keepPreviousData: true,
  })

  // 2) Mutation upsert
  const upsertMut = useMutation({
    mutationFn: ({ etudiant, jour, periode, resId }) =>
      resId
        ? API.reservation.delete(resId)
        : API.reservation.create({ etudiant, jour, periode }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  })

  // 3) Loader / erreur
  if (stLoad || jLoad || pLoad || rLoad) return <Spinner />
  if (stErr || jErr || pErr || rErr) {
    return <div className="p-4 text-red-600">Erreur de chargement des données…</div>
  }

  // 4) Lookup
  const lookup = {}
  reservData.results.forEach(r => {
    lookup[`${r.etudiant}-${r.jour}-${r.periode}`] = r.id
  })

  // 5) Colonnes dynamiques
  const headers = joursData.results.flatMap(j =>
    periodesData.results.map(p => ({ j, p }))
  )

  // 6) Rendu
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Prénom</th>
            {headers.map(({ j, p }) => (
              <th
                key={`${j.id}-${p.id}`}
                className="px-2 py-1 text-center text-xs font-semibold"
              >
                <div>{j.nomJour}</div>
                <div className="text-xxs">{p.nomPeriode}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {studentsData.results.map(u => (
            <tr key={u.id} className="even:bg-gray-50">
              <td className="px-4 py-2">{u.id}</td>
              <td className="px-4 py-2">{u.nom}</td>
              <td className="px-4 py-2">{u.prenom}</td>
              {headers.map(({ j, p }) => {
                const key = `${u.id}-${j.id}-${p.id}`
                const resId = lookup[key]
                return (
                  <td key={key} className="px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={Boolean(resId)}
                      onChange={() =>
                        upsertMut.mutate({ etudiant: u.id, jour: j.id, periode: p.id, resId })
                      }
                      className="h-4 w-4 cursor-pointer"
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

