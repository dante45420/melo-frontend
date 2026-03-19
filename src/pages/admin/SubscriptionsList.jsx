import { useState, useEffect } from 'react';
import { api } from '../../api/adminClient';
import { Plus, Pencil } from 'lucide-react';
import './SubscriptionsList.css';

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
      type: fd.get('type'),
      price_monthly: parseInt(fd.get('price_monthly'), 10),
      deliveries_per_week: parseInt(fd.get('deliveries_per_week') || 0, 10),
      is_addon: fd.get('is_addon') === 'on',
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

  const openCreate = () => setModal({});
  const openEdit = (s) => setModal({ id: s.id, ...s });

  if (loading) return <div className="page-loading">Cargando...</div>;

  return (
    <div className="subscriptions-page">
      <div className="page-header">
        <h1 className="page-title">Suscripciones</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} />
          Nueva suscripción
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Precio/mes</th>
              <th>Entregas/sem</th>
              <th>Add-on</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td><span className="badge">{s.type}</span></td>
                <td>${s.price_monthly?.toLocaleString('es-CL')}</td>
                <td>{s.deliveries_per_week}</td>
                <td>{s.is_addon ? 'Sí' : 'No'}</td>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.id ? 'Editar' : 'Nueva'} suscripción</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre</label>
              <input name="name" defaultValue={modal.name} required />
              <label>Slug</label>
              <input name="slug" defaultValue={modal.slug} required placeholder="basico, pro, full" />
              <label>Tipo</label>
              <select name="type" defaultValue={modal.type} required>
                <option value="plan">Plan</option>
                <option value="web_design">Web diseño</option>
                <option value="web_maintenance">Web mantención</option>
              </select>
              <label>Precio mensual (CLP)</label>
              <input name="price_monthly" type="number" defaultValue={modal.price_monthly} required />
              <label>Entregas por semana</label>
              <input name="deliveries_per_week" type="number" defaultValue={modal.deliveries_per_week || 0} min="0" />
              <label>
                <input name="is_addon" type="checkbox" defaultChecked={modal.is_addon} />
                Es add-on
              </label>
              <label>Descripción</label>
              <textarea name="description" defaultValue={modal.description} rows={2} />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
