import { useState, useEffect } from 'react';
import { api } from '../../api/adminClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
  const [churnData, setChurnData] = useState([]);
  const [cacData, setCacData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const load = async () => {
      const months = [];
      for (let m = 1; m <= 12; m++) {
        const [churn, cac] = await Promise.all([
          api.get(`/analytics/churn?year=${year}&month=${m}`),
          api.get(`/analytics/cac?year=${year}&month=${m}`),
        ]);
        months.push({
          month: m,
          monthName: new Date(year, m - 1).toLocaleString('es-CL', { month: 'short' }),
          churn: churn.churn_rate,
          cac: cac.cac,
          newClients: cac.new_clients,
        });
      }
      setChurnData(months);
      setCacData(months);
      setLoading(false);
    };
    load();
  }, [year]);

  if (loading) return <div className="page-loading">Cargando...</div>;

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))}>
          {[year - 2, year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <section className="chart-section">
        <h2>Churn mensual (%)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={churnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="churn" stroke="#F06236" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-section">
        <h2>CAC mensual (CLP)</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={cacData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="monthName" />
              <YAxis />
              <Tooltip formatter={(v) => `$${v?.toLocaleString('es-CL')}`} />
              <Line type="monotone" dataKey="cac" stroke="#FF8C42" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
