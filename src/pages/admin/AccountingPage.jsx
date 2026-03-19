import { useState, useEffect } from 'react';
import { api } from '../../api/adminClient';
import { Plus, Trash2, Pencil } from 'lucide-react';
import './AccountingPage.css';

export default function AccountingPage() {
  const [tab, setTab] = useState('expenses');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenseCats, setExpenseCats] = useState([]);
  const [incomeCats, setIncomeCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    Promise.all([
      api.get('/expenses'),
      api.get('/incomes'),
      api.get('/expense-categories'),
      api.get('/income-categories'),
    ]).then(([e, i, ec, ic]) => {
      setExpenses(e);
      setIncomes(i);
      setExpenseCats(ec);
      setIncomeCats(ic);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = {
      amount: parseInt(fd.get('amount'), 10),
      expense_date: fd.get('expense_date'),
      category_id: parseInt(fd.get('category_id'), 10),
      description: fd.get('description') || null,
    };
    try {
      if (modal?.id) {
        await api.patch(`/expenses/${modal.id}`, data);
      } else {
        await api.post('/expenses', data);
      }
      setModal(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExpenseCatSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = { name: fd.get('name'), is_marketing: fd.get('is_marketing') === 'on' };
    try {
      if (modal?.id) {
        await api.patch(`/expense-categories/${modal.id}`, data);
      } else {
        await api.post('/expense-categories', data);
      }
      setModal(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await api.post('/incomes', {
        amount: parseInt(fd.get('amount'), 10),
        income_date: fd.get('income_date'),
        category_id: parseInt(fd.get('category_id'), 10),
        description: fd.get('description') || null,
      });
      setModal(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('¿Eliminar este gasto?')) return;
    await api.delete(`/expenses/${id}`);
    load();
  };

  const handleDeleteExpenseCat = async (id) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    await api.delete(`/expense-categories/${id}`);
    load();
  };

  if (loading) return <div className="page-loading">Cargando...</div>;

  return (
    <div className="accounting-page">
      <h1 className="page-title">Contabilidad</h1>

      <div className="tabs">
        <button className={tab === 'expenses' ? 'active' : ''} onClick={() => setTab('expenses')}>Gastos</button>
        <button className={tab === 'incomes' ? 'active' : ''} onClick={() => setTab('incomes')}>Ingresos</button>
        <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Categorías</button>
      </div>

      {tab === 'expenses' && (
        <section className="accounting-section">
          <div className="section-header">
            <h2>Gastos</h2>
            <button className="btn btn-primary" onClick={() => setModal({ type: 'expense' })}>
              <Plus size={18} />
              Nuevo gasto
            </button>
          </div>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Descripción</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((ex) => (
                  <tr key={ex.id}>
                    <td>{ex.expense_date}</td>
                    <td>{ex.category_name}</td>
                    <td>${ex.amount?.toLocaleString('es-CL')}</td>
                    <td>{ex.description || '-'}</td>
                    <td>
                      <button className="btn-icon" onClick={() => handleDeleteExpense(ex.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'incomes' && (
        <section className="accounting-section">
          <div className="section-header">
            <h2>Ingresos</h2>
            <button className="btn btn-primary" onClick={() => setModal({ type: 'income' })}>
              <Plus size={18} />
              Nuevo ingreso
            </button>
          </div>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                  <th>Origen</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((in_) => (
                  <tr key={in_.id}>
                    <td>{in_.income_date}</td>
                    <td>{in_.category_name}</td>
                    <td>${in_.amount?.toLocaleString('es-CL')}</td>
                    <td>{in_.source === 'payment' ? 'Pago' : 'Manual'}</td>
                    <td>{in_.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'categories' && (
        <>
          <section className="accounting-section">
            <div className="section-header">
              <h2>Categorías de gastos</h2>
              <button className="btn btn-primary" onClick={() => setModal({ type: 'expense_cat' })}>
                <Plus size={18} />
                Nueva categoría
              </button>
            </div>
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Marketing (CAC)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {expenseCats.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.is_marketing ? 'Sí' : 'No'}</td>
                      <td>
                        <button className="btn-icon" onClick={() => setModal({ type: 'expense_cat', id: c.id, ...c })}>
                          <Pencil size={16} />
                        </button>
                        <button className="btn-icon" onClick={() => handleDeleteExpenseCat(c.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section className="accounting-section">
            <h2>Categorías de ingresos</h2>
            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeCats.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {modal?.type === 'expense' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo gasto</h2>
            <form onSubmit={handleExpenseSubmit}>
              <label>Monto (CLP) *</label>
              <input name="amount" type="number" required />
              <label>Fecha *</label>
              <input name="expense_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
              <label>Categoría *</label>
              <select name="category_id" required>
                {expenseCats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <label>Descripción</label>
              <input name="description" />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal?.type === 'expense_cat' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modal.id ? 'Editar' : 'Nueva'} categoría de gasto</h2>
            <form onSubmit={handleExpenseCatSubmit}>
              <label>Nombre *</label>
              <input name="name" defaultValue={modal.name} required />
              <label>
                <input name="is_marketing" type="checkbox" defaultChecked={modal.is_marketing} />
                Incluir en CAC (gastos de marketing)
              </label>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal?.type === 'income' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo ingreso manual</h2>
            <form onSubmit={handleIncomeSubmit}>
              <label>Monto (CLP) *</label>
              <input name="amount" type="number" required />
              <label>Fecha *</label>
              <input name="income_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
              <label>Categoría *</label>
              <select name="category_id" required>
                {incomeCats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <label>Descripción</label>
              <input name="description" />
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
