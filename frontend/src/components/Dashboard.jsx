import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import api from '../api';
import { ShieldCheck, Target, Activity, AlertTriangle, Info } from 'lucide-react';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/metrics')
      .then(res => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load metrics", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="loading-spinner-large"></div>
    </div>
  );

  if (!metrics) return <div style={{ color: 'var(--color-text-muted)' }}>Error loading dashboard data.</div>;

  const { recall, precision, f1, roc_auc, confusion_matrix, roc_curve, pr_curve } = metrics;
  
  const cmData = [
    { name: 'Pred Normal', 'Actual Normal': confusion_matrix[0][0], 'Actual Fraud': confusion_matrix[1][0] },
    { name: 'Pred Fraud', 'Actual Normal': confusion_matrix[0][1], 'Actual Fraud': confusion_matrix[1][1] },
  ];

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '24px' }}>
        <h2 className="page-title">Model Analytics</h2>
        <p className="page-description">Evaluation metrics for the XGBoost fraud detection engine.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid-cards">
        <KpiCard title="Recall (Sensitivity)" value={(recall * 100).toFixed(1) + '%'} icon={<ShieldCheck className="txt-emerald" />} desc="Target >= 85%" colorClass="bd-emerald" />
        <KpiCard title="Precision" value={(precision * 100).toFixed(1) + '%'} icon={<Target className="txt-blue" />} desc="Target >= 80%" colorClass="bd-blue" />
        <KpiCard title="F1 Score" value={(f1 * 100).toFixed(1) + '%'} icon={<Activity className="txt-indigo" />} desc="Harmonic mean" colorClass="bd-indigo" />
        <KpiCard title="ROC-AUC" value={(roc_auc * 100).toFixed(1) + '%'} icon={<AlertTriangle className="txt-amber" />} desc="Target >= 95%" colorClass="bd-amber" />
      </div>

      <div className="charts-grid">
        {/* ROC Curve */}
        <div className="card">
          <div className="chart-header">
            <h3 className="chart-title">ROC Curve</h3>
            <Info size={16} color="var(--color-text-muted)" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roc_curve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTpr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="fpr" stroke="var(--color-text-muted)" type="number" domain={[0, 1]} tickFormatter={(val) => val.toFixed(2)} />
                <YAxis stroke="var(--color-text-muted)" domain={[0, 1]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  labelFormatter={(val) => `FPR: ${val.toFixed(3)}`}
                  formatter={(val) => [val.toFixed(3), 'TPR']}
                />
                <Area type="monotone" dataKey="tpr" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTpr)" />
                <Line type="monotone" dataKey="fpr" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PR Curve */}
        <div className="card">
          <div className="chart-header">
            <h3 className="chart-title">Precision-Recall Curve</h3>
            <Info size={16} color="var(--color-text-muted)" />
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pr_curve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="recall" stroke="var(--color-text-muted)" type="number" domain={[0, 1]} tickFormatter={(val) => val.toFixed(2)} />
                <YAxis stroke="var(--color-text-muted)" domain={[0, 1]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  labelFormatter={(val) => `Recall: ${val.toFixed(3)}`}
                  formatter={(val) => [val.toFixed(3), 'Precision']}
                />
                <Area type="monotone" dataKey="precision" stroke="#10b981" fillOpacity={1} fill="url(#colorPrec)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confusion Matrix Visualization */}
        <div className="card col-span-2">
          <div className="chart-header" style={{ marginBottom: '24px' }}>
            <h3 className="chart-title">Test Set Confusion Matrix</h3>
          </div>
          <div className="chart-container-large">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cmData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                  cursor={{ fill: 'var(--color-border)', opacity: 0.2 }}
                />
                <Bar dataKey="Actual Normal" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual Fraud" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, desc, colorClass }) {
  return (
    <div className={`card kpi-card ${colorClass}`}>
      <div className="kpi-card-header">
        <h3 className="kpi-title">{title}</h3>
        <div className="kpi-icon-container">{icon}</div>
      </div>
      <div>
        <span className="kpi-value">{value}</span>
      </div>
      <p className="kpi-desc">{desc}</p>
      
      <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05, transform: 'scale(3)' }}>
        {icon}
      </div>
    </div>
  );
}
