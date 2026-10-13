import React, { useState, useEffect } from 'react';
import { Database, Trash2, ArrowRight, RefreshCw, Key } from 'lucide-react';
import { api } from '../services/api';

export default function KeyHistory({ onSetActiveKey, onNavigate, onShowToast }) {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistoryList(data || []);
    } catch (err) {
      onShowToast(err.message || 'Failed to load history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete key record #${id}?`)) return;
    try {
      await api.deleteHistory(id);
      onShowToast(`Key record #${id} deleted.`, 'info');
      loadHistory();
    } catch (err) {
      onShowToast(err.message || 'Failed to delete.', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Delete all history records?')) return;
    try {
      await api.clearHistory();
      onShowToast('All records cleared.', 'info');
      loadHistory();
    } catch (err) {
      onShowToast(err.message || 'Failed to clear.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Database className="w-6 h-6 text-cyan-400" />
            <span>Key Generation History (SQLite Database)</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Persisted records of previously generated RSA key pairs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {historyList.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}

          <button
            onClick={loadHistory}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-slate-400">
            Loading SQLite records...
          </div>
        ) : historyList.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-slate-400">
            No keys generated yet. Click on "Key Generation" tab to generate your first key!
          </div>
        ) : (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Prime p</th>
                  <th className="py-2.5 px-3">Prime q</th>
                  <th className="py-2.5 px-3">Modulus n (p × q)</th>
                  <th className="py-2.5 px-3">φ(n)</th>
                  <th className="py-2.5 px-3">e (Public)</th>
                  <th className="py-2.5 px-3">d (Private)</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {historyList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 text-slate-300">
                    <td className="py-3 px-3 text-cyan-400 font-bold">#{item.id}</td>
                    <td className="py-3 px-3 text-cyan-300">{item.p}</td>
                    <td className="py-3 px-3 text-cyan-300">{item.q}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">{item.n}</td>
                    <td className="py-3 px-3 text-slate-400">{item.phi}</td>
                    <td className="py-3 px-3 text-purple-300">{item.e}</td>
                    <td className="py-3 px-3 text-purple-300">{item.d}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSetActiveKey(item);
                            onNavigate('cipher');
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-cyan-300 transition-colors cursor-pointer"
                          title="Use in Cipher Demo"
                        >
                          Use Key
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
