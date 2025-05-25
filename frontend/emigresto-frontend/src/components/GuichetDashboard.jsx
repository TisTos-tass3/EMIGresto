import React from 'react';
import ReservationStatsCard from './ReservationStatsCard';
import ReservationTable from './ReservationTable';

const GuichetDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Tableau de bord - Responsable de Guichet</h2>
      <ReservationStatsCard />
      <ReservationTable />
    </div>
  );
};

export default GuichetDashboard;
