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
  const [promptChatMessages, setPromptChatMessages] = useState([])
  const [promptUserInput, setPromptUserInput] = useState('')
  const [promptGenerado, setPromptGenerado] = useState(null)
  const [promptError, setPromptError] = useState('')
  const [promptLoading, setPromptLoading] = useState(false)
  const [mediaModal, setMediaModal] = useState(false)
  const [mediaTipo, setMediaTipo] = useState('imagen')
  const [mediaPrompt, setMediaPrompt] = useState('')
  const [mediaInstanciaId, setMediaInstanciaId] = useState(null)
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaResult, setMediaResult] = useState(null)
  const [mediaError, setMediaError] = useState('')
  const [modelosDefault, setModelosDefault] = useState({})
  const [openrouterModels, setOpenrouterModels] = useState([])
  const [falImagenModels, setFalImagenModels] = useState([])
  const [falImagenEditModels, setFalImagenEditModels] = useState([])
  const [falVideoT2VModels, setFalVideoT2VModels] = useState([])
  const [falVideoI2VModels, setFalVideoI2VModels] = useState([])
  const [promptModelOverride, setPromptModelOverride] = useState('')
  const [mediaModelOverride, setMediaModelOverride] = useState('')
  const [mediaModelEditOverride, setMediaModelEditOverride] = useState('')
  const [mediaModelT2VOverride, setMediaModelT2VOverride] = useState('')
  const [mediaModelI2VOverride, setMediaModelI2VOverride] = useState('')
  const [mediaModoImagen, setMediaModoImagen] = useState('generar')
  const [mediaImageUrls, setMediaImageUrls] = useState('')
  const [mediaDuration, setMediaDuration] = useState(10)
  const [mediaImageUrlStart, setMediaImageUrlStart] = useState('')
  const [rechazarModal, setRechazarModal] = useState(null)
  const [rechazarMotivo, setRechazarMotivo] = useState('')
  const [verEstructuraPrompt, setVerEstructuraPrompt] = useState(false)
  const [mediaImageUrlEnd, setMediaImageUrlEnd] = useState('')
  const [mediaUploading, setMediaUploading] = useState(false)

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

  useEffect(() => {
    const procesando = generaciones.filter((g) => g.estado === 'procesando')
    if (procesando.length > 0 && id) {
      const gid = procesando[0].id
      const t = setInterval(() => {
        api.get(`/api/clientes/${id}/generaciones/${gid}/result`).then((res) => {
          if (res.status !== 202) load()
        }).catch(() => {})
      }, 8000)
      return () => clearInterval(t)
    }
  }, [generaciones, id])

  useEffect(() => {
    Promise.all([
      api.get('/api/modelos/default').then(({ data }) => setModelosDefault(data)),
      api.get('/api/modelos/openrouter').then(({ data }) => setOpenrouterModels(data.models || [])),
      api.get('/api/modelos/fal?category=text-to-image').then(({ data }) => setFalImagenModels(data.models || [])),
      api.get('/api/modelos/fal?category=image-to-image').then(({ data }) => setFalImagenEditModels(data.models || [])),
      api.get('/api/modelos/fal?category=text-to-video').then(({ data }) => setFalVideoT2VModels(data.models || [])),
      api.get('/api/modelos/fal?category=image-to-video').then(({ data }) => setFalVideoI2VModels(data.models || [])),
    ]).catch(() => {})
  }, [])

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

  const enviarPromptChat = (solicitarFinal = false) => {
    setPromptError('')
    setPromptLoading(true)
    const userMsg = solicitarFinal ? '' : promptUserInput.trim()
    const body = {
      tipo: promptTipo,
      contexto: promptContexto || undefined,
      messages: userMsg ? [...promptChatMessages, { role: 'user', content: userMsg }] : promptChatMessages,
      solicitar_prompt_final: solicitarFinal,
    }
    if (promptModelOverride) body.modelo = promptModelOverride
    if (verEstructuraPrompt) body.ver_estructura = true
    if (userMsg) {
      setPromptUserInput('')
      setPromptChatMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    }
    api.post(`/api/clientes/${id}/generar-prompt`, body)
      .then(({ data }) => {
        if (solicitarFinal || data.es_prompt_final) {
          setPromptGenerado(data)
          load()
        } else {
          setPromptChatMessages((prev) => [...prev, { role: 'assistant', content: data.contenido }])
        }
      })
      .catch((err) => {
        if (userMsg) {
          setPromptChatMessages((prev) => prev.slice(0, -1))
          setPromptUserInput(userMsg)
        }
        setPromptError(err.response?.data?.error || 'Error al generar prompt')
      })
      .finally(() => setPromptLoading(false))
  }

  const iniciarPromptChat = (e) => {
    e.preventDefault()
    setPromptChatMessages([])
    setPromptGenerado(null)
    enviarPromptChat(false)
  }

  const generarMedia = (e) => {
    e.preventDefault()
    setMediaError('')
    if (mediaTipo === 'imagen' && mediaModoImagen === 'editar' && !mediaImageUrls.trim()) {
      setMediaError('En modo editar debes indicar al menos una URL de imagen.')
      return
    }
    setMediaLoading(true)
    const body = { tipo: mediaTipo, prompt: mediaPrompt }
    if (mediaInstanciaId) body.instancia_id = +mediaInstanciaId
    if (mediaTipo === 'imagen' || mediaTipo === 'carrusel') {
      if (mediaTipo === 'imagen' && mediaModoImagen === 'editar') {
        if (mediaModelEditOverride) body.modelo = mediaModelEditOverride
        if (mediaImageUrls.trim()) body.image_urls = mediaImageUrls.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean)
      } else if (mediaModelOverride) body.modelo = mediaModelOverride
    } else if (mediaTipo === 'video') {
      if (mediaModelT2VOverride) body.modelo_t2v = mediaModelT2VOverride
      if (mediaModelI2VOverride) body.modelo_i2v = mediaModelI2VOverride
      body.duration = mediaDuration
      if (mediaImageUrlStart.trim()) body.image_url = mediaImageUrlStart.trim()
      if (mediaImageUrlEnd.trim()) body.tail_image_url = mediaImageUrlEnd.trim()
    }
    api.post(`/api/clientes/${id}/generar-media`, body)
      .then((res) => {
        const { data, status } = res
        if (status === 202 && data?.status === 'procesando' && data?.generacion_id) {
          pollVideoResult(data.generacion_id)
        } else {
          setMediaResult(data)
          load()
          setMediaLoading(false)
        }
      })
      .catch((err) => {
        setMediaError(err.response?.data?.error || 'Error al generar media')
        setMediaLoading(false)
      })
  }

  const pollVideoResult = (gid, attempt = 0) => {
    const maxAttempts = 72
    if (attempt >= maxAttempts) {
      setMediaError('El video tardó demasiado. Revisa la lista de generaciones.')
      setMediaLoading(false)
      load()
      return
    }
    api.get(`/api/clientes/${id}/generaciones/${gid}/result`)
      .then((res) => {
        const { data, status } = res
        if (status === 202) {
          setTimeout(() => pollVideoResult(gid, attempt + 1), 5000)
        } else {
          setMediaResult(data)
          load()
          setMediaLoading(false)
        }
      })
      .catch((err) => {
        setMediaError(err.response?.data?.error || 'Error al obtener resultado')
        setMediaLoading(false)
      })
  }

  const subirImagenes = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    setMediaUploading(true)
    try {
      const form = new FormData()
      for (let i = 0; i < files.length; i++) form.append('images', files[i])
      const { data } = await api.post('/api/upload', form)
      const urls = data.urls || []
      if (mediaTipo === 'imagen' && mediaModoImagen === 'editar') {
        setMediaImageUrls((prev) => [...prev.split(/[\n,]+/).map((u) => u.trim()).filter(Boolean), ...urls].join('\n'))
      } else if (mediaTipo === 'video') {
        if (urls[0]) setMediaImageUrlStart(urls[0])
        if (urls[1]) setMediaImageUrlEnd(urls[1])
      }
    } catch (err) {
      setMediaError(err.response?.data?.error || 'Error subiendo imágenes')
    } finally {
      setMediaUploading(false)
      e.target.value = ''
    }
  }

  const aprobarGeneracion = (gid) => {
    if (!confirm('¿Aprobar esta generación? Se descontarán créditos del cliente.')) return
    api.post(`/api/clientes/${id}/generaciones/${gid}/aprobar`).then(({ data }) => {
      setCliente(data.cliente)
      load()
    }).catch((err) => alert(err.response?.data?.error || 'Error'))
  }

  const abrirRechazar = (g) => {
    setRechazarModal(g)
    setRechazarMotivo('')
  }

  const rechazarGeneracion = (e) => {
    e.preventDefault()
    if (!rechazarModal) return
    api.post(`/api/clientes/${id}/generaciones/${rechazarModal.id}/rechazar`, { motivo: rechazarMotivo }).then(({ data }) => {
      setCliente(data.cliente)
      setRechazarModal(null)
      setRechazarMotivo('')
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
          <button className="secondary" onClick={() => { setPromptModal(true); setPromptTipo('imagen'); setPromptChatMessages([]); setPromptGenerado(null); setPromptError(''); }}>Prompt para imagen</button>
          <button className="secondary" onClick={() => { setPromptModal(true); setPromptTipo('video'); setPromptChatMessages([]); setPromptGenerado(null); setPromptError(''); }}>Prompt para video</button>
        </div>
        {promptGenerado && (
          <div style={{ marginTop: '1rem', background: '#18181b', padding: '1rem', borderRadius: 8 }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#71717a' }}>Prompt generado:</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{promptGenerado.contenido}</p>
            {promptGenerado.modelo && <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>Modelo: {promptGenerado.modelo}</p>}
            {promptGenerado.estructura && (
              <details style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                <summary style={{ cursor: 'pointer', color: '#71717a' }}>Estructura enviada a OpenRouter</summary>
                <pre style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#27272a', borderRadius: 6, overflow: 'auto', maxHeight: 300, whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                  {JSON.stringify(promptGenerado.estructura, null, 2)}
                </pre>
              </details>
            )}
            <button className="primary" style={{ marginTop: '0.5rem' }} onClick={() => { setMediaModal(true); setMediaPrompt(promptGenerado.contenido); setMediaError(''); }}>Generar imagen/video con este prompt</button>
          </div>
        )}
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Generar media</h3>
        <button className="secondary" onClick={() => { setMediaModal(true); setMediaPrompt(''); setMediaResult(null); setMediaError(''); }}>Generar imagen / carrusel / video</button>
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
                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>{g.tipo} · {g.estado === 'procesando' ? 'Generando...' : `$${g.costo_usd?.toFixed(4)}`}</span>
                {g.estado === 'procesando' && <span style={{ fontSize: '0.75rem', color: '#a78bfa' }}>Video en proceso</span>}
                {g.estado === 'pendiente' && (
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexDirection: 'column' }}>
                    <button className="primary" style={{ padding: '0.25rem' }} onClick={() => aprobarGeneracion(g.id)}>Aprobar</button>
                    <button className="secondary" style={{ padding: '0.25rem', fontSize: '0.8rem' }} onClick={() => abrirRechazar(g)}>Rechazar</button>
                  </div>
                )}
                {g.estado === 'aprobada' && <span className="success" style={{ fontSize: '0.75rem' }}>Aprobada</span>}
                {g.estado === 'rechazada' && (
                  <div style={{ fontSize: '0.75rem', color: '#f87171' }}>
                    <span>Rechazada</span>
                    {g.motivo_rechazo && <p style={{ marginTop: '0.25rem', fontSize: '0.7rem', color: '#a1a1aa' }}>{g.motivo_rechazo}</p>}
                  </div>
                )}
                {g.url_asset && (
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem', flexDirection: 'column' }}>
                    <button className="secondary" style={{ padding: '0.25rem', fontSize: '0.7rem' }} onClick={() => { setMediaModal(true); setMediaImageUrlStart(g.url_asset); setMediaTipo('video'); }}>Usar para video</button>
                    {g.tipo === 'imagen' && (
                      <button className="secondary" style={{ padding: '0.25rem', fontSize: '0.7rem' }} onClick={() => { setMediaModal(true); setMediaImageUrls(g.url_asset); setMediaModoImagen('editar'); setMediaTipo('imagen'); }}>Usar para editar</button>
                    )}
                  </div>
                )}
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

      {rechazarModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={rechazarGeneracion} style={{ background: '#18181b', padding: '2rem', borderRadius: 12, minWidth: 400 }}>
            <h3 style={{ marginBottom: '1rem' }}>Rechazar generación</h3>
            <p style={{ fontSize: '0.875rem', color: '#71717a', marginBottom: '1rem' }}>Indica por qué se rechaza (se usará para mejorar el próximo prompt):</p>
            <textarea value={rechazarMotivo} onChange={(e) => setRechazarMotivo(e.target.value)} placeholder="Ej: Colores muy oscuros, la composición no es buena..." rows={3} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="secondary" style={{ color: '#f87171' }}>Rechazar</button>
              <button type="button" className="secondary" onClick={() => { setRechazarModal(null); setRechazarMotivo(''); }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

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
          <div style={{ background: '#18181b', padding: '1.5rem', borderRadius: 12, minWidth: 480, maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem' }}>Prompt para {promptTipo}</h3>
            <p style={{ fontSize: '0.875rem', color: '#71717a', marginBottom: '1rem' }}>La IA te hará preguntas para afinar el prompt. Responde en lenguaje natural y cuando estés listo pide el prompt final.</p>
            {promptChatMessages.length === 0 && !promptGenerado && (
              <form onSubmit={iniciarPromptChat} style={{ marginBottom: '1rem' }}>
                {promptLoading && <p style={{ marginBottom: '0.5rem', color: '#71717a' }}>La IA está preparando sus preguntas...</p>}
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Contexto inicial (opcional)</span>
                  <textarea placeholder="Ej: ventas de verano, 60% descuento, usar modelo..." value={promptContexto} onChange={(e) => setPromptContexto(e.target.value)} rows={2} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input type="checkbox" checked={verEstructuraPrompt} onChange={(e) => setVerEstructuraPrompt(e.target.checked)} />
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Ver qué se envía a OpenRouter</span>
                </label>
                <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Modelo</span>
                  <select value={promptModelOverride} onChange={(e) => setPromptModelOverride(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }}>
                    <option value="">{modelosDefault.prompt || 'gpt-4o-mini'}</option>
                    {openrouterModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </label>
                <button type="submit" className="primary" disabled={promptLoading}>{promptLoading ? 'Iniciando...' : 'Iniciar conversación'}</button>
              </form>
            )}
            {promptChatMessages.length > 0 && !promptGenerado && (
              <div style={{ flex: 1, overflow: 'auto', marginBottom: '1rem', maxHeight: 280 }}>
                {promptLoading && <p style={{ marginBottom: '0.5rem', color: '#71717a', fontSize: '0.875rem' }}>Pensando...</p>}
                {promptChatMessages.map((m, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                    <span style={{ fontSize: '0.7rem', color: '#71717a', display: 'block', marginBottom: '0.25rem' }}>{m.role === 'user' ? 'Tú' : 'IA'}</span>
                    <div style={{ display: 'inline-block', padding: '0.5rem 0.75rem', borderRadius: 8, background: m.role === 'user' ? '#3b82f6' : '#27272a', maxWidth: '90%', whiteSpace: 'pre-wrap', textAlign: 'left' }}>{m.content}</div>
                  </div>
                ))}
              </div>
            )}
            {promptChatMessages.length > 0 && !promptGenerado && (
              <form onSubmit={(e) => { e.preventDefault(); enviarPromptChat(false); }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input value={promptUserInput} onChange={(e) => setPromptUserInput(e.target.value)} placeholder="Responde aquí en lenguaje natural..." style={{ flex: 1, padding: '0.5rem' }} disabled={promptLoading} />
                <button type="submit" className="secondary" disabled={promptLoading || !promptUserInput.trim()}>Enviar</button>
                <button type="button" className="primary" onClick={() => enviarPromptChat(true)} disabled={promptLoading}>Obtener prompt final</button>
              </form>
            )}
            {promptGenerado && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#27272a', borderRadius: 8 }}>
                <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#71717a' }}>Prompt generado:</p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{promptGenerado.contenido}</p>
                {promptGenerado.modelo && <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>Modelo: {promptGenerado.modelo}</p>}
                {promptGenerado.estructura && (
                  <details style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                    <summary style={{ cursor: 'pointer', color: '#71717a' }}>Estructura enviada a OpenRouter</summary>
                    <pre style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#18181b', borderRadius: 6, overflow: 'auto', maxHeight: 200, whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>{JSON.stringify(promptGenerado.estructura, null, 2)}</pre>
                  </details>
                )}
                <button className="primary" style={{ marginTop: '0.75rem' }} onClick={() => { setMediaModal(true); setMediaPrompt(promptGenerado.contenido); setMediaError(''); setPromptModal(false); }}>Generar imagen/video con este prompt</button>
              </div>
            )}
            {promptError && <p className="error" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{promptError}</p>}
            <button type="button" className="secondary" style={{ marginTop: '1rem' }} onClick={() => { setPromptModal(false); setPromptChatMessages([]); setPromptGenerado(null); setPromptError(''); }}>Cerrar</button>
          </div>
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
            {(mediaTipo === 'imagen' || mediaTipo === 'carrusel') && (
              <>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Modelo (por defecto: {modelosDefault.imagen?.split('/').pop() || 'flux'})</span>
                  <select value={mediaModelOverride} onChange={(e) => setMediaModelOverride(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }}>
                    <option value="">Usar por defecto</option>
                    {falImagenModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </label>
                {mediaTipo === 'imagen' && (
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Modo</span>
                    <select value={mediaModoImagen} onChange={(e) => setMediaModoImagen(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }}>
                      <option value="generar">Generar desde prompt</option>
                      <option value="editar">Editar imagen(s) con prompt</option>
                    </select>
                  </label>
                )}
                {mediaTipo === 'imagen' && mediaModoImagen === 'editar' && (
                  <>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Modelo editar (por defecto: Flux 2 Edit)</span>
                      <select value={mediaModelEditOverride} onChange={(e) => setMediaModelEditOverride(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }}>
                        <option value="">Usar por defecto</option>
                        {falImagenEditModels.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </label>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Imágenes a editar (hasta 4) — subir o pegar URLs</span>
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} id="upload-edit" onChange={subirImagenes} />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <button type="button" className="secondary" onClick={() => document.getElementById('upload-edit').click()} disabled={mediaUploading}>{mediaUploading ? 'Subiendo...' : 'Subir imágenes'}</button>
                      </div>
                      <textarea value={mediaImageUrls} onChange={(e) => setMediaImageUrls(e.target.value)} placeholder="URLs (una por línea) o sube archivos arriba" rows={2} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }} />
                    </label>
                  </>
                )}
              </>
            )}
            {mediaTipo === 'video' && (
              <>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Duración (segundos): {mediaDuration}</span>
                  <input type="range" min={5} max={20} value={mediaDuration} onChange={(e) => setMediaDuration(+e.target.value)} style={{ width: '100%', marginTop: '0.25rem' }} />
                </label>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Imágenes para video (inicio + fin) — subir o pegar URLs</span>
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} id="upload-video" onChange={subirImagenes} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button type="button" className="secondary" onClick={() => document.getElementById('upload-video').click()} disabled={mediaUploading}>{mediaUploading ? 'Subiendo...' : 'Subir imágenes'}</button>
                  </div>
                </label>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Imagen inicio (para imagen→video)</span>
                  <input type="url" value={mediaImageUrlStart} onChange={(e) => setMediaImageUrlStart(e.target.value)} placeholder="https://... o sube arriba" style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }} />
                </label>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Imagen fin (para transición inicio→fin)</span>
                  <input type="url" value={mediaImageUrlEnd} onChange={(e) => setMediaImageUrlEnd(e.target.value)} placeholder="https://... o sube como 2ª imagen" style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }} />
                </label>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Texto→video</span>
                  <select value={mediaModelT2VOverride} onChange={(e) => setMediaModelT2VOverride(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }}>
                    <option value="">Usar por defecto</option>
                    {falVideoT2VModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </label>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#71717a' }}>Imagen→video</span>
                  <select value={mediaModelI2VOverride} onChange={(e) => setMediaModelI2VOverride(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem' }}>
                    <option value="">Usar por defecto</option>
                    {falVideoI2VModels.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </label>
              </>
            )}
            <textarea placeholder="Prompt" value={mediaPrompt} onChange={(e) => setMediaPrompt(e.target.value)} rows={4} required style={{ width: '100%', marginBottom: '1rem', marginTop: '0.25rem' }} />
            {mediaLoading && <p style={{ marginBottom: '0.5rem', color: '#71717a' }}>{mediaTipo === 'video' ? 'Generando video... (puede tardar 1-2 min)' : 'Generando...'}</p>}
            {mediaError && <p className="error" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>{mediaError}</p>}
            {mediaResult && (
              <div style={{ marginBottom: '1rem', padding: '0.5rem', background: '#27272a', borderRadius: 6 }}>
                <p className="success">Listo. Costo: ${mediaResult.costo_usd?.toFixed(4)}</p>
                {mediaResult.modelo && <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>Modelo: {mediaResult.modelo}</p>}
                {mediaResult.url && <a href={mediaResult.url} target="_blank" rel="noreferrer">Ver resultado</a>}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="primary" disabled={mediaLoading}>Generar</button>
              <button type="button" className="secondary" onClick={() => { setMediaModal(false); setMediaResult(null); setMediaModoImagen('generar'); setMediaImageUrls(''); setMediaImageUrlStart(''); setMediaImageUrlEnd(''); setMediaDuration(10); setMediaModelEditOverride(''); }}>Cerrar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
