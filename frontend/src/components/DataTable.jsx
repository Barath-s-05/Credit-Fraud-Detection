import React, { useState, useEffect } from 'react';
import api from '../api';
import { Filter, Search, Download, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAmount, setFilterAmount] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/data?limit=200');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(row => {
    if (filterAmount && row.Amount < parseFloat(filterAmount)) return false;
    return true;
  });

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Transaction History</h2>
          <p className="page-description" style={{ marginBottom: 0 }}>View and filter raw transaction records from the system.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary">
            <Download size={18} /> Export
          </button>
          <button onClick={fetchData} className="btn btn-primary">
            Refresh Data
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
          <Filter size={20} />
          <span style={{ fontWeight: 500 }}>Filters:</span>
        </div>
        <div className="input-container" style={{ maxWidth: '320px', width: '100%' }}>
          <Search className="input-icon" size={16} />
          <input 
            type="number" 
            placeholder="Min Amount ($)" 
            value={filterAmount}
            onChange={e => setFilterAmount(e.target.value)}
            className="input-field with-icon"
            style={{ height: '40px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card data-table-container" style={{ padding: 0 }}>
        <div className="data-table-wrapper hide-scrollbar">
          {loading ? (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px' }}>
               <div className="loading-spinner-large"></div>
             </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Time Offset</th>
                  <th>Amount</th>
                  <th>V1</th>
                  <th>V2</th>
                  <th>V3</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => {
                  const isFraud = row.Class === 1;
                  return (
                    <tr key={i} className={isFraud ? 'fraud-row' : ''}>
                      <td>
                        {isFraud ? (
                          <span className="status-badge status-fraud">
                            <ShieldAlert size={14} /> Fraud
                          </span>
                        ) : (
                          <span className="status-badge status-normal">
                            <ShieldCheck size={14} /> Normal
                          </span>
                        )}
                      </td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{row.Time.toFixed(0)}s</td>
                      <td style={{ fontWeight: 500, color: isFraud ? 'var(--color-danger)' : 'var(--color-text)' }}>
                        ${row.Amount.toFixed(2)}
                      </td>
                      <td className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.V1.toFixed(4)}</td>
                      <td className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.V2.toFixed(4)}</td>
                      <td className="font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>{row.V3.toFixed(4)}</td>
                    </tr>
                  );
                })}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '16px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          <span>Showing {filteredData.length} entries</span>
        </div>
      </div>
    </div>
  );
}
