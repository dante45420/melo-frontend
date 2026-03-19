import { LogOut } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Header() {
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ''}/api/auth/logout`, { credentials: 'include' });
    } catch (_) {}
    window.location.href = '/admin/login';
  };

  return (
    <header className="admin-header">
      <div className="header-spacer" />
      <a href="/admin/login" onClick={handleLogout} className="header-logout">
        <LogOut size={18} />
        Cerrar sesión
      </a>
    </header>
  );
}
