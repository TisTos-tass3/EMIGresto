// src/components/StudentSelect.jsx
import { useEffect, useState } from 'react';
import { API } from '../services/apiServices';
import Spinner from './Spinner';

export default function StudentSelect({ value, onChange }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.etudiant.list({ search: value }).then(data => {
      setStudents(data.results);
      setLoading(false);
    });
  }, [value]);

  if (loading) return <Spinner />;

  return (
    <select
      className="w-full border px-3 py-2 rounded"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
    >
      <option value="">Sélectionner un étudiant</option>
      {students.map(s => (
        <option key={s.id} value={s.id}>
          {s.nom} {s.prenom} — {s.matricule}
        </option>
      ))}
    </select>
  );
}
