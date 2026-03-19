import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

export default function AdminLogin() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
      .then((res) => { if (res.ok) navigate('/admin', { replace: true }); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Credenciales incorrectas');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;
  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h1>Melo Admin</h1>
        {error && <div className="admin-login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="user">Usuario</label>
          <input
            id="user"
            name="user"
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            autoComplete="username"
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
