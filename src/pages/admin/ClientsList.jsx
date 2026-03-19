import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/adminClient';
import { Plus, ChevronRight } from 'lucide-react';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => api.get('/clients').then(setClients).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      name: fd.get('name'),
      email: fd.get('email') || null,
      phone: fd.get('phone') || null,
    };
    try {
      await api.post('/clients', data);
      setModal(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="page-loading">Cargando...</div>;

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={18} />
          Nuevo cliente
        </button>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email || '-'}</td>
                <td>{c.phone || '-'}</td>
                <td>
                  <Link to={`/admin/clients/${c.id}`} className="btn-icon">
                    <ChevronRight size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo cliente</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre *</label>
              <input name="name" required />
              <label>Email</label>
              <input name="email" type="email" />
              <label>Teléfono</label>
              <input name="phone" />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
