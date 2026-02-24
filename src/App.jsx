import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import ClientesList from './pages/ClientesList'
import ClienteDetail from './pages/ClienteDetail'
import Contabilidad from './pages/Contabilidad'
import Precios from './pages/Precios'

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid #27272a', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <strong style={{ fontSize: '1.25rem' }}>Melo</strong>
        <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#a78bfa' : '#71717a' })}>Clientes</NavLink>
        <NavLink to="/contabilidad" style={({ isActive }) => ({ color: isActive ? '#a78bfa' : '#71717a' })}>Contabilidad</NavLink>
        <NavLink to="/precios" style={({ isActive }) => ({ color: isActive ? '#a78bfa' : '#71717a' })}>Precios</NavLink>
      </nav>
      <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<ClientesList />} />
          <Route path="/clientes/:id" element={<ClienteDetail />} />
          <Route path="/contabilidad" element={<Contabilidad />} />
          <Route path="/precios" element={<Precios />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
