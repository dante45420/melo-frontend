import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

export default function ClientesList() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nombre: '', empresa: '', industria: '', descripcion_negocio: '', tono_voz: '', credito_balance: 0 })

  useEffect(() => {
    api.get('/api/clientes').then(({ data }) => setClientes(data)).finally(() => setLoading(false))
  }, [])

  const create = (e) => {
    e.preventDefault()
    api.post('/api/clientes', form).then(({ data }) => {
      setClientes((c) => [data, ...c])
      setModal(false)
      setForm({ nombre: '', empresa: '', industria: '', descripcion_negocio: '', tono_voz: '', credito_balance: 0 })
    })
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Clientes</h1>
        <button className="primary" onClick={() => setModal(true)}>Nuevo cliente</button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {clientes.map((c) => (
          <Link key={c.id} to={`/clientes/${c.id}`} style={{ display: 'block', padding: '1rem', background: '#18181b', borderRadius: 8, border: '1px solid #27272a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{c.nombre}</strong> — {c.empresa || 'Sin empresa'}
              </div>
              <span className={c.credito_balance < 20 ? 'low-credit' : ''}>Créditos: {c.credito_balance}</span>
            </div>
          </Link>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={create} style={{ background: '#18181b', padding: '2rem', borderRadius: 12, minWidth: 320 }}>
            <h3 style={{ marginBottom: '1rem' }}>Nuevo cliente</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              <input placeholder="Empresa" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
              <input placeholder="Industria" value={form.industria} onChange={(e) => setForm({ ...form, industria: e.target.value })} />
              <textarea placeholder="Descripción negocio" value={form.descripcion_negocio} onChange={(e) => setForm({ ...form, descripcion_negocio: e.target.value })} rows={2} />
              <input placeholder="Tono de voz" value={form.tono_voz} onChange={(e) => setForm({ ...form, tono_voz: e.target.value })} />
              <input type="number" placeholder="Créditos iniciales" value={form.credito_balance || ''} onChange={(e) => setForm({ ...form, credito_balance: +e.target.value || 0 })} />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="primary">Crear</button>
              <button type="button" className="secondary" onClick={() => setModal(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
