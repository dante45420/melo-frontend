import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Package,
  Wallet,
  BarChart3,
} from 'lucide-react';

const nav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/subscriptions', icon: CreditCard, label: 'Suscripciones' },
  { to: '/admin/clients', icon: Users, label: 'Clientes' },
  { to: '/admin/deliveries', icon: Package, label: 'Entregas' },
  { to: '/admin/accounting', icon: Wallet, label: 'Contabilidad' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">Melo</span>
        <span className="sidebar-sublabel">Admin</span>
      </div>
      <nav className="sidebar-nav">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
