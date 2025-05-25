import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API } from '../services/apiServices'
import Spinner from './Spinner'

export default function ReservationGrid() {
  const qc = useQueryClient()

  // 1) Charger les données nécessaires
  const { data: students, isLoading: sLoading } = useQuery({  // --- MODIFICATION ICI
    queryKey: ['students'],                                // <--- NOUVELLE CLÉ 'queryKey'
    queryFn: () => API.etudiant.list({ page_size: 500 })   // <--- NOUVELLE CLÉ 'queryFn'
  })
  const { data: jours, isLoading: jLoading } = useQuery({ // <--- MODIFICATION ICI
    queryKey: ['jours'],                                  // <--- NOUVELLE CLÉ 'queryKey'
    queryFn: () => API.jour.list({ page_size: 7 })        // <--- NOUVELLE CLÉ 'queryFn'
  })
  const { data: periodes, isLoading: pLoading } = useQuery({ // <--- MODIFICATION ICI
    queryKey: ['periodes'],                                   // <--- NOUVELLE CLÉ 'queryKey'
    queryFn: () => API.periode.list()                         // <--- NOUVELLE CLÉ 'queryFn'
  })
  const { data: resevData, isLoading: rLoading } = useQuery({ // <--- MODIFICATION ICI
    queryKey: ['reservations'],                                // <--- NOUVELLE CLÉ 'queryKey'
    queryFn: () => API.reservation.list({ page_size: 1000 })  // <--- NOUVELLE CLÉ 'queryFn'
  })

  // 2) Mutation pour créer ou supprimer une réservation
  // useMutation utilise déjà la syntaxe objet, donc pas de changement ici, c'est correct
  const upsertMut = useMutation({ // L'argument est déjà un objet, c'est bon
    mutationFn: ({ student, jour, periode, exists, resId }) => { // <--- 'mutationFn' est la clé pour la fonction de mutation
      if (exists) {
        return API.reservation.delete(resId)
      }
      return API.reservation.create({ etudiant: student, jour, periode })
    },
    onSuccess: () => qc.invalidateQueries(['reservations'])
  })

  if (sLoading || jLoading || pLoading || rLoading) return <Spinner />

  // 3) Construire un lookup des réservations existantes
  const lookup = {}
  resevData.results.forEach(r => {
    lookup[`${r.etudiant}-${r.jour}-${r.periode}`] = r.id
  })

  // 4) Générer dynamiquement l’ordre des colonnes (jour × période)
  const headers = jours.results.flatMap(j =>
    periodes.results.map(p => ({ jour: j, periode: p }))
  )

  // 5) Rendu du tableau
  return (
    <table className="min-w-full bg-white rounded shadow overflow-x-auto">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2">ID</th>
          <th className="px-4 py-2">Nom</th>
          <th className="px-4 py-2">Prénom</th>
          {headers.map(h => (
            <th key={`${h.jour.id}-${h.periode.id}`} className="px-2 py-1 text-center">
              <div className="text-xs font-semibold">
                {h.jour.nomJour}
              </div>
              <div className="text-xxs">
                {h.periode.nomPeriode}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {students.results.map(u => (
          <tr key={u.id} className="even:bg-gray-50">
            <td className="px-4 py-2">{u.id}</td>
            <td className="px-4 py-2">{u.nom}</td>
            <td className="px-4 py-2">{u.prenom}</td>

            {headers.map(h => {
              const key = `${u.id}-${h.jour.id}-${h.periode.id}`
              const exists = Boolean(lookup[key])
              return (
                <td key={key} className="px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={exists}
                    onChange={() => upsertMut.mutate({
                      student: u.id,
                      jour: h.jour.id,
                      periode: h.periode.id,
                      exists,
                      resId: lookup[key],
                    })}
                    className="h-4 w-4 cursor-pointer"
                  />
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}