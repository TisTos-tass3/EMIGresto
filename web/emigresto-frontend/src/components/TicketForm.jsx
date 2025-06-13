// src/components/TicketForm.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { API } from '../services/apiService'
import Spinner from './Spinner'
import StudentSelect from './StudentSelect'

export default function TicketForm() {
  const qc = useQueryClient()
  const [etudiantId, setEtudiantId] = useState('')
  const [type, setType] = useState('PETIT')
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    setTotalPrice(quantity * (type === 'PETIT' ? 80 : 125))
  }, [type, quantity])

  const sellMutation = useMutation({
    mutationFn: async () => {
      const pay = await API.paiement.create({ montant: totalPrice, mode_paiement: 'CASH' })
      return API.ticket.create({
        etudiant: etudiantId,
        type_ticket: type,
        quantite: quantity,
        paiement: pay.id,
      })
    },
    onSuccess: ticket => {
      qc.invalidateQueries({ queryKey: ['paiements'] })
      qc.invalidateQueries({ queryKey: ['tickets'] })
      toast.success(`🎉 Ticket #${ticket.id} généré`)
      setEtudiantId('')
      setType('PETIT')
      setQuantity(1)
    },
    onError: err => {
      toast.error(err.message || 'Erreur lors de la vente')
    },
  })  

  const handleSubmit = e => {
    e.preventDefault()
    if (!etudiantId) return toast.error('Sélectionnez un étudiant')
    if (quantity < 1 || quantity > 50) return toast.error('Quantité entre 1 et 50')
    sellMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary">Vendre des tickets</h2>

      <div className="p-4 bg-blue-50 rounded-lg">
        <span className="font-medium">Prix total : </span>
        <span className="font-bold">{totalPrice} FCFA</span>
      </div>

      <div>
        <label className="block mb-1 font-medium">Étudiant</label>
        <StudentSelect value={etudiantId} onChange={setEtudiantId} required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Type</label>
        <select
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="PETIT">Petit-déj (80 FCFA)</option>
          <option value="DEJ">Déj/Dîner (125 FCFA)</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Quantité</label>
        <input
          type="number"
          min="1"
          max="50"
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary"
          value={quantity}
          onChange={e => setQuantity(+e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={sellMutation.isLoading}
        className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/90 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {sellMutation.isLoading ? (
          <>
            <Spinner size="sm" />
            <span>Enregistrement…</span>
          </>
        ) : (
          `Vendre (${totalPrice} FCFA)`
        )}
      </button>
    </form>
  )
}
