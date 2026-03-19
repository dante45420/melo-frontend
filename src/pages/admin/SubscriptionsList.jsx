import { useState, useEffect } from 'react';
import { api } from '../../api/adminClient';
import { Plus, Pencil } from 'lucide-react';
import './SubscriptionsList.css';

const emptyModal = {
  name: '',
  slug: '',
  type: 'plan',
  price_monthly: '',
  deliveries_per_week: 1,
  delivery_contents: '',
  web_active: false,
  web_creation_price: '',
  web_maintenance_monthly: '',
  description: '',
};

export default function SubscriptionsList() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => api.get('/subscriptions').then(setSubs).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      slug: fd.get('slug'),
      type: 'plan',
      price_monthly: parseInt(fd.get('price_monthly'), 10),
      deliveries_per_week: parseInt(fd.get('deliveries_per_week') || 0, 10),
      delivery_contents: fd.get('delivery_contents') || null,
      web_active: fd.get('web_active') === 'on',
      web_creation_price: fd.get('web_creation_price') ? parseInt(fd.get('web_creation_price'), 10) : null,
      web_maintenance_monthly: fd.get('web_maintenance_monthly')
        ? parseInt(fd.get('web_maintenance_monthly'), 10)
        : null,
      description: fd.get('description') || null,
    };
    try {
      if (modal?.id) {
        await api.put(`/subscriptions/${modal.id}`, data);
      } else {
        await api.post('/subscriptions', data);
      }
      setModal(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const openCreate = () => setModal({ ...emptyModal });
  const openEdit = (s) => setModal({ id: s.id, ...s });

  if (loading) return <div className="page-loading">Cargando...</div>;

  return (
    <div className="subscriptions-page">
      <div className="page-header">
        <h1 className="page-title">Suscripciones (planes)</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Nuevo plan
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio/mes</th>
              <th>Entregas/sem</th>
              <th>Contenido entrega</th>
              <th>Web</th>
              <th>Creación web</th>
              <th>Mant. web/mes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>${s.price_monthly?.toLocaleString('es-CL')}</td>
                <td>{s.deliveries_per_week}</td>
                <td className="cell-clip" title={s.delivery_contents || ''}>
                  {s.delivery_contents
                    ? s.delivery_contents.length > 50
                      ? `${s.delivery_contents.slice(0, 50]}…`
                      : s.delivery_contents
                    : '—'}
                </td>
                <td>{s.web_active ? 'Sí' : 'No'}</td>
                <td>
                  {s.web_active && s.web_creation_price != null
                    ? `$${s.web_creation_price.toLocaleString('es-CL')}`
                    : '—'}
                </td>
                <td>
                  {s.web_active && s.web_maintenance_monthly != null
                    ? `$${s.web_maintenance_monthly.toLocaleString('es-CL')}`
                    : '—'}
                </td>
                <td>
                  <button className="btn-icon" onClick={() => openEdit(s)} title="Editar">
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.id ? 'Editar' : 'Nuevo'} plan</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre</label>
              <input name="name" defaultValue={modal.name} required />
              <label>Slug</label>
              <input name="slug" defaultValue={modal.slug} required placeholder="basico, pro, full" />
              <input type="hidden" name="type" value="plan" />
              <label>Precio mensual plan (CLP)</label>
              <input name="price_monthly" type="number" defaultValue={modal.price_monthly} required />
              <label>Entregas por semana</label>
              <input name="deliveries_per_week" type="number" defaultValue={modal.deliveries_per_week ?? 1} min="0" />
              <label>Qué equivale cada entrega (posts, reels, historias, carrusel…)</label>
              <textarea
                name="delivery_contents"
                defaultValue={modal.delivery_contents || ''}
                rows={3}
                placeholder="Ej: 4 posts (1 reel) + 7 historias/semana · 1 entrega semanal"
              />
              <label>
                <input name="web_active" type="checkbox" defaultChecked={modal.web_active} />
                Este plan puede incluir página web (precios abajo)
              </label>
              <label>Precio único creación web (CLP)</label>
              <input
                name="web_creation_price"
                type="number"
                defaultValue={modal.web_creation_price ?? ''}
                placeholder="Solo si web activa"
              />
              <label>Precio mantención web mensual (CLP)</label>
              <input
                name="web_maintenance_monthly"
                type="number"
                defaultValue={modal.web_maintenance_monthly ?? ''}
                placeholder="Recurrente"
              />
              <label>Descripción interna</label>
              <textarea name="description" defaultValue={modal.description || ''} rows={2} />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setModal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
