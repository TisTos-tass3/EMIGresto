import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Spinner from '../../components/Spinner'
import { API } from '../../services/apiService'

export default function StudentList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['etudiants'],
    queryFn: () => API.etudiant.list({ page_size: 1000 })
  })

  if (isLoading) return <Spinner />
  if (isError || !data) return <div className="text-red-600">Erreur de chargement.</div>

  return (
    <div className="bg-white shadow rounded overflow-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Matricule</th>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Prénom</th>
            <th className="px-4 py-2">Genre</th>
            <th className="px-4 py-2">Solde</th>
            <th className="px-4 py-2">Tickets restants</th>
          </tr>
        </thead>
        <tbody>
          {data.results.map(etu => (
            <tr key={etu.id} className="even:bg-gray-50">
              <td className="px-4 py-2">{etu.id}</td>
              <td className="px-4 py-2">{etu.matricule}</td>
              <td className="px-4 py-2">{etu.nom}</td>
              <td className="px-4 py-2">{etu.prenom}</td>
              <td className="px-4 py-2">{etu.genre}</td>
              <td className="px-4 py-2">{Number(etu.solde).toFixed(2)} FCFA</td>
              <td className="px-4 py-2">{etu.ticket_quota}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
