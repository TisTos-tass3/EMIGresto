import { Toaster } from 'react-hot-toast'
import TicketForm from '../components/TicketForm'

export default function SellTicket() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Vente de tickets</h1>
        <TicketForm />
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
