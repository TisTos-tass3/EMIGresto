import React from "react";

const DataTable_R = ({
  etudiants,
  jours,
  periodes,
  reservations,
  onCheckboxToggle,
  handleKeyDown,
}) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th rowSpan="2" className="border p-2">ID</th>
          <th rowSpan="2" className="border p-2">Nom</th>
          <th rowSpan="2" className="border p-2">Prénom</th>
          {jours.map((jour, idx) => (
            <th
              key={jour.id}
              colSpan={periodes.length}
              className={`border p-2 text-center ${idx !== 0 ? "border-l-4 border-gray-500" : ""}`}
            >
              {jour.nomJour}
            </th>
          ))}
        </tr>
        <tr className="bg-gray-200">
          {jours.flatMap((jour, idx) =>
            periodes.map(periode => (
              <th
                key={`${jour.id}-${periode.id}`}
                className={`border p-2 ${idx !== 0 ? "border-l-4 border-gray-500" : ""}`}
              >
                {periode.nomPeriode}
              </th>
            ))
          )}
        </tr>
      </thead>
      <tbody>
        {etudiants.map(etudiant => (
          <tr key={etudiant.id} className="border even:bg-gray-50">
            <td className="border p-2">{etudiant.id}</td>
            <td className="border p-2">{etudiant.nom}</td>
            <td className="border p-2">{etudiant.prenom}</td>
            {jours.flatMap(jour =>
              periodes.map(periode => {
                const key = `${jour.id}-${periode.id}`;
                const isChecked = !!reservations
                  .get(etudiant.id)
                  ?.get(key);
                return (
                  <td
                    key={`${etudiant.id}-${key}`}
                    className="border p-2 text-center"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onCheckboxToggle(etudiant.id, jour.id, periode.id)}
                      onKeyDown={e => handleKeyDown(e, etudiant.id, jour.id, periode.id)}
                      tabIndex={0}
                    />
                  </td>
                );
              })
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable_R;
