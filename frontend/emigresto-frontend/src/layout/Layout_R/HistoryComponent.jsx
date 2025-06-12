import React, { useEffect, useState } from 'react';
import { API } from '../../services/apiServices';

const HistoryComponent = () => {
  const [reservations, setReservations] = useState([]);
  const [periods, setPeriods] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    API.reservation.list()
      .then(res => setReservations(res.results))
      .catch(() => setError("Impossible de charger l'historique."));
    API.periode.list()
      .then(res => {
        const map = {};
        res.results.forEach(p => map[p.id] = p.nomPeriode);
        setPeriods(map);
      })
      .catch(err => console.error("Erreur périodes :", err));
  }, []);

  const byPeriod = reservations.reduce((acc, r) => {
    if (!acc[r.periode]) acc[r.periode] = [];
    acc[r.periode].push(r);
    return acc;
  }, {});

  return (
    <div className="p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-2">Historique</h2>
      {error && <div className="text-red-500">{error}</div>}
      {Object.entries(byPeriod).length ? (
        Object.entries(byPeriod).map(([pid, list]) => (
          <div key={pid} className="mb-3">
            <h4 className="font-medium">{periods[pid]}</h4>
            <p>{list.length} réservation(s)</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">Aucune donnée.</p>
      )}
    </div>
  );
};

export default HistoryComponent;
