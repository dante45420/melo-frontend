import { useState, useEffect } from 'react';
import { api } from '../../api/adminClient';
import { TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/dashboard').then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard-loading">Cargando...</div>;
  if (!data) return <div className="dashboard-error">Error al cargar datos</div>;

  const { marketing, finanzas, active_clients } = data;

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <section className="dashboard-section">
        <h2 className="section-title">
          <TrendingUp size={22} />
          Marketing
        </h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon cac">
              <DollarSign size={24} />
            </div>
            <div className="metric-content">
              <span className="metric-label">CAC (este mes)</span>
              <span className="metric-value">
                ${marketing.cac?.toLocaleString('es-CL') || 0}
              </span>
              <span className="metric-meta">
                {marketing.cac_new_clients} clientes nuevos · ${marketing.cac_marketing_expenses?.toLocaleString('es-CL') || 0} en marketing
              </span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon churn">
              <Percent size={24} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Churn (este mes)</span>
              <span className="metric-value">{marketing.churn_rate}%</span>
              <span className="metric-meta">
                {marketing.churn_churned} de {marketing.churn_active_at_start} activos no renovaron
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <h2 className="section-title">
          <DollarSign size={22} />
          Finanzas
        </h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon income">
              <DollarSign size={24} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Ingresos del mes</span>
              <span className="metric-value">
                ${finanzas.ingresos_mes?.toLocaleString('es-CL') || 0}
              </span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon expense">
              <DollarSign size={24} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Gastos del mes</span>
              <span className="metric-value">
                ${finanzas.gastos_mes?.toLocaleString('es-CL') || 0}
              </span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon balance">
              <DollarSign size={24} />
            </div>
            <div className="metric-content">
              <span className="metric-label">Balance del mes</span>
              <span className={`metric-value ${finanzas.balance_mes >= 0 ? 'positive' : 'negative'}`}>
                ${finanzas.balance_mes?.toLocaleString('es-CL') || 0}
              </span>
            </div>
          </div>
        </div>
        <div className="finanzas-acumulado">
          <p>Acumulado: Ingresos ${finanzas.ingresos_acumulado?.toLocaleString('es-CL') || 0} · Gastos ${finanzas.gastos_acumulado?.toLocaleString('es-CL') || 0} · Balance ${finanzas.balance_acumulado?.toLocaleString('es-CL') || 0}</p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="metric-card wide">
          <div className="metric-icon clients">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Clientes activos</span>
            <span className="metric-value">{active_clients}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
