import { useState, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

export default function ProtectedAdminRoute() {
  const [status, setStatus] = useState('loading');
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
      .then((res) => {
        if (cancelled) return;
        setStatus(res.ok ? 'ok' : 'unauthorized');
      })
      .catch(() => {
        if (!cancelled) setStatus('unauthorized');
      });
    return () => { cancelled = true; };
  }, []);

  if (status === 'loading') {
    return (
      <div className="admin-auth-loading">
        <div className="admin-auth-spinner" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
