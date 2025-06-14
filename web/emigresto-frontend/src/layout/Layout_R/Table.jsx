import { Check, X } from "lucide-react";
import React from "react";

const Table = ({ etudiants, jours, periodes, reservations, handleReservationToggle, handleToggleAll, handleKeyDown, getReservationDate }) => {
  const today = new Date();

  return (
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th rowSpan="2" className="border px-4 py-2">ID</th>
          <th rowSpan="2" className="border px-4 py-2">Nom</th>
          <th rowSpan="2" className="border px-4 py-2">Prénom</th>
          <th rowSpan="2" className="border px-4 py-2">Tout cocher</th>
          {jours.map(jour => (
            <th key={jour.id} colSpan={periodes.length} className="border px-4 py-2 text-center">
              {jour.nomJour}
            </th>
          ))}
        </tr>
        <tr className="bg-gray-100">
          {jours.map(jour =>
            periodes.map(periode => (
              <th key={`${jour.id}-${periode.id}`} className="border px-4 py-2 text-center">
                {periode.id}
              </th>
            ))
          )}
        </tr>
      </thead>
      <tbody>
        {etudiants.map(etudiant => {
          const studentReservations = reservations.get(etudiant.id) || new Map();
          const totalCells = jours.length * periodes.length;
          const allChecked = studentReservations.size === totalCells;

          return (
            <tr key={etudiant.id}>
              <td className="border px-4 py-2">{etudiant.id}</td>
              <td className="border px-4 py-2">{etudiant.nom}</td>
              <td className="border px-4 py-2">{etudiant.prenom}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className={`p-2 rounded ${allChecked ? "bg-red-500" : "bg-green-500"}`}
                  onClick={() => handleToggleAll(etudiant.id)}
                >
                  {allChecked ? <X size={14} color="white" /> : <Check size={14} color="white" />}
                </button>
              </td>
              {jours.map(jour =>
                periodes.map(periode => {
                  const key = `${jour.id}-${periode.id}`;
                  const isReserved = studentReservations.get(key) || false;

                  // Calcul de la date de réservation pour chaque jour
                  const resDate = new Date(getReservationDate(jour.id));
                  const isPast = resDate < today;

                  return (
                    <td key={`${etudiant.id}-${key}`} className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={isReserved}
                        onChange={() => !isPast && handleReservationToggle(etudiant.id, jour.id, periode.id)}
                        onKeyDown={(event) => !isPast && handleKeyDown(event, etudiant.id, jour.id, periode.id)}
                        tabIndex={0}
                        disabled={isPast} // Désactive la case si le jour est déjà passé
                      />
                    </td>
                  );
                })
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
