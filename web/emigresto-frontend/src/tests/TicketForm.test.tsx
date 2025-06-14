import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import TicketForm from '../components/TicketForm'
import { API } from '../services/apiServices'

// mock API
jest.spyOn(API.paiement, 'create').mockResolvedValue({id:1})
jest.spyOn(API.ticket, 'create').mockResolvedValue({id:42})

test('calcule le prix total et vend', async () => {
  const qc = new QueryClient()
  render(
    <QueryClientProvider client={qc}>
      <TicketForm/>
    </QueryClientProvider>
  )
  fireEvent.change(screen.getByLabelText(/Quantité/), {target:{value:'2'}})
  expect(screen.getByText(/Prix total.*160/)).toBeInTheDocument()

  // on simule sélection d'étudiant
  // suppose que StudentSelect est un <select> pour ce test
  fireEvent.change(screen.getByLabelText(/Étudiant/), {target:{value:'1'}})

  fireEvent.click(screen.getByRole('button'))
  // ici tu peux attendre la notification ou l'invalidation de queryClient
})
