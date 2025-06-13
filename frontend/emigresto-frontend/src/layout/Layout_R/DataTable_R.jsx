import React from 'react'

const DataTable_R = ({ etudiants, jours, periodes, reservations, onCheckboxToggle, handleKeyDown }) => {
  return (
    <table className="w-full border border-gray-300 table-fixed">
      <thead className="bg-gray-100">
        <tr>
          <th rowSpan="2" className="border p-2">ID</th>
          <th rowSpan="2" className="border p-2">Nom</th>
          <th rowSpan="2" className="border p-2">Prénom</th>
          {jours.map((j,i) => (
            <th key={j.id} colSpan={periodes.length} className={`border p-2 text-center ${i>0&&'border-l-4 border-gray-400'}`}>
              {j.nomJour}
            </th>
          ))}
        </tr>
        <tr>
          {jours.flatMap((j,i) =>
            periodes.map(p => (
              <th key={`${j.id}-${p.id}`} className={`border p-2 ${i>0&&'border-l-4 border-gray-400'}`}>
                {p.nomPeriode}
              </th>
            ))
          )}
        </tr>
      </thead>
      <tbody>
        {etudiants.map(u => (
          <tr key={u.id} className="even:bg-gray-50">
            <td className="border p-2">{u.id}</td>
            <td className="border p-2">{u.nom}</td>
            <td className="border p-2">{u.prenom}</td>

            {jours.flatMap(j =>
              periodes.map(p => {
                const key = `${j.id}-${p.id}`
                const checked = !!reservations.get(u.id)?.get(key)
                return (
                  <td key={key} className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onCheckboxToggle(u.id, j.id, p.id)}
                      onKeyDown={e => handleKeyDown(e, u.id, j.id, p.id)}
                      tabIndex={0}
                    />
                  </td>
                )
              })
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DataTable_R
