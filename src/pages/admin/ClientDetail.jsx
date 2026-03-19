import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/adminClient';
import { ArrowLeft, Plus, CreditCard } from 'lucide-react';
import ClientCustomFields from '../../components/admin/ClientCustomFields';
import './ClientDetail.css';

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [payments, setPayments] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [subModal, setSubModal] = useState(false);

  const loadClient = () => api.get(`/clients/${id}`).then(setClient);
  const loadPayments = () => api.get(`/clients/${id}/payments`).then(setPayments);
  const loadSubs = () => api.get(`/clients/${id}/subscriptions`).then(setSubscriptions);

  useEffect(() => {
    Promise.all([loadClient(), loadPayments(), loadSubs()])
      .finally(() => setLoading(false));
  }, [id]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await api.post(`/clients/${id}/payments`, {
        amount: parseInt(fd.get('amount'), 10),
        discount_applied: parseInt(fd.get('discount_applied') || 0, 10),
        discount_reason: fd.get('discount_reason') || null,
        payment_date: fd.get('payment_date'),
        client_subscription_id: fd.get('client_subscription_id') ? parseInt(fd.get('client_subscription_id'), 10) : null,
        notes: fd.get('notes') || null,
      });
      setPaymentModal(false);
      loadPayments();
      loadSubs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await api.post(`/clients/${id}/subscriptions`, {
        subscription_id: parseInt(fd.get('subscription_id'), 10),
        start_date: fd.get('start_date'),
        end_date: fd.get('end_date'),
      });
      setSubModal(false);
      loadSubs();
      loadClient();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInfoSave = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await api.patch(`/clients/${id}`, {
        posts_liked: fd.get('posts_liked') || null,
        posts_disliked: fd.get('posts_disliked') || null,
        notes: fd.get('notes') || null,
      });
      loadClient();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || !client) return <div className="page-loading">Cargando...</div>;

  const activePlan = subscriptions.find((s) => s.subscription_type === 'plan' && s.status === 'active');
  const activeWeb = subscriptions.find((s) => ['web_design', 'web_maintenance'].includes(s.subscription_type) && s.status === 'active');

  return (
    <div className="client-detail">
      <Link to="/admin/clients" className="back-link">
        <ArrowLeft size={18} />
        Volver a clientes
      </Link>

      <div className="client-header">
        <h1 className="page-title">{client.name}</h1>
        <div className="client-meta">
          {client.email && <span>{client.email}</span>}
          {client.phone && <span>{client.phone}</span>}
        </div>
      </div>

      <div className="detail-grid">
        <section className="detail-card">
          <h3>Suscripciones</h3>
          <p><strong>Plan:</strong> {activePlan?.subscription_name || 'Sin plan'}</p>
          <p><strong>Web:</strong> {activeWeb?.subscription_name || 'Sin web'}</p>
          {activePlan && (
            <p className="vigencia">
              Vigencia plan hasta: {activePlan.end_date}
            </p>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => setSubModal(true)}>
            <Plus size={16} />
            Asignar suscripción
          </button>
        </section>

        <section className="detail-card">
          <h3>Pagos</h3>
          <ul className="payments-list">
            {payments.slice(0, 5).map((p) => (
              <li key={p.id}>
                ${(p.amount - p.discount_applied).toLocaleString('es-CL')} · {p.payment_date}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary btn-sm" onClick={() => setPaymentModal(true)}>
            <CreditCard size={16} />
            Registrar pago
          </button>
        </section>
      </div>

      <section className="detail-card full">
        <ClientCustomFields clientId={id} />
      </section>

      <section className="detail-card full">
        <h3>Información del cliente</h3>
        <form
          key={`info-${client.posts_liked ?? ''}-${client.posts_disliked ?? ''}-${client.notes ?? ''}`}
          onSubmit={handleInfoSave}
        >
          <div className="form-row">
            <label>Posts que le gustaron</label>
            <input name="posts_liked" defaultValue={client?.posts_liked ?? ''} placeholder="Posts que le gustaron" />
          </div>
          <div className="form-row">
            <label>Posts que no le gustaron</label>
            <input name="posts_disliked" defaultValue={client?.posts_disliked ?? ''} />
          </div>
          <div className="form-row">
            <label>Notas</label>
            <textarea name="notes" defaultValue={client?.notes ?? ''} rows={3} />
          </div>
          <button type="submit" className="btn btn-primary">Guardar info</button>
        </form>
      </section>

      {paymentModal && (
        <div className="modal-overlay" onClick={() => setPaymentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Registrar pago</h2>
            <form onSubmit={handlePaymentSubmit}>
              <label>Monto (CLP) *</label>
              <input name="amount" type="number" required />
              <label>Descuento aplicado</label>
              <input name="discount_applied" type="number" defaultValue="0" />
              <label>Motivo descuento</label>
              <input name="discount_reason" />
              <label>Fecha</label>
              <input name="payment_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              <label>Suscripción (renovación)</label>
              <select name="client_subscription_id">
                <option value="">Ninguna</option>
                {subscriptions.filter((s) => s.status === 'active').map((s) => (
                  <option key={s.id} value={s.id}>{s.subscription_name}</option>
                ))}
              </select>
              <label>Notas</label>
              <input name="notes" />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setPaymentModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {subModal && (
        <SubModal
          clientId={id}
          onClose={() => setSubModal(false)}
          onSuccess={() => {
            setSubModal(false);
            loadSubs();
          }}
        />
      )}
    </div>
  );
}

function SubModal({ clientId, onClose, onSuccess }) {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    api.get('/subscriptions').then(setSubs);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    await api.post(`/clients/${clientId}/subscriptions`, {
      subscription_id: parseInt(fd.get('subscription_id'), 10),
      start_date: fd.get('start_date'),
      end_date: fd.get('end_date'),
    });
    onSuccess();
  };

  const today = new Date().toISOString().slice(0, 10);
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const endDefault = nextMonth.toISOString().slice(0, 10);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Asignar suscripción</h2>
        <form onSubmit={handleSubmit}>
          <label>Suscripción *</label>
          <select name="subscription_id" required>
            <option value="">Seleccionar</option>
            {subs.map((s) => (
              <option key={s.id} value={s.id}>{s.name} - ${s.price_monthly?.toLocaleString('es-CL')}</option>
            ))}
          </select>
          <label>Inicio</label>
          <input name="start_date" type="date" defaultValue={today} required />
          <label>Fin</label>
          <input name="end_date" type="date" defaultValue={endDefault} required />
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Asignar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
