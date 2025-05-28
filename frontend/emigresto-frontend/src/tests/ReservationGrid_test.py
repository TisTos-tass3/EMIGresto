// src/components/__tests__/ReservationGrid.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReservationGrid from '../ReservationGrid'
import { API } from '../../services/apiServices'
jest.mock('../../services/apiServices')

const qc = new QueryClient()
const Wrapper = ({ children }) => (
  <QueryClientProvider client={qc}>{children}</QueryClientProvider>
)

beforeEach(() => {
  API.etudiant.list.mockResolvedValue({
    results: [{ id:1, nom:'Dupont', prenom:'Jean' }]
  })
  API.jour.list.mockResolvedValue({ results:[{ id:10, nomJour:'Lundi' }] })
  API.periode.list.mockResolvedValue({ results:[{ id:100, nomPeriode:'Midi' }] })
  API.reservation.list.mockResolvedValue({ results:[] })
  API.reservation.create.mockResolvedValue({ id: 5 })
})

test('affiche une case cochable et crée une reservation', async () => {
  render(<ReservationGrid />, { wrapper: Wrapper })
  // attend que tout soit chargé
  await waitFor(() => screen.getByText('Dupont'))
  const checkbox = screen.getByRole('checkbox')
  expect(checkbox).not.toBeChecked()
  fireEvent.click(checkbox)
  await waitFor(() => expect(API.reservation.create).toHaveBeenCalledWith({
    etudiant:1, jour:10, periode:100
  }))
})
