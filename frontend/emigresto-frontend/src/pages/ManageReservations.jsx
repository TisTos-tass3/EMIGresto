// src/pages/ManageReservations.jsx
import React from "react";
import AlertsPanel from "../components/Reservations/AlertsPanel";
import ReservationsContent from "../components/Reservations/Reservationscontent";
import Header from "../layout/Header";
import { menuItems, userOptions } from "../layout/Layout_R/SidebarData_R";
import Sidebar from "../layout/Sidebar";


export default function ManageReservations() {
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar title="EMIG Resto" menuItems={menuItems} userOptions={userOptions} />
      <div className="flex-1 flex flex-col">
        <Header
          h_title="Gestion des Réservations"
          h_role="Responsable Guichet"
          h_user="Soumana"
        />
        <main className="flex-1 overflow-auto bg-gray-50 p-6 space-y-6">
          <AlertsPanel />
          <ReservationsContent />
        </main>
      </div>
    </div>
  );
}