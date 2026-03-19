import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/adminClient';
import { Plus, Trash2 } from 'lucide-react';

export default function ClientCustomFields({ clientId }) {
  const [fields, setFields] = useState([]);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    api
      .get(`/clients/${clientId}/custom-field-values`)
      .then((rows) => {
        setFields(rows);
        const d = {};
        rows.forEach((r) => {
          d[r.id] = r.value ?? '';
        });
        setDraft(d);
      })
      .catch(() => setFields([]))
      .finally(() => setLoading(false));
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    const values = {};
    fields.forEach((f) => {
      values[f.id] = draft[f.id] ?? '';
    });
    setSaving(true);
    try {
      const updated = await api.put(`/clients/${clientId}/custom-field-values`, { values });
      setFields(updated);
      const d = {};
      updated.forEach((r) => {
        d[r.id] = r.value ?? '';
      });
      setDraft(d);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDefinition = async (e) => {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    try {
      await api.post('/client-field-definitions', { label });
      setNewLabel('');
      setAddOpen(false);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteDefinition = async (fieldId, label) => {
    if (
      !window.confirm(
        `¿Eliminar el campo "${label}"? Se borrarán las respuestas de todos los clientes.`,
      )
    ) {
      return;
    }
    try {
      await api.delete(`/client-field-definitions/${fieldId}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <p className="muted">Cargando campos personalizados…</p>;
  }

  return (
    <div className="client-custom-fields">
      <div className="client-custom-fields__header">
        <h3>Campos personalizados</h3>
        <div className="client-custom-fields__actions">
          <button type="button" className="btn btn-sm" onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Agregar campo
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving || fields.length === 0}
          >
            {saving ? 'Guardando…' : 'Guardar respuestas'}
          </button>
        </div>
      </div>

      {fields.length === 0 ? (
        <p className="muted">
          No hay campos definidos. Crea uno con «Agregar campo» (ej. valor de mercado de la empresa).
        </p>
      ) : (
        <div className="client-custom-fields__list">
          {fields.map((f) => (
            <div key={f.id} className="client-custom-fields__row">
              <div className="client-custom-fields__label-row">
                <label htmlFor={`cf-${f.id}`}>{f.label}</label>
                <button
                  type="button"
                  className="btn-icon danger"
                  title="Eliminar campo para todos los clientes"
                  onClick={() => handleDeleteDefinition(f.id, f.label)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                id={`cf-${f.id}`}
                rows={2}
                value={draft[f.id] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [f.id]: e.target.value }))}
                placeholder="Respuesta para este cliente"
              />
            </div>
          ))}
        </div>
      )}

      {addOpen && (
        <div className="modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="modal" onClick={(ev) => ev.stopPropagation()}>
            <h2>Nuevo campo</h2>
            <form onSubmit={handleAddDefinition}>
              <label htmlFor="new-field-label">Etiqueta (pregunta o dato)</label>
              <input
                id="new-field-label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Ej. Valor de mercado de la empresa"
                required
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setAddOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
