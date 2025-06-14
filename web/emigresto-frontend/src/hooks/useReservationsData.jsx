// src/hooks/useReservationsData.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { API } from "../services/apiServices";

export default function useReservationsData() {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const { data: etudiants } = useQuery(["etudiants"], () =>
    API.etudiant.list({ page_size: 500 })
  );
  const { data: jours } = useQuery(["jours"], () =>
    API.jour.list({ page_size: 7 })
  );
  const { data: periodes } = useQuery(["periodes"], () =>
    API.periode.list()
  );
  const { data: reservations } = useQuery(["reservations"], () =>
    API.reservation.list({ page_size: 1000 })
  );

  const upsert = useMutation(
    ({ etudiant, jour, periode, resId }) =>
      resId
        ? API.reservation.delete(resId)
        : API.reservation.create({ etudiant, jour, periode }),
    {
      onSuccess: () => qc.invalidateQueries(["reservations"]),
    }
  );

  // Build lookup map
  const reservationsMap = new Map();
  if (reservations?.results && etudiants?.results) {
    etudiants.results.forEach((e) =>
      reservationsMap.set(e.id, new Map())
    );
    reservations.results.forEach((r) => {
      reservationsMap
        .get(r.etudiant)
        .set(`${r.jour}-${r.periode}`, r.id);
    });
  }

  // Search & sort & paginate students
  let filtered = etudiants.results.filter((s) =>
    [s.nom, s.prenom].some((f) =>
      f.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  if (sortBy) {
    filtered.sort((a, b) =>
      String(a[sortBy]).localeCompare(String(b[sortBy]))
    );
  }
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // PDF export
  const exportToPDF = () => {
    // ... jsPDF logic ...
  };

  // Handlers
  const toggleReservation = (et, j, p) => {
    const key = `${et}-${j}-${p}`;
    const resId = reservationsMap.get(et)?.get(key);
    upsert.mutate({ etudiant: et, jour: j, periode: p, resId });
  };

  const toggleAllForStudent = (et) => {
    // ... bulk logic ...
  };

  const handleKeyDown = (e, et, j, p) => {
    if (["Enter", " "].includes(e.key)) {
      e.preventDefault();
      toggleReservation(et, j, p);
    }
  };

  const getReservationDate = (jourId) => {
    // ... week start logic ...
  };

  // Alerts hook can be separate

  return {
    etudiants: paginated,
    jours: jours.results,
    periodes: periodes.results,
    reservationsMap,
    loading: !etudiants || !jours || !periodes || !reservations,
    error: null,
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
  };
}
