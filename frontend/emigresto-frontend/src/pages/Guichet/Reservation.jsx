import jsPDF from "jspdf"
import "jspdf-autotable"
import React, { useEffect, useState } from "react"
import Pagination from "../../layout/Layout_R/Pagination"
import SearchSortExport from "../../layout/Layout_R/SearchSortExport"
import Table from "../../layout/Layout_R/Table"
import { API } from "../../services/apiServices"

export default function Reservation() {
  const [etudiants, setEtudiants] = useState([])
  const [jours, setJours] = useState([])
  const [periodes, setPeriodes] = useState([])
  const [reservations, setReservations] = useState(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 7

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [etuRes, jourRes, periRes, resaRes] = await Promise.all([
        API.etudiant.list({ page_size: 500 }),
        API.jour.list({ page_size: 7 }),
        API.periode.list({ page_size: 50 }),
        API.reservation.list({ page_size: 1000 }),
      ])

      setEtudiants(etuRes.results)
      setJours(jourRes.results)
      setPeriodes(periRes.results)

      // Construire la Map idEtudiant → Map("jour-periode" → reservation)
      const map = new Map()
      etuRes.results.forEach(e => map.set(e.id, new Map()))
      resaRes.results.forEach(r => {
        const key = `${r.etudiant}-${r.jour}-${r.periode}`
        map.get(r.etudiant).set(key, r)
      })
      setReservations(map)
    } catch {
      setError("Impossible de charger les réservations.")
    } finally {
      setLoading(false)
    }
  }

  // Renvoie le lundi de la semaine en cours
  const getWeekStart = () => {
    const d = new Date()
    const day = d.getDay() === 0 ? 7 : d.getDay()
    d.setDate(d.getDate() - day + 1)
    return d
  }

  // Calcule la date ISO (YYYY-MM-DD) selon l'offset de jour
  const getReservationDate = offset => {
    const d = new Date(getWeekStart())
    d.setDate(d.getDate() + offset)
    return d.toISOString().split("T")[0]
  }

  // Basculer une réservation
  const handleToggle = async (etuId, jourId, periId) => {
    const key = `${etuId}-${jourId}-${periId}`
    const studentMap = new Map(reservations)
    const row = studentMap.get(etuId)
    const exists = row.get(key)

    const jourIndex = jours.findIndex(j => j.id === jourId)
    const dateStr = getReservationDate(jourIndex)
    const payload = {
      etudiant: etuId,
      jour: jourId,
      periode: periId,
      date: dateStr,
      heure: "12:00:00", // format HH:mm:ss
    }

    try {
      if (exists) {
        await API.reservation.delete(exists.id)
        row.delete(key)
      } else {
        console.log("Création réservation payload =", payload)
        const created = await API.reservation.create(payload)
        console.log("Réservation créée =", created)
        row.set(key, created)
      }
      setReservations(studentMap)
    } catch (e) {
      console.error("Erreur code =", e.response?.status, e.response?.data)
      setError("Erreur lors de l'enregistrement de la réservation.")
    }
  }

  // Tout cocher / tout décocher pour un étudiant
  const handleToggleAll = etuId => {
    jours.forEach((j, i) =>
      periodes.forEach(p => handleToggle(etuId, j.id, p.id))
    )
  }

  // Filtrage et tri
  const filtered = etudiants.filter(e =>
    e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const sorted = sortBy
    ? [...filtered].sort((a, b) =>
        typeof a[sortBy] === "string"
          ? a[sortBy].localeCompare(b[sortBy])
          : a[sortBy] - b[sortBy]
      )
    : filtered

  // Pagination
  const totalPages = Math.ceil(sorted.length / rowsPerPage)
  const paginated = sorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  // Export PDF
  const exportPDF = () => {
    const pdf = new jsPDF("landscape")
    pdf.text("Liste des Réservations", 14, 10)
    const head = ["ID", "Nom", "Prénom", ...jours.map(j => j.nomJour)]
    const body = sorted.map(e => {
      const row = [e.id, e.nom, e.prenom]
      jours.forEach((j, i) => {
        let s = ""
        periodes.forEach(p => {
          const key = `${e.id}-${j.id}-${p.id}`
          s += reservations.get(e.id)?.has(key) ? "✔ " : "✘ "
        })
        row.push(s.trim())
      })
      return row
    })
    pdf.autoTable({ head: [head], body, startY: 20 })
    pdf.save("Reservations.pdf")
  }

  if (loading) return <div className="text-center">Chargement...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <>
      <SearchSortExport
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSortBy={setSortBy}
        exportToPDF={exportPDF}
      />

      <Table
        etudiants={paginated}
        jours={jours}
        periodes={periodes}
        reservations={reservations}
        handleReservationToggle={handleToggle}
        handleToggleAll={handleToggleAll}
        handleKeyDown={() => {}}
        getReservationDate={getWeekStart}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </>
  )
}
