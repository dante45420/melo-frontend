import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../api'

export default function Login() {
  const { setToken } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingHint, setLoadingHint] = useState(false)

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoadingHint(true), 15000)
    return () => clearTimeout(t)
  }, [loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoadingHint(false)
    setLoading(true)
    try {
      console.log('[Melo Login] Enviando POST /api/auth/login')
      const { data } = await api.post('/api/auth/login', { username, password })
      console.log('[Melo Login] OK, token recibido')
      setToken(data.token)
      window.location.href = '/'
    } catch (err) {
      console.error('[Melo Login] catch:', err.code, err.message, err.response?.status, err.response?.data)
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('El servidor tarda en responder. Si usas Render free, espera ~1 min y reintenta.')
      } else if (err.message === 'Network Error') {
        setError('Sin conexión o servidor dormido. Espera 1 min y reintenta.')
      } else {
        setError(err.response?.data?.error || 'Error al iniciar sesión')
      }
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
        {loadingHint && <p style={{ marginBottom: '1rem', fontSize: '0.75rem', color: '#71717a' }}>El servidor puede tardar ~1 min en despertar. Espera...</p>}
        <button type="submit" className="primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
