import React, { useState } from 'react';
import { Key, Shield, CheckCircle2, XCircle, ArrowRight, Zap, RefreshCw, Layers, Lock, Unlock } from 'lucide-react';
import { api } from '../services/api';

export default function KeyGenerator({ activeKey, onSetActiveKey, onNavigate, onShowToast }) {
  const [mode, setMode] = useState('manual'); // 'manual' | 'random'
  const [pInput, setPInput] = useState('61');
  const [qInput, setQInput] = useState('53');
  const [eInput, setEInput] = useState('17');
  const [bits, setBits] = useState(16);
  const [isLoading, setIsLoading] = useState(false);

  // Preset textbook examples commonly used in academic textbooks & viva
  const presets = [
    { label: 'Sample 1: p=61, q=53, e=17', p: '61', q: '53', e: '17' },
    { label: 'Sample 2: p=17, q=11, e=7', p: '17', q: '11', e: '7' },
    { label: 'Sample 3: p=7, q=19, e=5', p: '7', q: '19', e: '5' },
    { label: 'Sample 4: p=13, q=11, e=13', p: '13', q: '11', e: '13' },
  ];

  const applyPreset = (preset) => {
    setMode('manual');
    setPInput(preset.p);
    setQInput(preset.q);
    setEInput(preset.e);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      let res;
      if (mode === 'manual') {
        if (!pInput || !qInput) {
          throw new Error('Please enter both prime numbers p and q.');
        }
        res = await api.generateKey({
          p: pInput,
          q: qInput,
          e: eInput || undefined,
        });
      } else {
        res = await api.generateKey({
          bits: Number(bits),
          e: eInput ? Number(eInput) : undefined,
        });
        // Populate inputs with generated values
        setPInput(res.p);
        setQInput(res.q);
        setEInput(res.e);
      }

      onSetActiveKey(res);
      onShowToast('✓ RSA Key Pair generated successfully!', 'success');
    } catch (err) {
      onShowToast(err.message || 'Key generation failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/30 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-xs font-mono text-cyan-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>CNS Course Project</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              RSA Key Generation System
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Demonstrates step-by-step calculation of modulus $n = p \times q$, Euler's Totient $\phi(n) = (p-1)(q-1)$, public exponent $e$, and private exponent $d$.
            </p>
          </div>

          {activeKey && (
            <button
              onClick={() => onNavigate('cipher')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer self-start sm:self-center"
            >
              <span>Test in Encryption</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Input Configuration Card */}
      <div className="rounded-2xl p-6 bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        {/* Mode Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">1. Select Input Method:</h3>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                mode === 'manual' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Enter Primes Manually (e.g. p=61, q=53)
            </button>
            <button
              type="button"
              onClick={() => setMode('random')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                mode === 'random' ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Generate Random Primes
            </button>
          </div>
        </div>

        {/* Quick Presets (Only in manual mode) */}
        {mode === 'manual' && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">Quick Academic Samples for Viva:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 transition-colors font-mono cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          {mode === 'manual' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Prime Number p:</label>
                <input
                  type="number"
                  value={pInput}
                  onChange={(e) => setPInput(e.target.value)}
                  placeholder="e.g. 61"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Prime Number q:</label>
                <input
                  type="number"
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                  placeholder="e.g. 53"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Public Exponent e (Optional):</label>
                <input
                  type="number"
                  value={eInput}
                  onChange={(e) => setEInput(e.target.value)}
                  placeholder="e.g. 17 or leave blank"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Random Prime Size:</label>
                <select
                  value={bits}
                  onChange={(e) => setBits(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value={8}>8-bit (Small Primes ~ 128 - 255)</option>
                  <option value={16}>16-bit (Standard Demo Primes)</option>
                  <option value={32}>32-bit (Larger Demo Primes)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Public Exponent e (Optional):</label>
                <input
                  type="number"
                  value={eInput}
                  onChange={(e) => setEInput(e.target.value)}
                  placeholder="Auto-select if empty (e.g. 65537, 17, 3)"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Calculating RSA Parameters...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Calculate &amp; Generate RSA Key Pair</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 6-Step Mathematical Breakdown */}
      {activeKey && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Step-by-Step RSA Mathematical Process</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
              6 of 6 Steps Complete ✓
            </span>
          </div>

          {/* Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {activeKey.steps?.map((st) => (
              <div
                key={st.step}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 shadow-md"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-cyan-300 font-bold border border-blue-800 text-[11px]">
                    Step {st.step}
                  </span>
                  <span className="font-bold text-slate-300">{st.symbol}</span>
                </div>

                <div className="font-sans font-bold text-slate-100 text-sm">{st.title}</div>

                <div className="p-2 rounded-lg bg-slate-950 text-cyan-200 border border-slate-900 font-mono text-[11px] overflow-x-auto">
                  {st.formula}
                </div>

                <div className="text-slate-400 font-sans text-xs">{st.description}</div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Value:</span>
                  <span className="text-emerald-400 font-bold text-sm truncate max-w-[70%]" title={st.value}>
                    {st.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Public and Private Key Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public Key */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Unlock className="w-4 h-4" />
                  <span>Public Key: (e, n)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Share Publicly
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Public Key Pair:</span>
                  <div className="text-cyan-300 text-base font-bold">
                    (e = {activeKey.e}, n = {activeKey.n})
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Used by anyone to encrypt messages sent to you, or to verify your digital signatures.
                </p>
              </div>
            </div>

            {/* Private Key */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/30 border border-purple-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Private Key: (d, n)</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  Keep Secret
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Private Key Pair:</span>
                  <div className="text-purple-300 text-base font-bold">
                    (d = {activeKey.d}, n = {activeKey.n})
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Kept strictly secret. Used to decrypt ciphertexts encrypted with your public key.
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Verification Status Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">Mathematical Verification Checks:</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400">
                <span>✓</span>
                <span>gcd(e, φ(n)) = {activeKey.verification?.gcd_e_phi || 1}</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span>✓</span>
                <span>(e × d) mod φ(n) = {activeKey.verification?.ed_mod_phi || 1}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                {activeKey.verification?.status_text || '✓ RSA key generation successful'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
