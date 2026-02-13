import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link as ScrollLink } from 'react-scroll';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

function App() {
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataInsights, setDataInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(true);

  // Navigation Items
  const navItems = [
    { id: 'predict-section', name: 'Predict' },
    { id: 'analytics-section', name: 'Analytics' },
    { id: 'insights-section', name: 'Insights' }
  ];

  // Fetch data insights on component mount
  useEffect(() => {
    const fetchDataInsights = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/data-insights');
        setDataInsights(response.data);
      } catch (err) {
        console.error('Failed to fetch data insights:', err);
      } finally {
        setInsightsLoading(false);
      }
    };
    
    fetchDataInsights();
  }, []);

  // Floating animation for background elements
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const floatingAnimation2 = {
    y: [0, 15, 0],
    x: [0, 10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1
    }
  };

  const floatingAnimation3 = {
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }
  };

  // Continuous floating particles
  const particleAnimation = {
    y: [0, -100],
    x: [0, 50],
    opacity: [0, 1, 0],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const particleAnimation2 = {
    y: [0, -80],
    x: [0, -40],
    opacity: [0, 0.7, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 3
    }
  };

  const particleAnimation3 = {
    y: [0, -120],
    x: [0, 30],
    opacity: [0, 0.5, 0],
    transition: {
      duration: 18,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 6
    }
  };


  // KPI Data
  const kpiData = [
    { title: 'Total Transactions', value: '284,759', change: '+12.5%' },
    { title: 'Fraud Rate', value: '2.3%', change: '-0.8%' },
    { title: 'Model Accuracy', value: '98.7%', change: '+1.2%' },
    { title: 'Avg Transaction', value: '$87.42', change: '+3.2%' }
  ];

  // Chart Data
  const fraudDistributionData = [
    { name: 'Legitimate', value: 97.7, color: '#22c55e' },
    { name: 'Fraud', value: 2.3, color: '#ef4444' }
  ];

  const transactionTrendData = [
    { day: 'Mon', amount: 42000, fraud: 12 },
    { day: 'Tue', amount: 38500, fraud: 8 },
    { day: 'Wed', amount: 31200, fraud: 15 },
    { day: 'Thu', amount: 45800, fraud: 9 },
    { day: 'Fri', amount: 52300, fraud: 11 },
    { day: 'Sat', amount: 29800, fraud: 7 },
    { day: 'Sun', amount: 36700, fraud: 13 }
  ];

  const confidenceDistributionData = [
    { confidence: '90-100%', count: 245 },
    { confidence: '80-89%', count: 156 },
    { confidence: '70-79%', count: 89 },
    { confidence: '60-69%', count: 45 },
    { confidence: '<60%', count: 12 }
  ];

  const featureImportanceData = [
    { name: 'Transaction Amount', value: 0.23, description: 'High-value transactions often indicate fraud patterns' },
    { name: 'Time Since Last', value: 0.19, description: 'Unusual timing patterns suggest fraudulent activity' },
    { name: 'Merchant Type', value: 0.15, description: 'Certain merchant categories have higher fraud rates' },
    { name: 'Location Anomaly', value: 0.12, description: 'Transactions from unusual locations flag fraud' },
    { name: 'Velocity Check', value: 0.08, description: 'Rapid successive transactions indicate bot activity' }
  ];

  const handlePredict = async () => {
    if (!amount || !time) {
      setError('Please enter both transaction amount and time');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', {
        amount: parseFloat(amount),
        time: parseFloat(time)
      });

      setPrediction(response.data);
    } catch (err) {
      setError('Unable to connect to fraud detection service. Please ensure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  const resetForm = () => {
    setAmount('');
    setTime('');
    setPrediction(null);
    setError('');
  };

  // Island style for floating panels
  const glassCardStyle = {
    background: '#FFFFFF',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    borderRadius: '18px',
    border: '1px solid rgba(14,165,233,0.15)',
    boxShadow: '0 10px 30px rgba(2,132,199,0.08)',
    transition: 'all 0.3s ease'
  };

  const glassCardHoverStyle = {
    boxShadow: '0 15px 40px rgba(2,132,199,0.15)',
    transform: 'translateY(-3px)'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      color: '#475569',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Hero Section */}
      <section className="hero-gradient" style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 20px 160px 20px',
        background: `linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #38BDF8 100%)`,
        overflow: 'hidden',
        zIndex: 10
      }}>
        {/* Subtle Light Effects */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(56,189,248,0.25), transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(147,197,253,0.18), transparent 65%)
          `,
          pointerEvents: 'none',
          zIndex: 1
        }} />
        
        {/* Wave divider */}
        <div className="wave-divider" style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '120px',
          lineHeight: 0,
          zIndex: 2
        }}>
          <svg viewBox="0 0 1440 150" preserveAspectRatio="none" style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}>
            <path fill="#F8FAFC" d="M0,96L60,106.7C120,117,240,139,360,138.7C480,139,600,117,720,101.3C840,85,960,75,1080,90.7C1200,107,1320,149,1380,170.7L1440,192V0H0Z"></path>
          </svg>
        </div>
        
        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}>
          {/* Top Navigation Island */}
          <div style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: 100,
            display: 'flex',
            gap: '0.75rem',
            padding: '0.75rem',
            borderRadius: '40px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 10px 30px rgba(2, 132, 199, 0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 15px 40px rgba(2, 132, 199, 0.25)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 10px 30px rgba(2, 132, 199, 0.15)';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            {navItems && navItems.map((item, index) => (
              <ScrollLink
                key={item.id}
                to={item.id}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                style={{
                  padding: '0.625rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  background: 'linear-gradient(90deg, #38BDF8, #0EA5E9)',
                  border: 'none',
                  color: '#0F172A',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                whileHover={{ 
                  background: 'linear-gradient(90deg, #0EA5E9, #0284C7)',
                  color: 'white',
                  scale: 1.05,
                  boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1), duration: 0.5 }}
              >
                {item.name}
              </ScrollLink>
            ))}
          </div>
          
          {/* Hero Content */}
          <div style={{ textAlign: 'center', padding: '2rem 0', marginBottom: '3rem' }}>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              style={{ fontSize: '3.75rem', marginBottom: '1.5rem', color: 'white' }}
            >
              🔍
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
              style={{
                fontSize: '3rem',
                fontWeight: '700',
                marginBottom: '1.5rem',
                color: '#FFFFFF',
                textAlign: 'center'
              }}
            >
              <span style={{ color: '#38BDF8' }}>AI Credit Card Fraud Detection</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true }}
              style={{
                fontSize: '1.25rem',
                color: '#CBD5E1',
                maxWidth: '48rem',
                margin: '0 auto',
                lineHeight: '1.75'
              }}
            >
              Advanced machine learning system that detects fraudulent transactions in real-time using behavioral patterns and anomaly detection
            </motion.p>
          </div>
        </div>
        
        {/* Hero Divider */}
        <div className="hero-divider" style={{
          position: 'absolute',
          bottom: '-1px',
          width: '100%',
          height: '120px',
          background: 'linear-gradient(to bottom, rgba(56,189,248,0.25), #F8FAFC)',
          zIndex: 3
        }} />
      </section>
      
      {/* Cards Section - New Scroll Section */}
      <section id="predict-section" className="cards-section" style={{
        background: '#F8FAFC',
        padding: '80px 20px 60px 20px',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Enhanced Background Elements */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '3%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '8%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '12%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        {/* Geometric Patterns */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '15%',
          width: '60px',
          height: '60px',
          border: '2px solid rgba(56,189,248,0.2)',
          borderRadius: '8px',
          transform: 'rotate(45deg)',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: '40px',
          height: '40px',
          background: 'rgba(14,165,233,0.15)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '40%',
          left: '25%',
          width: '80px',
          height: '20px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)',
          borderRadius: '10px',
          zIndex: 0
        }} />
        
        {/* Additional Background Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: '100px',
          height: '100px',
          background: 'conic-gradient(from 0deg, rgba(56,189,248,0.1), rgba(14,165,233,0.1), rgba(99,102,241,0.1), rgba(56,189,248,0.1))',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          top: '70%',
          left: '70%',
          width: '120px',
          height: '30px',
          background: 'linear-gradient(90deg, rgba(56,189,248,0.1), transparent, rgba(14,165,233,0.1))',
          borderRadius: '15px',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '25%',
          width: '70px',
          height: '70px',
          border: '1px dashed rgba(99,102,241,0.3)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          top: '40%',
          right: '35%',
          width: '50px',
          height: '50px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '30%',
          left: '40%',
          width: '90px',
          height: '15px',
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.15), transparent)',
          borderRadius: '7px',
          zIndex: 0
        }} />
        
        {/* More Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.1), transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '60px',
          height: '60px',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          width: '100px',
          height: '20px',
          background: 'linear-gradient(90deg, rgba(245,158,11,0.1), transparent, rgba(245,158,11,0.1))',
          borderRadius: '10px',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '45%',
          right: '10%',
          width: '70px',
          height: '70px',
          background: 'conic-gradient(from 45deg, rgba(139,92,246,0.1), rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '65%',
          width: '40px',
          height: '40px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '40%',
          width: '110px',
          height: '25px',
          background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.1), transparent)',
          borderRadius: '12px',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '5%',
          width: '50px',
          height: '50px',
          border: '1px dotted rgba(16,185,129,0.25)',
          borderRadius: '50%',
          zIndex: 0
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '35%',
          left: '60%',
          width: '80px',
          height: '15px',
          background: 'linear-gradient(90deg, rgba(14,165,233,0.1), transparent, rgba(56,189,248,0.1))',
          borderRadius: '7px',
          zIndex: 0
        }} />
        
        <style>{`
          @keyframes floatBlob {
            from { transform: translateY(0px) translateX(0px); }
            to   { transform: translateY(-40px) translateX(30px); }
          }
        `}</style>
        
        {/* Main Content */}
        <main style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* Fraud Detection Form - With Enhanced Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", type: "spring", stiffness: 100 }}
          viewport={{ once: false, amount: 0.2 }}
        >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
            {/* Input Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.3 }}
              style={glassCardStyle}
              whileHover={glassCardHoverStyle}
            >
              <div style={{ padding: '2rem' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1E293B',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ color: '#60a5fa' }}></span>
                  Transaction Analysis
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#94A3B8',
                      marginBottom: '0.5rem'
                    }}>
                      Transaction Amount
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        insetY: 0,
                        left: 0,
                        paddingLeft: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        pointerEvents: 'none',
                        color: '#94A3B8'
                      }}>
                        $
                      </div>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        style={{
                          width: '100%',
                          paddingLeft: '2rem',
                          paddingRight: '1rem',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          borderRadius: '0.75rem',
                          color: '#475569',
                          transition: 'all 0.2s',
                          fontSize: '1rem'
                        }}
                        onFocus={(e) => {
                          e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.5)';
                          e.target.style.borderColor = 'transparent';
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = 'none';
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#94A3B8',
                      marginBottom: '0.5rem'
                    }}>
                      Transaction Time (seconds)
                    </label>
                    <input
                      type="number"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="Enter time in seconds"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: '0.75rem',
                        color: '#475569',
                        transition: 'all 0.2s',
                        fontSize: '1rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.5)';
                        e.target.style.borderColor = 'transparent';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = 'none';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
                    <motion.button
                      onClick={handlePredict}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '1rem 1.5rem',
                        background: 'linear-gradient(90deg, #38BDF8, #0EA5E9)',
                        color: 'white',
                        fontWeight: '600',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <div style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <span></span>
                          Detect Fraud
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      onClick={resetForm}
                      style={{
                        padding: '1rem 1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#cbd5e1',
                        borderRadius: '0.75rem',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      whileHover={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderColor: '#60a5fa',
                        color: '#60a5fa'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset
                    </motion.button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <span style={{ color: '#f87171', fontSize: '1.25rem' }}></span>
                      <span style={{ color: '#fca5a5' }}>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            
            {/* Results Card - Scroll Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.3 }}
              style={{ ...glassCardStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              whileHover={glassCardHoverStyle}
            >
              <div style={{ padding: '2rem', textAlign: 'center', width: '100%' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#1E293B',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ color: '#34d399' }}></span>
                  Prediction Result
                </h2>
                
                {!prediction && !loading ? (
                  <div style={{ padding: '3rem 0' }}>
                    <div style={{ 
                      fontSize: '3.75rem', 
                      marginBottom: '1rem', 
                      opacity: 0.3,
                      animation: 'pulse 2s ease-in-out infinite'
                    }}>
                      🤖
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
                      Enter transaction details and click "Detect Fraud" to get results
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      AI model is ready to analyze transaction patterns
                    </p>
                  </div>
                ) : loading ? (
                  <div style={{ padding: '3rem 0' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: '4rem',
                        height: '4rem',
                        margin: '0 auto 1.5rem',
                        borderRadius: '50%',
                        background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        background: 'rgba(15, 23, 42, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}></span>
                      </div>
                    </motion.div>
                    <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
                      Analyzing transaction...
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      Processing transaction patterns and risk factors
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      <motion.div
                        style={{
                          padding: '1.5rem 2rem',
                          borderRadius: '1rem',
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          boxShadow: prediction.prediction === 'Fraud' 
                            ? '0 0 30px rgba(239, 68, 68, 0.4)' 
                            : '0 0 30px rgba(56, 189, 248, 0.3)',
                          background: prediction.prediction === 'Fraud'
                            ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.3), rgba(249, 115, 22, 0.3))'
                            : 'linear-gradient(90deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.2))',
                          color: prediction.prediction === 'Fraud' ? '#fca5a5' : '#38BDF8',
                          border: prediction.prediction === 'Fraud'
                            ? '1px solid rgba(239, 68, 68, 0.5)'
                            : '1px solid rgba(56, 189, 248, 0.3)'
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {prediction.prediction}
                      </motion.div>
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        marginBottom: '1rem'
                      }}>
                        <span style={{ color: '#94a3b8' }}>Confidence Score</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0EA5E9' }}>
                          {prediction.confidence}%
                        </span>
                      </div>
                      
                      <div style={{ paddingTop: '1rem' }}>
                        <div style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '9999px',
                          height: '0.75rem',
                          marginBottom: '0.5rem'
                        }}>
                          <motion.div 
                            style={{
                              height: '0.75rem',
                              borderRadius: '9999px',
                              background: prediction.prediction === 'Fraud' ? '#dc2626' : '#38BDF8'
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${prediction.confidence}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      paddingTop: '1rem', 
                      color: '#94a3b8', 
                      fontSize: '0.875rem', 
                      lineHeight: '1.6' 
                    }}>
                      {prediction.prediction === 'Fraud' 
                        ? 'This transaction has been flagged as potentially fraudulent. Review recommended.'
                        : 'This transaction appears to be legitimate. No suspicious activity detected.'}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
        </main>
      </section>
      
      {/* Floating Particles Background - Added throughout white sections */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        {/* Particle 1 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '8px',
            height: '8px',
            background: 'rgba(56, 189, 248, 0.6)',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.8)'
          }}
          animate={particleAnimation}
        />
        
        {/* Particle 2 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '40%',
            right: '15%',
            width: '6px',
            height: '6px',
            background: 'rgba(14, 165, 233, 0.5)',
            borderRadius: '50%',
            boxShadow: '0 0 15px rgba(14, 165, 233, 0.7)'
          }}
          animate={particleAnimation2}
        />
        
        {/* Particle 3 */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '30%',
            left: '25%',
            width: '10px',
            height: '10px',
            background: 'rgba(99, 102, 241, 0.4)',
            borderRadius: '50%',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.6)'
          }}
          animate={particleAnimation3}
        />
        
        {/* Additional Particles */}
        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            right: '30%',
            width: '4px',
            height: '4px',
            background: 'rgba(56, 189, 248, 0.3)',
            borderRadius: '50%'
          }}
          animate={{
            y: [0, -60],
            x: [0, 30],
            opacity: [0, 0.8, 0],
            transition: {
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }
          }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '60%',
            width: '5px',
            height: '5px',
            background: 'rgba(14, 165, 233, 0.4)',
            borderRadius: '50%'
          }}
          animate={{
            y: [0, -80],
            x: [0, -25],
            opacity: [0, 0.6, 0],
            transition: {
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }
          }}
        />
      </div>
      
      <section id="analytics-section" className="analytics-section" style={{
        background: '#F8FAFC',
        padding: '60px 20px',
        position: 'relative',
        zIndex: 5
      }}>
        <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ padding: '0 20px' }}>
          {/* Analytics Header - Dynamic Entrance */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", type: "spring", stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ marginBottom: '2rem' }}
          >
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: '700',
              color: '#0F172A',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span></span>
              Analytics Dashboard
            </h2>
            <p style={{
              color: '#475569',
              fontSize: '1.125rem'
            }}>
              Real-time fraud detection metrics and performance insights
            </p>
          </motion.div>

          {/* KPI Cards - Dynamic Cascade */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {kpiData.map((kpi, index) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 60, rotateX: 45 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.7, 
                  ease: "easeOut", 
                  delay: 0.15 * index,
                  type: "spring",
                  stiffness: 120
                }}
                viewport={{ once: true, amount: 0.5 }}
                style={{ ...glassCardStyle }}
                whileHover={{
                  ...glassCardHoverStyle,
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    {kpi.value}
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {kpi.title}
                  </div>
                  <div style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: '500' }}>
                    ↑ {kpi.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Grid - Dynamic Entry */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.2rem' }}>
            {/* Fraud Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ ...glassCardStyle }}
              whileHover={glassCardHoverStyle}
            >
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#1E293B', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span></span>
                  Fraud vs Legitimate Distribution
                </h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fraudDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {fraudDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(2,132,199,0.15)'
                        }} 
                      />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#475569" fontSize="16" fontWeight="bold">
                        {fraudDistributionData[0]?.value}%
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Transaction Trends Chart */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ ...glassCardStyle }}
              whileHover={glassCardHoverStyle}
            >
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#1E293B', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span></span>
                  Transaction Trends
                </h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transactionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="day" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(2,132,199,0.15)'
                        }} 
                      />
                      <Bar dataKey="amount" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Confidence Distribution Chart */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ ...glassCardStyle }}
              whileHover={glassCardHoverStyle}
            >
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ color: '#1E293B', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎯</span>
                  Prediction Confidence
                </h3>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={confidenceDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis dataKey="confidence" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 15px rgba(2,132,199,0.15)'
                        }} 
                      />
                      <Bar dataKey="count" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        </main>
      </section>

      {/* Insights Section */}
      <section id="insights-section" className="insights-section" style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        padding: '80px 20px',
        position: 'relative',
        zIndex: 5
      }}>
        <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ padding: '0 20px' }}>
            {/* Insights Header - Dynamic Entrance */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", type: "spring", stiffness: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              style={{ marginBottom: '2rem', textAlign: 'center' }}
            >
              <h2 style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                color: '#F1F5F9',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                <span>📊</span>
                Data Insights & Analytics
              </h2>
              <p style={{
                color: '#94A3B8',
                fontSize: '1.125rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Comprehensive analysis of credit card transaction patterns and fraud detection insights
              </p>
            </motion.div>

            {/* Data Overview Stats - Dynamic Cascade */}
            {insightsLoading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.2rem',
                marginBottom: '2rem'
              }}>
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '1.5rem',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      minHeight: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '3px solid rgba(56, 189, 248, 0.3)',
                      borderTop: '3px solid #38BDF8',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  </motion.div>
                ))}
              </div>
            ) : dataInsights && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.2rem',
                marginBottom: '2rem'
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center'
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: '0 12px 40px rgba(56, 189, 248, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💳</div>
                  <div style={{ color: '#38BDF8', fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    {dataInsights.overview.total_transactions.toLocaleString()}
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Total Transactions</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center'
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: '0 12px 40px rgba(239, 68, 68, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                  <div style={{ color: '#f87171', fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    {dataInsights.overview.fraud_count.toLocaleString()}
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Fraud Cases</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center'
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
                  <div style={{ color: '#34d399', fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    ${dataInsights.amount_stats.average_transaction}
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Avg. Transaction</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    padding: '1.5rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center'
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                  <div style={{ color: '#fbbf24', fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    {dataInsights.overview.fraud_rate}%
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Fraud Rate</div>
                </motion.div>
              </div>
            )}

            {/* Data Insights Grid - Enhanced with Real Data */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* Fraud Amount Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  padding: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                whileHover={glassCardHoverStyle}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    💰
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: '#F1F5F9',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.75rem'
                    }}>
                      Fraud Amount Patterns
                    </h3>
                    {dataInsights && (
                      <div>
                        <div style={{
                          color: '#94A3B8',
                          lineHeight: '1.6',
                          marginBottom: '1rem'
                        }}>
                          Fraudulent transactions average <span style={{ color: '#f87171', fontWeight: '600' }}>${dataInsights.amount_stats.avg_fraud_amount}</span>, 
                          which is <span style={{ color: '#34d399', fontWeight: '600' }}>{Math.round((dataInsights.amount_stats.avg_fraud_amount / dataInsights.amount_stats.avg_legit_amount) * 100)}%</span> higher than legitimate transactions.
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <div style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            fontSize: '0.75rem'
                          }}>
                            <span style={{ color: '#f87171' }}>Avg Fraud: ${dataInsights.amount_stats.avg_fraud_amount}</span>
                          </div>
                          <div style={{
                            background: 'rgba(16, 185, 129, 0.2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            fontSize: '0.75rem'
                          }}>
                            <span style={{ color: '#34d399' }}>Avg Legit: ${dataInsights.amount_stats.avg_legit_amount}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Time-Based Fraud Patterns */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  padding: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                whileHover={glassCardHoverStyle}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    🕒
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: '#F1F5F9',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.75rem'
                    }}>
                      Time-Based Patterns
                    </h3>
                    {dataInsights && (
                      <div>
                        <div style={{
                          color: '#94A3B8',
                          lineHeight: '1.6',
                          marginBottom: '1rem'
                        }}>
                          Peak fraud activity occurs during late night hours. Monitor transactions between <span style={{ color: '#38BDF8', fontWeight: '600' }}>11 PM - 4 AM</span> for increased risk.
                        </div>
                        <div style={{
                          background: 'rgba(56, 189, 248, 0.15)',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1px solid rgba(56, 189, 248, 0.3)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                            <span style={{ color: '#94A3B8' }}>High Risk Hours:</span>
                            <span style={{ color: '#38BDF8', fontWeight: '500' }}>11 PM - 4 AM</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                            <span style={{ color: '#94A3B8' }}>Avg. Time:</span>
                            <span style={{ color: '#38BDF8', fontWeight: '500' }}>{Math.round(dataInsights.time_patterns.average_time / 3600)} hours</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Fraud Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.3 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '1.5rem',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                whileHover={glassCardHoverStyle}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📊
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      color: '#F1F5F9',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.75rem'
                    }}>
                      Fraud Distribution
                    </h3>
                    {dataInsights && (
                      <div>
                        <div style={{
                          color: '#94A3B8',
                          lineHeight: '1.6',
                          marginBottom: '1rem'
                        }}>
                          Fraud cases are distributed across different transaction amounts, with <span style={{ color: '#34d399', fontWeight: '600' }}>{Math.round((dataInsights.fraud_distribution.low_amount / dataInsights.overview.fraud_count) * 100)}%</span> being low-value transactions.
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <div style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            textAlign: 'center'
                          }}>
                            <div style={{ color: '#f87171', fontSize: '0.9rem', fontWeight: '600' }}>
                              {dataInsights.fraud_distribution.low_amount}
                            </div>
                            <div style={{ color: '#94A3B8', fontSize: '0.7rem' }}>Low Amount</div>
                          </div>
                          <div style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            textAlign: 'center'
                          }}>
                            <div style={{ color: '#fbbf24', fontSize: '0.9rem', fontWeight: '600' }}>
                              {dataInsights.fraud_distribution.medium_amount}
                            </div>
                            <div style={{ color: '#94A3B8', fontSize: '0.7rem' }}>Medium</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Data-Driven Recommendations - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 60, skewY: 5 }}
              whileInView={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              viewport={{ once: true, amount: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <h3 style={{
                color: '#F1F5F9',
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}>
                <span>🚀</span>
                Data-Driven Recommendations
              </h3>
              
              {dataInsights && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '1.5rem'
                }}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      boxShadow: '0 4px 15px rgba(56, 189, 248, 0.2)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔔</div>
                    <h4 style={{ color: '#38BDF8', marginBottom: '0.75rem', fontWeight: '600' }}>
                      High-Value Monitoring
                    </h4>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                      Monitor transactions above <span style={{ color: '#38BDF8', fontWeight: '600' }}>${dataInsights.amount_stats.avg_fraud_amount}</span> with enhanced scrutiny
                    </p>
                    <div style={{
                      background: 'rgba(56, 189, 248, 0.25)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      display: 'inline-block',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{ color: '#38BDF8' }}>Priority: High</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌙</div>
                    <h4 style={{ color: '#f87171', marginBottom: '0.75rem', fontWeight: '600' }}>
                      Night-Time Vigilance
                    </h4>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                      Increase fraud detection sensitivity during <span style={{ color: '#f87171', fontWeight: '600' }}>11 PM - 4 AM</span> hours
                    </p>
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.25)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      display: 'inline-block',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{ color: '#f87171' }}>Risk: Elevated</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.1) 100%)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                    <h4 style={{ color: '#34d399', marginBottom: '0.75rem', fontWeight: '600' }}>
                      Pattern Analysis
                    </h4>
                    <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                      Analyze <span style={{ color: '#34d399', fontWeight: '600' }}>{dataInsights.overview.fraud_count}</span> fraud cases to identify emerging patterns
                    </p>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.25)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      display: 'inline-block',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{ color: '#34d399' }}>Insight: Actionable</span>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default App;
