import { useState, useEffect } from 'react'
import api from '../api'

export default function Contabilidad() {
  const [registros, setRegistros] = useState([])
  const [resumen, setResumen] = useState({ ingresos: 0, costos: 0, utilidad: 0 })
  const [loading, setLoading] = useState(true)
  const [clienteId, setClienteId] = useState('')
  const [filterId, setFilterId] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = filterId ? { cliente_id: filterId } : {}
    Promise.all([
      api.get('/api/contabilidad', { params }).then(({ data }) => setRegistros(data)),
      api.get('/api/contabilidad/resumen', { params }).then(({ data }) => setResumen(data)),
    ]).finally(() => setLoading(false))
  }, [filterId])

  const aplicarFiltro = () => setFilterId(clienteId)

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Contabilidad</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', background: '#18181b', borderRadius: 8, border: '1px solid #27272a' }}>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Ingresos totales</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{resumen.ingresos?.toFixed(2) ?? 0}</p>
        </div>
        <div style={{ padding: '1rem', background: '#18181b', borderRadius: 8, border: '1px solid #27272a' }}>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Costos totales</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f87171' }}>{resumen.costos?.toFixed(2) ?? 0}</p>
        </div>
        <div style={{ padding: '1rem', background: '#18181b', borderRadius: 8, border: '1px solid #27272a' }}>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Utilidad neta</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4ade80' }}>{resumen.utilidad?.toFixed(2) ?? 0}</p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input placeholder="Filtrar por cliente_id (opcional)" value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={{ maxWidth: 200 }} />
        <button className="secondary" onClick={aplicarFiltro}>Filtrar</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #27272a' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Cliente</th>
            <th style={{ textAlign: 'left', padding: '0.75rem' }}>Fecha</th>
            <th style={{ textAlign: 'right', padding: '0.75rem' }}>Monto cobrado</th>
            <th style={{ textAlign: 'right', padding: '0.75rem' }}>Costo total</th>
            <th style={{ textAlign: 'right', padding: '0.75rem' }}>Utilidad</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #27272a' }}>
              <td style={{ padding: '0.75rem' }}>{r.cliente_nombre}</td>
              <td style={{ padding: '0.75rem', color: '#71717a' }}>{r.created_at?.slice(0, 10)}</td>
              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{r.monto_cobrado?.toFixed(2)}</td>
              <td style={{ padding: '0.75rem', textAlign: 'right', color: '#f87171' }}>{r.costo_total_generaciones?.toFixed(4)}</td>
              <td style={{ padding: '0.75rem', textAlign: 'right', color: '#4ade80' }}>{r.utilidad?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {registros.length === 0 && <p style={{ color: '#71717a', marginTop: '1rem' }}>No hay registros aún.</p>}
    </div>
  )
}
