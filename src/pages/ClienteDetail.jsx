import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

export default function ClienteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [prompts, setPrompts] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [generaciones, setGeneraciones] = useState([])
  const [instancias, setInstancias] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackText, setFeedbackText] = useState('')
  const [recargaModal, setRecargaModal] = useState(false)
  const [recargaMonto, setRecargaMonto] = useState('')
  const [recargaNota, setRecargaNota] = useState('')
  const [promptModal, setPromptModal] = useState(false)
  const [promptTipo, setPromptTipo] = useState('imagen')
  const [promptContexto, setPromptContexto] = useState('')
  const [promptGenerado, setPromptGenerado] = useState(null)
  const [promptError, setPromptError] = useState('')
  const [promptLoading, setPromptLoading] = useState(false)
  const [mediaModal, setMediaModal] = useState(false)
  const [mediaTipo, setMediaTipo] = useState('imagen')
  const [mediaPrompt, setMediaPrompt] = useState('')
  const [mediaInstanciaId, setMediaInstanciaId] = useState(null)
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaResult, setMediaResult] = useState(null)

  const load = () => {
    return Promise.all([
      api.get(`/api/clientes/${id}`).then(({ data }) => setCliente(data)),
      api.get(`/api/clientes/${id}/prompts`).then(({ data }) => setPrompts(data)),
      api.get(`/api/clientes/${id}/feedback`).then(({ data }) => setFeedbacks(data)),
      api.get(`/api/clientes/${id}/generaciones`).then(({ data }) => setGeneraciones(data)),
      api.get(`/api/clientes/${id}/instancias`).then(({ data }) => setInstancias(data)),
    ])
  }

  useEffect(() => {
    setLoading(true)
    load().finally(() => setLoading(false))
  }, [id])

  const aplicarFeedback = (fid) => {
    api.put(`/api/clientes/${id}/feedback/${fid}/aplicar`).then(({ data }) => {
      setCliente(data)
      load()
    })
  }

  const recargarCredito = (e) => {
    e.preventDefault()
    api.post(`/api/clientes/${id}/recargar-credito`, { monto: +recargaMonto, nota: recargaNota }).then(({ data }) => {
      setCliente(data)
      setRecargaModal(false)
      setRecargaMonto('')
      setRecargaNota('')
    })
  }

  const generarPrompt = (e) => {
    e.preventDefault()
    setPromptError('')
    setPromptLoading(true)
    api.post(`/api/clientes/${id}/generar-prompt`, { tipo: promptTipo, contexto: promptContexto })
      .then(({ data }) => {
        setPromptGenerado(data)
        load()
      })
      .catch((err) => setPromptError(err.response?.data?.error || 'Error al generar prompt'))
      .finally(() => setPromptLoading(false))
  }

  const generarMedia = (e) => {
    e.preventDefault()
    setMediaLoading(true)
    const body = { tipo: mediaTipo, prompt: mediaPrompt }
    if (mediaInstanciaId) body.instancia_id = +mediaInstanciaId
    api.post(`/api/clientes/${id}/generar-media`, body)
      .then(({ data }) => {
        setMediaResult(data)
        load()
      })
      .finally(() => setMediaLoading(false))
  }

  const aprobarGeneracion = (gid) => {
    if (!confirm('¿Aprobar esta generación? Se descontarán créditos del cliente.')) return
    api.post(`/api/clientes/${id}/generaciones/${gid}/aprobar`).then(({ data }) => {
      setCliente(data.cliente)
      load()
    }).catch((err) => alert(err.response?.data?.error || 'Error'))
  }

  const subirFeedback = (e) => {
    e.preventDefault()
    api.post(`/api/clientes/${id}/feedback`, { contenido: feedbackText }).then(() => {
      setFeedbackText('')
      load()
    })
  }

  if (loading || !cliente) return <p>Cargando...</p>

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="secondary" onClick={() => navigate('/')}>← Volver</button>
        <div>
          <span className={cliente.credito_balance < 20 ? 'low-credit' : ''} style={{ marginRight: '1rem', fontWeight: 600 }}>Créditos: {cliente.credito_balance}</span>
          <button className="primary" onClick={() => setRecargaModal(true)}>Agregar crédito</button>
        </div>
      </div>

      <h1 style={{ marginBottom: '0.5rem' }}>{cliente.nombre}</h1>
      <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>{cliente.empresa} · {cliente.industria}</p>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Info general</h3>
        <div style={{ background: '#18181b', padding: '1rem', borderRadius: 8 }}>
          <p><strong>Tono:</strong> {cliente.tono_voz || '—'}</p>
          <p><strong>Colores:</strong> {cliente.colores_preferidos || '—'}</p>
          <p><strong>Descripción:</strong> {cliente.descripcion_negocio || '—'}</p>
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Generar prompt</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="secondary" onClick={() => { setPromptModal(true); setPromptGenerado(null); setPromptError(''); }}>Prompt para imagen</button>
          <button className="secondary" onClick={() => { setPromptModal(true); setPromptTipo('video'); setPromptGenerado(null); setPromptError(''); }}>Prompt para video</button>
        </div>
        {promptGenerado && (
          <div style={{ marginTop: '1rem', background: '#18181b', padding: '1rem', borderRadius: 8 }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#71717a' }}>Prompt generado:</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{promptGenerado.contenido}</p>
            <button className="primary" style={{ marginTop: '0.5rem' }} onClick={() => { setMediaModal(true); setMediaPrompt(promptGenerado.contenido); }}>Generar imagen/video con este prompt</button>
          </div>
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Generar media</h3>
        <button className="secondary" onClick={() => { setMediaModal(true); setMediaPrompt(''); setMediaResult(null); }}>Generar imagen / carrusel / video</button>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Generaciones recientes</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {generaciones.slice(0, 12).map((g) => (
            <div key={g.id} style={{ background: '#18181b', borderRadius: 8, overflow: 'hidden', border: '1px solid #27272a' }}>
              {g.url_asset ? (
                <img src={g.url_asset} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', aspectRatio: '1', background: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a' }}>Video</div>
              )}
              <div style={{ padding: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>{g.tipo} · ${g.costo_usd?.toFixed(4)}</span>
                {g.estado === 'pendiente' && (
                  <button className="primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.25rem' }} onClick={() => aprobarGeneracion(g.id)}>Aprobar</button>
                )}
                {g.estado === 'aprobada' && <span className="success" style={{ fontSize: '0.75rem' }}>Aprobada</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Feedback del cliente</h3>
        <form onSubmit={subirFeedback} style={{ marginBottom: '1rem' }}>
          <textarea placeholder="Escribe el feedback del cliente..." value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} rows={2} style={{ width: '100%', marginBottom: '0.5rem' }} />
          <button type="submit" className="primary">Subir feedback</button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {feedbacks.map((f) => (
            <div key={f.id} style={{ padding: '0.75rem', background: '#18181b', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{f.contenido}</span>
              {!f.aplicado && <button className="secondary" onClick={() => aplicarFeedback(f.id)}>Aplicar al perfil</button>}
              {f.aplicado && <span className="success">Aplicado</span>}
            </div>
          ))}
        </div>
      </section>

      {recargaModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={recargarCredito} style={{ background: '#18181b', padding: '2rem', borderRadius: 12 }}>
            <h3 style={{ marginBottom: '1rem' }}>Agregar crédito</h3>
            <input type="number" placeholder="Monto" value={recargaMonto} onChange={(e) => setRecargaMonto(e.target.value)} required style={{ marginBottom: '0.5rem', width: '100%' }} />
            <input placeholder="Nota (opcional)" value={recargaNota} onChange={(e) => setRecargaNota(e.target.value)} style={{ width: '100%', marginBottom: '1rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="primary">Añadir</button>
              <button type="button" className="secondary" onClick={() => setRecargaModal(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {promptModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={generarPrompt} style={{ background: '#18181b', padding: '2rem', borderRadius: 12, minWidth: 400 }}>
            <h3 style={{ marginBottom: '1rem' }}>Generar prompt para {promptTipo}</h3>
            <textarea placeholder="Contexto adicional (opcional)" value={promptContexto} onChange={(e) => setPromptContexto(e.target.value)} rows={3} style={{ width: '100%', marginBottom: '1rem' }} />
            {promptError && <p className="error" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>{promptError}</p>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="primary" disabled={promptLoading}>{promptLoading ? 'Generando...' : 'Generar'}</button>
              <button type="button" className="secondary" onClick={() => setPromptModal(false)}>Cerrar</button>
            </div>
          </form>
        </div>
      )}

      {mediaModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={generarMedia} style={{ background: '#18181b', padding: '2rem', borderRadius: 12, minWidth: 400 }}>
            <h3 style={{ marginBottom: '1rem' }}>Generar {mediaTipo}</h3>
            <select value={mediaTipo} onChange={(e) => setMediaTipo(e.target.value)} style={{ width: '100%', marginBottom: '0.5rem' }}>
              <option value="imagen">Imagen</option>
              <option value="carrusel">Carrusel</option>
              <option value="video">Video</option>
            </select>
            <textarea placeholder="Prompt" value={mediaPrompt} onChange={(e) => setMediaPrompt(e.target.value)} rows={4} required style={{ width: '100%', marginBottom: '1rem' }} />
            {mediaLoading && <p style={{ marginBottom: '0.5rem' }}>Generando...</p>}
            {mediaResult && (
              <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#27272a', borderRadius: 6 }}>
                <p className="success">Listo. Costo: ${mediaResult.costo_usd?.toFixed(4)}</p>
                {mediaResult.url && <a href={mediaResult.url} target="_blank" rel="noreferrer">Ver resultado</a>}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="primary" disabled={mediaLoading}>Generar</button>
              <button type="button" className="secondary" onClick={() => { setMediaModal(false); setMediaResult(null); }}>Cerrar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
