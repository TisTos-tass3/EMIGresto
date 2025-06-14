// src/pages/Reservation.jsx
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useState } from "react";
import Header from "../../layout/Header";
import Pagination from "../../layout/Layout_R/Pagination";
import SearchSortExport from "../../layout/Layout_R/SearchSortExport";
import { menuItems, userOptions } from "../../layout/Layout_R/SidebarData_R";
import Table from "../../layout/Layout_R/Table";
import Sidebar from "../../layout/Sidebar";
import { API } from "../../services/apiServices";


export default function Reservation() {
  // États pour les données
  const [etudiants, setEtudiants] = useState([]);
  const [jours, setJours] = useState([]);
  const [periodes, setPeriodes] = useState([]);
  const [reservations, setReservations] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour la recherche/tri/pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const [etuRes, jourRes, periRes, resaRes] = await Promise.all([
        API.etudiant.list({ page_size: 500 }),
        API.jour.list({ page_size: 7 }),
        API.periode.list(),
        API.reservation.list({ page_size: 1000 }),
      ]);
      setEtudiants(etuRes.results);
      setJours(jourRes.results);
      setPeriodes(periRes.results);

      // Construire la Map idEtudiant → Map("jour-periode"→reservationObj)
      const map = new Map();
      etuRes.results.forEach(e => map.set(e.id, new Map()));
      resaRes.results.forEach(r => {
        const key = `${r.etudiant}-${r.jour}-${r.periode}`;
        map.get(r.etudiant).set(key, r);
      });
      setReservations(map);
    } catch (e) {
      console.error(e);
      setError("Impossible de charger les réservations.");
    } finally {
      setLoading(false);
    }
  }

  // Calculer la date ISO pour un offset jour de la semaine (0 = lundi)
  const getWeekStartDate = () => {
    const today = new Date();
    const day = today.getDay() || 7; 
    const monday = new Date(today);
    monday.setDate(today.getDate() - day + 1);
    return monday;
  };
  const getReservationDate = (offset) => {
    const d = new Date(getWeekStartDate());
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
  };

  const handleReservationToggle = async (idEtu, idJour, idPerio) => {
    const studentMap = new Map(reservations);
    const rowMap = studentMap.get(idEtu);
    const key = `${idEtu}-${idJour}-${idPerio}`;
    const existing = rowMap.get(`${idEtu}-${idJour}-${idPerio}`);
    // trouver index du jour pour la date
    const idx = jours.findIndex(j => j.id === idJour);
    const payload = { 
      etudiant: idEtu, 
      jour: idJour, 
      periode: idPerio, 
      date: getReservationDate(idx),
      heure: "12:00"
    };
    try {
      if (existing) {
        await API.reservation.delete(existing.id);
        rowMap.delete(key);
      } else {
        const created = await API.reservation.create(payload);
        rowMap.set(key, created);
      }
      setReservations(studentMap);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAll = (idEtu) => {
    jours.forEach(j =>
      periodes.forEach(p => handleReservationToggle(idEtu, j.id, p.id))
    );
  };

  // Filtrer et trier
  const filtered = etudiants.filter(e =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sorted = sortBy
    ? [...filtered].sort((a,b) => 
        typeof a[sortBy] === "string"
          ? a[sortBy].localeCompare(b[sortBy])
          : a[sortBy] - b[sortBy]
      )
    : filtered;
  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice(
    (currentPage-1)*rowsPerPage,
    currentPage*rowsPerPage
  );

  const exportToPDF = () => {
    const pdf = new jsPDF("landscape");
    pdf.text("Liste des Réservations", 14, 10);
    const head = ["ID","Nom","Prénom",...jours.map(j=>j.nomJour)];
    const body = sorted.map(e => {
      const row = [e.id, e.nom, e.prenom];
      jours.forEach((j,i) => {
        let s = "";
        periodes.forEach(p => {
          const key = `${e.id}-${j.id}-${p.id}`;
          s += reservations.get(e.id).has(key) ? "✔ " : "✘ ";
        });
        row.push(s.trim());
      });
      return row;
    });
    pdf.autoTable({ head:[head], body, startY:20 });
    pdf.save("Reservations.pdf");
  };

  return (
    <div className="h-screen flex">
      <Sidebar menuItems={menuItems} userOptions={userOptions} />
      <div className="flex-1 flex flex-col">
        <Header h_title="Réservations" h_user="Admin" h_role="Vendeur" />
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {loading 
            ? <div className="text-center">Chargement...</div>
            : error
              ? <div className="text-red-600">{error}</div>
              : (
              <>
                <SearchSortExport
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setSortBy={setSortBy}
                  exportToPDF={exportToPDF}
                />
                <Table
                  etudiants={paginated}
                  jours={jours}
                  periodes={periodes}
                  reservations={reservations}
                  handleReservationToggle={handleReservationToggle}
                  handleToggleAll={handleToggleAll}
                  handleKeyDown={() => {}}
                  getReservationDate={(jourId) => {
                    const idx = jours.findIndex(j=>j.id===jourId);
                    return getReservationDate(idx);
                  }}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </>
          )}
        </main>
      </div>
    </div>
  );
}
