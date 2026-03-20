import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Play, Square, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, ReferenceLine } from 'recharts';

export default function RealTimeSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [fraudProb, setFraudProb] = useState(0.05); // 5% chance to inject fraud
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const toggleSimulation = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      intervalRef.current = setInterval(async () => {
        try {
          const res = await api.post(`/simulate?fraud_probability=${fraudProb}`);
          setTransactions(prev => {
            const newTx = [res.data, ...prev].slice(0, 50); // keep last 50
            return newTx;
          });
        } catch (err) {
          console.error("Simulation error", err);
          clearInterval(intervalRef.current);
          setIsRunning(false);
        }
      }, 2000); // Poll every 2 seconds
    }
  };

  const chartData = [...transactions].reverse().map((t, i) => ({
    name: i,
    prob: t.probability * 100,
    amount: t.amount,
    isFraud: t.is_fraud
  }));

  const fraudCount = transactions.filter(t => t.is_fraud).length;
  const recentFraud = transactions.length > 0 && transactions[0].is_fraud;

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity className="txt-blue" /> Live Monitoring
          </h2>
          <p className="page-description" style={{ marginBottom: 0 }}>Simulate a continuous stream of transactions being scored by AI.</p>
        </div>
        
        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '16px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Inject Fraud Probability:</label>
            <select 
              value={fraudProb} 
              onChange={e => setFraudProb(parseFloat(e.target.value))}
              disabled={isRunning}
              className="select-input"
            >
              <option value={0.01}>1%</option>
              <option value={0.05}>5%</option>
              <option value={0.10}>10%</option>
              <option value={0.25}>25%</option>
            </select>
          </div>

          <button 
            onClick={toggleSimulation}
            className={`btn ${isRunning ? 'btn-danger' : 'btn-success'}`}
            style={{ padding: '10px 24px', boxShadow: isRunning ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.3)' }}
          >
            {isRunning ? <><Square size={18} /> Stop Stream</> : <><Play size={18} /> Start Stream</>}
          </button>
        </div>
      </header>

      {/* Alert Banner */}
      {recentFraud && isRunning && (
        <div className="urgent-alert">
          <AlertTriangle size={28} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '4px' }}>URGENT: High Risk Transaction Blocked</h4>
            <p style={{ fontSize: '0.875rem' }}>Model identified a ${(transactions[0]?.amount || 0).toFixed(2)} transaction with {(transactions[0]?.probability * 100 || 0).toFixed(1)}% fraud probability.</p>
          </div>
        </div>
      )}

      <div className="prediction-layout">
        {/* Chart View */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="chart-title">Probability Timeline</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', backgroundColor: 'var(--color-danger)', borderRadius: '50%' }}></div> Fraud</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', backgroundColor: 'var(--color-success)', borderRadius: '50%' }}></div> Normal</span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 100]} stroke="var(--color-text-muted)" tickFormatter={val => `${val}%`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                    labelFormatter={() => ''}
                    formatter={(val, name) => {
                      if (name === "prob") return [`${val.toFixed(2)}%`, "Probability"];
                      return [val, name];
                    }}
                  />
                  <ReferenceLine y={50} stroke="var(--color-danger)" strokeDasharray="3 3" label={{ position: 'top', value: 'Threshold', fill: 'var(--color-danger)', fontSize: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="prob" 
                    stroke="var(--color-primary)" 
                    strokeWidth={3}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      if (!cx || !cy) return null;
                      return (
                        <circle 
                          cx={cx} cy={cy} r={payload.isFraud ? 6 : 0} 
                          fill={payload.isFraud ? "var(--color-danger)" : "var(--color-primary)"} 
                          stroke="var(--color-surface)" strokeWidth={2}
                          key={`dot-${cx}`}
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '300px', border: '1px dashed var(--color-border)' }}>
                Start the stream to visualize data
              </div>
            )}
          </div>
        </div>

        {/* Feed List */}
        <div className="card feed-container" style={{ padding: 0 }}>
          <div className="feed-header">
            <h3>Live Feed</h3>
            <span className="feed-badge">
              {fraudCount} flags
            </span>
          </div>
          <div className="feed-list hide-scrollbar">
            {transactions.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '40px' }}>Awaiting transactions...</p>
            ) : (
              transactions.map((t, idx) => (
                <div key={t.id + idx} className={`feed-item ${t.is_fraud ? 'fraud' : 'normal'}`}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {t.is_fraud ? <AlertTriangle size={14} className="txt-red" /> : <ShieldCheck size={14} className="txt-emerald" />}
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: t.is_fraud ? '#fca5a5' : 'var(--color-text)' }}>
                        ${t.amount.toFixed(2)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'monospace', display: 'block', marginTop: '4px' }}>ID: {t.id}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`risk-badge risk-${t.risk_level}`} style={{ padding: '4px 8px', fontSize: '0.75rem', marginLeft: 'auto', width: 'max-content' }}>
                      {t.risk_level} Risk
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>{(t.probability * 100).toFixed(1)}% prob</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
