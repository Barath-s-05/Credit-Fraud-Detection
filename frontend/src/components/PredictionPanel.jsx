import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Cell, ReferenceLine
} from 'recharts';
import api from '../api';
import { AlertCircle, CheckCircle, Search, ShieldAlert } from 'lucide-react';

export default function PredictionPanel() {
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!amount) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/predict', {
        amount: parseFloat(amount),
        time: parseFloat(time)
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to run prediction. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '24px' }}>
        <h2 className="page-title">Manual Transaction Check</h2>
        <p className="page-description">Enter a transaction amount to simulate a real transaction and get AI predictions.</p>
      </header>

      <div className="prediction-layout">
        {/* Input Form */}
        <div className="card border-top-primary">
          <form onSubmit={handlePredict}>
            <div className="form-group">
              <label className="form-label">Transaction Amount ($)</label>
              <div className="input-container">
                <span className="input-icon">$</span>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="input-field with-icon"
                  placeholder="e.g. 1500.00"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-flex">
                <span className="form-label" style={{ marginBottom: 0 }}>Time Offset (Seconds)</span>
                <span className="font-mono txt-blue">{time}s</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="172792" 
                value={time}
                onChange={e => setTime(e.target.value)}
              />
              <div className="range-labels">
                <span>0</span>
                <span>48 Hours</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ padding: '12px', marginTop: '16px' }}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <><Search size={18} /> Run AI Analysis</>
              )}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '16px', lineHeight: '1.5' }}>
              Note: The backend will randomly sample a real non-fraud transaction from the dataset, inject your chosen Amount and Time, and run it through the XGBoost model to see if it triggers the fraud detection threshold.
            </p>
          </form>
        </div>

        {/* Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <ShieldAlert size={32} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-text)', marginBottom: '8px' }}>Awaiting Transaction</h3>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '300px' }}>Enter transaction details in the form to generate an AI risk prediction and feature explainability report.</p>
            </div>
          )}

          {loading && (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
              <div className="loading-spinner-large"></div>
              <p style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Analyzing transaction patterns...</p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Top Result Banner */}
              <div className={`result-banner ${result.is_fraud ? 'fraud' : 'safe'}`}>
                <div className="result-info">
                  <div className={`result-icon ${result.is_fraud ? 'fraud' : 'safe'}`}>
                    {result.is_fraud ? <AlertCircle size={32} /> : <CheckCircle size={32} />}
                  </div>
                  <div>
                    <h3 className="result-title">
                      {result.is_fraud ? 'Fraud Detected' : 'Transaction Safe'}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: result.is_fraud ? 'var(--color-danger)' : 'var(--color-success)' }}>
                      Model probability: {(result.probability * 100).toFixed(2)}% (Threshold: {(result.threshold_used * 100).toFixed(2)}%)
                    </p>
                  </div>
                </div>
                <div className={`risk-badge risk-${result.risk_level}`}>
                  {result.risk_level} Risk
                </div>
              </div>

              {/* SHAP Explanation Chart */}
              <div className="card">
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>AI Explainability (SHAP values)</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Features that pushed the model towards predicting {result.is_fraud ? 'Fraud' : 'Normal'}.</p>
                </div>
                
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={result.shap_explanation} margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="var(--color-text-muted)" />
                      <YAxis dataKey="feature" type="category" stroke="var(--color-text-muted)" axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)', borderRadius: '8px' }}
                        cursor={{ fill: 'var(--color-border)', opacity: 0.2 }}
                        formatter={(val, name, props) => {
                          const originalVal = props.payload.value.toFixed(4);
                          return [`Impact: ${val.toFixed(4)} (Val: ${originalVal})`, 'Feature impact'];
                        }}
                      />
                      <ReferenceLine x={0} stroke="#64748b" />
                      <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={24}>
                        {result.shap_explanation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.impact > 0 ? 'var(--color-danger)' : 'var(--color-primary)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
