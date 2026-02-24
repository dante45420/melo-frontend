import { useState, useEffect } from 'react'
import api from '../api'

export default function Precios() {
  const [precios, setPrecios] = useState({ imagen: 0, carrusel: 0, video: 0 })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/api/precios').then(({ data }) => setPrecios(data)).finally(() => setLoading(false))
  }, [])

  const save = (e) => {
    e.preventDefault()
    api.put('/api/precios', precios).then(({ data }) => {
      setPrecios(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>Precios</h1>
      <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>Créditos que se descontarán al aprobar cada tipo de contenido.</p>

      <form onSubmit={save} style={{ maxWidth: 400 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>
            <span style={{ display: 'block', marginBottom: '0.25rem' }}>Imagen</span>
            <input type="number" min={0} step={1} value={precios.imagen || ''} onChange={(e) => setPrecios({ ...precios, imagen: +e.target.value || 0 })} />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.25rem' }}>Carrusel</span>
            <input type="number" min={0} step={1} value={precios.carrusel || ''} onChange={(e) => setPrecios({ ...precios, carrusel: +e.target.value || 0 })} />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.25rem' }}>Video</span>
            <input type="number" min={0} step={1} value={precios.video || ''} onChange={(e) => setPrecios({ ...precios, video: +e.target.value || 0 })} />
          </label>
        </div>
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="submit" className="primary">Guardar</button>
          {saved && <span className="success">Guardado</span>}
        </div>
      </form>
    </div>
  )
}
