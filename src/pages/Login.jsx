import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../api'

export default function Login() {
  const { setToken } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', { username, password })
      setToken(data.token)
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <img src="/Logo.png" alt="Melo" style={{ width: 80, height: 80, marginBottom: '1.5rem', borderRadius: 8 }} />
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Melo</h1>
      <p style={{ color: '#71717a', marginBottom: '2rem', fontSize: '0.875rem' }}>Acceso restringido</p>

      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: 320,
        background: '#18181b',
        padding: '2rem',
        borderRadius: 12,
        border: '1px solid #27272a',
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin"
            required
            autoComplete="username"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            style={{ width: '100%' }}
          />
        </div>
        {error && <p className="error" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}
        <button type="submit" className="primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
