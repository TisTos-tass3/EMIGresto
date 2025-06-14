// src/components/Reservations/AlertsPanel.jsx
import React, { useEffect, useState } from "react";
import { API } from "../../services/apiServices";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    API.reservation
      .list({ page_size: 1000 })
      .then((resp) => {
        const messages = resp.results
          .map((r) => {
            if (r.status === "annulée") return `Réservation annulée pour ${r.etudiant.nom} ${r.etudiant.prenom}`;
            if (r.status === "confirmée") return `Réservation confirmée pour ${r.etudiant.nom} ${r.etudiant.prenom}`;
            return null;
          })
          .filter(Boolean);
        setAlerts(messages);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!alerts.length) return null;

  return (
    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Alertes Réservations</h2>
      <ul className="list-disc pl-5 space-y-1">
        {alerts.map((msg, i) => (
          <li key={i} className="text-gray-700">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
