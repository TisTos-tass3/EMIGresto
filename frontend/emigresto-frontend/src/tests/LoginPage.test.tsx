import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import LoginPage from '../pages/LoginPage'

test('affiche erreur si mauvais identifiants', async () => {
  const login = jest.fn(() => Promise.reject({detail:'Bad'}))
  render(
    <AuthContext.Provider value={{login}}>
      <BrowserRouter><LoginPage/></BrowserRouter>
    </AuthContext.Provider>
  )

  fireEvent.change(screen.getByLabelText(/Email/), {target:{value:'x'}})
  fireEvent.change(screen.getByLabelText(/Mot de passe/), {target:{value:'y'}})
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => expect(screen.getByText('Bad')).toBeInTheDocument())
})
