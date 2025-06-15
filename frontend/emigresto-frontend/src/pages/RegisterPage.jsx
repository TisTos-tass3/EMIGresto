// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const [form, setForm] = useState({ email:'', nom:'', prenom:'', password:'', telephone:'' })
  const [error, setError] = useState(null)
  const nav = useNavigate()

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await register(form)
      nav('/login')
    } catch (e) {
      setError(JSON.stringify(e))
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-4">Inscription</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['email','nom','prenom','telephone','password'].map(field => (
          <div key={field}>
            <label className="block mb-1">{field}</label>
            <input
              name={field}
              type={field==='password' ? 'password' : 'text'}
              className="w-full border px-3 py-2 rounded"
              value={form[field]}
              onChange={handleChange}
              required={field!=='telephone'}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          S’inscrire
        </button>
      </form>
      <p className="mt-4 text-sm">
        Déjà inscrit ?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Connexion
        </Link>
      </p>
    </div>
  )
}
