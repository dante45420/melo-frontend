import { useState, useEffect } from 'react'
import api from '../api'

export default function Configuracion() {
  const [defaults, setDefaults] = useState({ prompt: '', imagen: '', video_t2v: '', video_i2v: '' })
  const [openrouterModels, setOpenrouterModels] = useState([])
  const [falImagenModels, setFalImagenModels] = useState([])
  const [falVideoT2VModels, setFalVideoT2VModels] = useState([])
  const [falVideoI2VModels, setFalVideoI2VModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [modelsLoading, setModelsLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/api/modelos/default').then(({ data }) => setDefaults(data)).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const load = async () => {
      setModelsLoading(true)
      try {
        const [or, img, t2v, i2v] = await Promise.all([
          api.get('/api/modelos/openrouter').then((r) => r.data.models || []),
          api.get('/api/modelos/fal?category=text-to-image').then((r) => r.data.models || []),
          api.get('/api/modelos/fal?category=text-to-video').then((r) => r.data.models || []),
          api.get('/api/modelos/fal?category=image-to-video').then((r) => r.data.models || []),
        ])
        setOpenrouterModels(or)
        setFalImagenModels(img)
        setFalVideoT2VModels(t2v)
        setFalVideoI2VModels(i2v)
      } catch (e) {
        console.error('Error cargando modelos:', e)
      } finally {
        setModelsLoading(false)
      }
    }
    load()
  }, [])

  const save = (e) => {
    e.preventDefault()
    api.put('/api/modelos/default', defaults).then(({ data }) => {
      setDefaults(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  if (loading) return <p>Cargando...</p>

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>Modelos por defecto</h1>
      <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>
        Selecciona los modelos que se usarán al generar prompts, imágenes y videos. Puedes cambiarlos para cada generación desde el detalle del cliente.
      </p>

      <form onSubmit={save} style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <label>
            <span style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Prompt (OpenRouter)</span>
            <select
              value={defaults.prompt || ''}
              onChange={(e) => setDefaults({ ...defaults, prompt: e.target.value })}
              style={{ width: '100%', padding: '0.5rem' }}
              disabled={modelsLoading}
            >
              <option value="">— Seleccionar —</option>
              {defaults.prompt && !openrouterModels.some((m) => m.id === defaults.prompt) && (
                <option value={defaults.prompt}>{defaults.prompt}</option>
              )}
              {openrouterModels.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Imagen (fal.ai text-to-image)</span>
            <select
              value={defaults.imagen || ''}
              onChange={(e) => setDefaults({ ...defaults, imagen: e.target.value })}
              style={{ width: '100%', padding: '0.5rem' }}
              disabled={modelsLoading}
            >
              <option value="">— Seleccionar —</option>
              {defaults.imagen && !falImagenModels.some((m) => m.id === defaults.imagen) && (
                <option value={defaults.imagen}>{defaults.imagen}</option>
              )}
              {falImagenModels.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Video texto→video (fal.ai text-to-video)</span>
            <select
              value={defaults.video_t2v || ''}
              onChange={(e) => setDefaults({ ...defaults, video_t2v: e.target.value })}
              style={{ width: '100%', padding: '0.5rem' }}
              disabled={modelsLoading}
            >
              <option value="">— Seleccionar —</option>
              {defaults.video_t2v && !falVideoT2VModels.some((m) => m.id === defaults.video_t2v) && (
                <option value={defaults.video_t2v}>{defaults.video_t2v}</option>
              )}
              {falVideoT2VModels.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>Video imagen→video (fal.ai image-to-video)</span>
            <select
              value={defaults.video_i2v || ''}
              onChange={(e) => setDefaults({ ...defaults, video_i2v: e.target.value })}
              style={{ width: '100%', padding: '0.5rem' }}
              disabled={modelsLoading}
            >
              <option value="">— Seleccionar —</option>
              {defaults.video_i2v && !falVideoI2VModels.some((m) => m.id === defaults.video_i2v) && (
                <option value={defaults.video_i2v}>{defaults.video_i2v}</option>
              )}
              {falVideoI2VModels.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button type="submit" className="primary" disabled={modelsLoading}>Guardar modelos por defecto</button>
          {saved && <span className="success">Guardado</span>}
        </div>
      </form>

      {modelsLoading && <p style={{ marginTop: '0.5rem', color: '#71717a', fontSize: '0.875rem' }}>Cargando opciones de modelos...</p>}
    </div>
  )
}
