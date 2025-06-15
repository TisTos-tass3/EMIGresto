// src/pages/History.jsx
import SalesTable from '../components/SalesTable';

export default function History() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Historique des ventes</h1>
      <SalesTable />
    </div>
  );
}
