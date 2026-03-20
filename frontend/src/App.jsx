import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldAlert, 
  Table as TableIcon, 
  Activity,
  CreditCard
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import PredictionPanel from './components/PredictionPanel';
import DataTable from './components/DataTable';
import RealTimeSimulation from './components/RealTimeSimulation';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'predict': return <PredictionPanel />;
      case 'data': return <DataTable />;
      case 'simulation': return <RealTimeSimulation />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar hide-scrollbar">
        <div className="sidebar-header">
          <div className="brand-icon">
            <CreditCard size={24} color="white" />
          </div>
          <div>
            <h1 className="brand-title">SecurePay</h1>
            <p className="brand-subtitle">Fraud Detection AI</p>
          </div>
        </div>

        <nav className="nav-menu">
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<ShieldAlert size={20} />} 
            label="Manual Prediction" 
            active={activeTab === 'predict'} 
            onClick={() => setActiveTab('predict')} 
          />
          <NavItem 
            icon={<TableIcon size={20} />} 
            label="Transaction Data" 
            active={activeTab === 'data'} 
            onClick={() => setActiveTab('data')} 
          />
          <NavItem 
            icon={<Activity size={20} />} 
            label="Live Simulation" 
            active={activeTab === 'simulation'} 
            onClick={() => setActiveTab('simulation')} 
          />
        </nav>
        
        <div className="sidebar-footer">
          <p className="footer-text">
            Powered by XGBoost & SMOTE
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content hide-scrollbar">
        <div className="glow-bg"></div>
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`nav-item ${active ? 'active' : ''}`}
    >
      <div style={{ color: active ? 'var(--color-primary)' : 'inherit' }}>
        {icon}
      </div>
      <span>{label}</span>
      {active && <div className="nav-indicator"></div>}
    </button>
  );
}

export default App;
