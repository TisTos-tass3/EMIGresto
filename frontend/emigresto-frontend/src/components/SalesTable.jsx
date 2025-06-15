// src/components/SalesTable.jsx
import { useEffect, useState } from 'react';
import { API } from '../services/apiServices';
import Spinner from './Spinner';

export default function SalesTable() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.paiement.list().then(data => {
      setSales(data.results);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-4 py-2">Étudiant</th>
            <th className="px-4 py-2">Montant</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id} className="even:bg-gray-100">
              <td className="px-4 py-2">{s.etudiant.nom} {s.etudiant.prenom}</td>
              <td className="px-4 py-2">{s.montant} FCFA</td>
              <td className="px-4 py-2">{new Date(s.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
