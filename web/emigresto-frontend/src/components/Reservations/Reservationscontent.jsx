// src/components/Reservations/ReservationsContent.jsx
import React from "react";
import useReservationsData from "../../hooks/useReservationsData";
import DataTable from "../../layout/DataTable";
import CalendarComponent from "../../../../../frontend/emigresto-frontend/src/layout/Layout_R/CalendarComponent";
import Pagination from "../../../../../frontend/emigresto-frontend/src/layout/Layout_R/Pagination";
import SearchSortExport from "../../../../../frontend/emigresto-frontend/src/layout/Layout_R/SearchSortExport";

export default function ReservationsContent() {
  const {
    etudiants,
    jours,
    periodes,
    reservationsMap,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    page,
    totalPages,
    setPage,
    exportToPDF,
    toggleReservation,
    toggleAllForStudent,
    handleKeyDown,
    getReservationDate,
  } = useReservationsData();

  if (loading)
    return <div className="text-center py-16">Chargement des données...</div>;
  if (error)
    return <div className="text-center text-red-500 py-16">Erreur de chargement</div>;

  return (
    <>
      <SearchSortExport
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        exportToPDF={exportToPDF}
      />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 overflow-x-auto bg-white rounded shadow p-4">
          <DataTable
            etudiants={etudiants}
            jours={jours}
            periodes={periodes}
            reservations={reservationsMap}
            onCheckboxToggle={toggleReservation}
            handleToggleAll={toggleAllForStudent}
            handleKeyDown={handleKeyDown}
            getReservationDate={getReservationDate}
          />
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} setCurrentPage={setPage} />
          )}
        </div>
        <div className="col-span-1">
          <CalendarComponent
            reservations={reservationsMap}
            jours={jours}
            periodes={periodes}
          />
        </div>
      </div>
    </>
  );
}

