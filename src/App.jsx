import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import ClientesList from './pages/ClientesList'
import ClienteDetail from './pages/ClienteDetail'
import Contabilidad from './pages/Contabilidad'
import Precios from './pages/Precios'

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  if (!token) return <Navigate to="/login" replace />
  return children
}

function Layout() {
  const { logout } = useAuth()
  return (
    <>
      <nav style={{
        padding: '0.75rem 2rem',
        borderBottom: '1px solid #27272a',
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
          <img src="/Logo.png" alt="Melo" style={{ height: 32, width: 32, borderRadius: 6 }} />
          <strong style={{ fontSize: '1.125rem' }}>Melo</strong>
        </NavLink>
        <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#a78bfa' : '#71717a', textDecoration: 'none' })}>Clientes</NavLink>
        <NavLink to="/contabilidad" style={({ isActive }) => ({ color: isActive ? '#a78bfa' : '#71717a', textDecoration: 'none' })}>Contabilidad</NavLink>
        <NavLink to="/precios" style={({ isActive }) => ({ color: isActive ? '#a78bfa' : '#71717a', textDecoration: 'none' })}>Precios</NavLink>
        <div style={{ marginLeft: 'auto' }}>
          <button type="button" className="secondary" onClick={logout}>Salir</button>
        </div>
      </nav>
      <main style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <Outlet />
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<ClientesList />} />
            <Route path="clientes/:id" element={<ClienteDetail />} />
            <Route path="contabilidad" element={<Contabilidad />} />
            <Route path="precios" element={<Precios />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
