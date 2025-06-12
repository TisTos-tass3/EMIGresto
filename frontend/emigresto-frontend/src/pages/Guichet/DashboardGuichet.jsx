import React from 'react';
import AlertComponent from '../../layout/Layout_R/AlertComponent';
import CalendarComponent from '../../layout/Layout_R/CalendarComponent';
import GraphComponent from '../../layout/Layout_R/GraphComponent';
import HistoryComponent from '../../layout/Layout_R/HistoryComponent';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Alertes en haut */}
      <AlertComponent />

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <HistoryComponent />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <GraphComponent />
        </div>
        <div className="bg-white rounded-lg shadow p-4 md:col-span-2">
          <CalendarComponent />
        </div>
      </div>
    </div>
  );
}
