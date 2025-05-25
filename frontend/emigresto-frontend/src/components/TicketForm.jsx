import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { API } from '../services/apiServices'
import Spinner from './Spinner'
import StudentSelect from './StudentSelect'

export default function TicketForm() {
  const queryClient = useQueryClient()
  const [etudiantId, setEtudiantId] = useState('')
  const [type, setType] = useState('PETIT')
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  // Calcul du prix total
  useEffect(() => {
    const price = quantity * (type === 'PETIT' ? 80 : 125)
    setTotalPrice(price)
  }, [type, quantity])

  const sellMutation = useMutation(
    async () => {
      try {
        // 1) Création du paiement en espèces
        const pay = await API.paiement.create({
          montant: totalPrice,
          mode_paiement: 'CASH'
        })

        // 2) Création du ticket lié
        const ticket = await API.ticket.create({
          etudiant: etudiantId,
          type_ticket: type,
          quantite: quantity,
          paiement: pay.id
        })

        return { pay, ticket }
      } catch (error) {
        throw new Error(error.response?.data?.detail || 'Erreur lors de la vente')
      }
    },
    {
      onSuccess: (data) => {
        // Invalidation des listes pour rafraîchir le dashboard et l'historique
        queryClient.invalidateQueries({ queryKey: ['paiements'] })
        queryClient.invalidateQueries({ queryKey: ['tickets'] })

        // Notification de succès
        toast.success(`Vente réussie ! Ticket #${data.ticket.id} créé`)

        // Réinitialisation du formulaire
        setEtudiantId('')
        setType('PETIT')
        setQuantity(1)
      },
      onError: (error) => {
        toast.error(error.message || 'Erreur lors de la vente')
      }
    }
  )

  const handleSell = e => {
    e.preventDefault()
    if (!etudiantId) {
      toast.error('Veuillez sélectionner un étudiant')
      return
    }
    if (quantity < 1 || quantity > 50) {
      toast.error('La quantité doit être entre 1 et 50')
      return
    }
    sellMutation.mutate()
  }

  return (
    <form onSubmit={handleSell} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-primary">Vendre des tickets</h1>

      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="font-medium">Prix total: <span className="font-bold">{totalPrice} FCFA</span></p>
      </div>

      <div>
        <label className="block mb-1 font-medium">Étudiant</label>
        <StudentSelect
          value={etudiantId}
          onChange={setEtudiantId}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Type de ticket</label>
        <select
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={quantity}
          onChange={e => {
            const value = Number(e.target.value)
            if (value < 1 || value > 50) return
            setQuantity(value)
          }}
        />
      </div>

      <button
        type="submit"
        disabled={sellMutation.isLoading}
        className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2 transition-colors"
      >
        {sellMutation.isLoading
          ? <>
              <Spinner size="sm" />
              <span>Enregistrement…</span>
            </>
          : `Vendre (${totalPrice} FCFA)`}
      </button>
    </form>
  )
}
