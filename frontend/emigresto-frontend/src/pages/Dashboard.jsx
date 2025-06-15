// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { FaMoneyBillWave, FaTicketAlt } from 'react-icons/fa';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import DashboardCard from '../components/DashboardCard';
import { API } from '../services/apiServices';

export default function Dashboard() {
  const [totalSales, setTotalSales]       = useState(0);
  const [totalTickets, setTotalTickets]   = useState(0);
  const [chartData, setChartData]         = useState([]);

  useEffect(() => {
    // 1) On récupère les paiements
    API.paiement.list().then(d => {
      const salesArray = d.results;
      const ca = salesArray.reduce((sum, x) => sum + x.montant, 0);
      setTotalSales(ca);

      // Exemple : faire un bar chart CA / Tickets
      // on met à jour chartData après avoir les deux datas
      API.ticket.list().then(td => {
        const ticketsArray = td.results;
        const qt = ticketsArray.reduce((sum, x) => sum + x.quantite, 0);
        setTotalTickets(qt);

        setChartData([
          { name: 'Chiffre d’affaires', value: ca },
          { name: 'Tickets vendus', value: qt }
        ]);
      });
    });
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Les cartes de résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="CA total"
          value={`${totalSales} FCFA`}
          icon={<FaMoneyBillWave />}
        />
        <DashboardCard
          title="Tickets vendus"
          value={totalTickets}
          icon={<FaTicketAlt />}
        />
      </div>

      {/* Le bar chart */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Vue d’ensemble</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={value => `${value}`} />
            <Legend />
            <Bar dataKey="value" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
