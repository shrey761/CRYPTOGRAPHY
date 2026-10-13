import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import KeyGenerator from './pages/KeyGenerator';
import EncryptionPlayground from './pages/EncryptionPlayground';
import KeyHistory from './pages/KeyHistory';
import VivaGuide from './pages/VivaGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState('keygen');
  const [activeKey, setActiveKey] = useState(null);
  const [backendHealthy, setBackendHealthy] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: '', type: 'success' });
  };

  // Check backend health periodically
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setBackendHealthy(data.status === 'HEALTHY');
        } else {
          setBackendHealthy(false);
        }
      } catch {
        setBackendHealthy(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendHealthy={backendHealthy}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {activeTab === 'keygen' && (
          <KeyGenerator
            activeKey={activeKey}
            onSetActiveKey={setActiveKey}
            onNavigate={setActiveTab}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'cipher' && (
          <EncryptionPlayground
            activeKey={activeKey}
            onNavigate={setActiveTab}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'history' && (
          <KeyHistory
            onSetActiveKey={setActiveKey}
            onNavigate={setActiveTab}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'viva' && (
          <VivaGuide />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />

      {/* Toast Notification Container */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />
    </div>
  );
}
