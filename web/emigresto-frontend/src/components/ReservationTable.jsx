import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ReservationForm from './ReservationForm'
import Spinner from './Spinner'

export default function ReservationTable() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState(null)

  const { data, isLoading } = useQuery(
    ['reservations'], () => API.reservation.list({ page_size: 100 })
  )
  const delMut = useMutation(id => API.reservation.delete(id), {
    onSuccess: () => qc.invalidateQueries(['reservations'])
  })

  if (isLoading) return <Spinner />

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gérer les réservations</h1>
        <button
          onClick={() => setEditing({})}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Nouvelle
        </button>
      </div>

      {editing && (
        <div className="mb-6">
          <ReservationForm
            initial={editing.id ? editing : null}
            onClose={() => setEditing(null)}
          />
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              {['Étudiant','Jour','Période','Date','Heure','Actions'].map(h => (
                <th key={h} className="px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.results.map(r => (
              <tr key={r.id} className="even:bg-gray-50">
                <td className="px-4 py-2">{r.etudiant.nom} {r.etudiant.prenom}</td>
                <td className="px-4 py-2">{r.jour.nomJour}</td>
                <td className="px-4 py-2">{r.periode.nomPeriode}</td>
                <td className="px-4 py-2">{r.date}</td>
                <td className="px-4 py-2">{r.heure}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => setEditing(r)}
                    className="text-blue-600 hover:underline"
                  >Modifier</button>
                  <button
                    onClick={() => delMut.mutate(r.id)}
                    disabled={delMut.isLoading}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >Annuler</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
