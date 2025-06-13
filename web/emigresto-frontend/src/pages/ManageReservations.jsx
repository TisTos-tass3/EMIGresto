// src/pages/ManageReservations.jsx
import ReservationGrid from '../components_og/ReservationGrid'

export default function ManageReservations() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des Réservations</h1>
      <ReservationGrid />
    </div>
  )
}
