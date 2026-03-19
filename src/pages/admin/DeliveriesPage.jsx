import { useState, useEffect } from 'react';
import { api } from '../../api/adminClient';
import { Plus, Check, Zap } from 'lucide-react';
import './DeliveriesPage.css';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().slice(0, 10);
  });

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (weekStart) params.set('week_start', weekStart);
    api.get(`/deliveries?${params}`)
      .then(setDeliveries)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    api.get('/clients').then(setClients);
  }, [weekStart]);

  const handleGenerate = async () => {
    try {
      const res = await api.post('/deliveries/generate', { week_start: weekStart });
      alert(`Se generaron ${res.created} entregas pendientes`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/deliveries/${id}`, { status: 'completed' });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await api.post('/deliveries', {
        client_id: fd.get('client_id') ? parseInt(fd.get('client_id'), 10) : null,
        due_date: fd.get('due_date'),
        description: fd.get('description') || null,
        type: 'manual',
      });
      setModal(false);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const pending = deliveries.filter((d) => d.status === 'pending');
  const completed = deliveries.filter((d) => d.status === 'completed');

  return (
    <div className="deliveries-page">
      <div className="page-header">
        <h1 className="page-title">Entregas</h1>
        <div className="header-actions">
          <label>
            Semana:
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              className="week-picker"
            />
          </label>
          <button className="btn" onClick={handleGenerate}>
            <Zap size={18} />
            Generar pendientes
          </button>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={18} />
            Crear entrega
          </button>
        </div>
      </div>

      <div className="deliveries-grid">
        <div className="deliveries-column">
          <h3>Pendientes ({pending.length})</h3>
          <ul className="deliveries-list">
            {pending.map((d) => (
              <li key={d.id} className="delivery-item">
                <div>
                  <strong>{d.client_name || 'Empresa (general)'}</strong>
                  <span className="due-date">{d.due_date}</span>
                  {d.description && (
                    <div className="delivery-desc">{d.description}</div>
                  )}
                </div>
                <button
                  className="btn-icon complete"
                  onClick={() => handleComplete(d.id)}
                  title="Marcar completada"
                >
                  <Check size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="deliveries-column">
          <h3>Completadas ({completed.length})</h3>
          <ul className="deliveries-list">
            {completed.map((d) => (
              <li key={d.id} className="delivery-item completed">
                <div>
                  <strong>{d.client_name || 'Empresa'}</strong>
                  <span className="due-date">{d.due_date}</span>
                  {d.description && (
                    <div className="delivery-desc">{d.description}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Crear entrega</h2>
            <form onSubmit={handleCreate}>
              <label>Cliente (vacío = empresa)</label>
              <select name="client_id">
                <option value="">Pendiente empresa</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <label>Fecha entrega</label>
              <input name="due_date" type="date" defaultValue={weekStart} required />
              <label>Descripción</label>
              <input name="description" />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
