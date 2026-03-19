import { useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';
const AUTH_TIMEOUT_MS = 25000;

export default function ProtectedAdminRoute() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'unauthorized' | 'timeout'
  const location = useLocation();

  const checkAuth = useCallback(() => {
    setStatus('loading');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AUTH_TIMEOUT_MS);

    fetch(`${API_BASE}/auth/me`, { credentials: 'include', signal: controller.signal })
      .then((res) => {
        clearTimeout(timeout);
        if (res.ok) setStatus('ok');
        else setStatus('unauthorized');
      })
      .catch(() => {
        clearTimeout(timeout);
        setStatus('unauthorized');
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timedOut = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      if (!cancelled) {
        timedOut = true;
        setStatus('timeout');
      }
      controller.abort();
    }, AUTH_TIMEOUT_MS);

    fetch(`${API_BASE}/auth/me`, { credentials: 'include', signal: controller.signal })
      .then((res) => {
        clearTimeout(timeout);
        if (cancelled || timedOut) return;
        if (res.ok) setStatus('ok');
        else setStatus('unauthorized');
      })
      .catch(() => {
        clearTimeout(timeout);
        if (!cancelled && !timedOut) setStatus('unauthorized');
      });
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="admin-auth-loading">
        <div className="admin-auth-spinner" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (status === 'timeout') {
    return (
      <div className="admin-auth-loading">
        <p>El servidor puede estar iniciando. Espera unos segundos e intenta de nuevo.</p>
        <button type="button" className="admin-auth-retry" onClick={checkAuth}>
          Reintentar
        </button>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
