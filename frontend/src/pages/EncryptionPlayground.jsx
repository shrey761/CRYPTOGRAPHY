import React, { useState, useEffect } from 'react';
import { Lock, Unlock, CheckCircle2, ArrowRight, RefreshCw, Key } from 'lucide-react';
import { api } from '../services/api';

export default function EncryptionPlayground({ activeKey, onNavigate, onShowToast }) {
  const [eVal, setEVal] = useState(activeKey?.e || '17');
  const [dVal, setDVal] = useState(activeKey?.d || '2753');
  const [nVal, setNVal] = useState(activeKey?.n || '3233');

  const [message, setMessage] = useState('HELLO');
  const [encryptionResult, setEncryptionResult] = useState(null);
  const [decryptionResult, setDecryptionResult] = useState(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  useEffect(() => {
    if (activeKey) {
      setEVal(activeKey.e || '');
      setDVal(activeKey.d || '');
      setNVal(activeKey.n || '');
    }
  }, [activeKey]);

  const handleEncrypt = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) {
      onShowToast('Please enter a message or number to encrypt.', 'warning');
      return;
    }
    if (!eVal || !nVal) {
      onShowToast('Please provide public exponent e and modulus n.', 'warning');
      return;
    }

    setIsEncrypting(true);
    try {
      const res = await api.encrypt({
        message: message.trim(),
        e: eVal,
        n: nVal,
      });
      setEncryptionResult(res);
      onShowToast('Message encrypted with RSA!', 'success');

      // Auto-trigger decryption if private key is available
      if (dVal) {
        handleDecrypt(res.ciphertext);
      }
    } catch (err) {
      onShowToast(err.message || 'Encryption failed.', 'error');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async (cipherTextToUse) => {
    const cipher = cipherTextToUse || encryptionResult?.ciphertext;
    if (!cipher) {
      onShowToast('No ciphertext available to decrypt.', 'warning');
      return;
    }
    if (!dVal || !nVal) {
      onShowToast('Please provide private exponent d and modulus n.', 'warning');
      return;
    }

    setIsDecrypting(true);
    try {
      const res = await api.decrypt({
        ciphertext: cipher,
        d: dVal,
        n: nVal,
      });
      setDecryptionResult(res);
      onShowToast('Ciphertext decrypted successfully!', 'success');
    } catch (err) {
      onShowToast(err.message || 'Decryption failed.', 'error');
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 border border-purple-500/30 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Lock className="w-6 h-6 text-purple-400" />
          <span>RSA Encryption &amp; Decryption Demo</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-1">
          Demonstrate that the generated RSA keys actually work using textbook modular exponentiation:
          Encryption $c = m^e \bmod n$ and Decryption $m = c^d \bmod n$.
        </p>
      </div>

      {/* Key Configuration Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Active RSA Key Values for Encryption:</span>
          </span>
          {!activeKey && (
            <button
              onClick={() => onNavigate('keygen')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline cursor-pointer"
            >
              Generate a key pair first →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div>
            <label className="text-slate-400 font-bold block mb-1">Public Exponent (e):</label>
            <input
              type="number"
              value={eVal}
              onChange={(e) => setEVal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Private Exponent (d):</label>
            <input
              type="number"
              value={dVal}
              onChange={(e) => setDVal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-purple-300 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Modulus (n):</label>
            <input
              type="number"
              value={nVal}
              onChange={(e) => setNVal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Message Input & Action */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
          <span>Step 1: Enter Plaintext Message (Text or Number)</span>
        </h3>

        <div className="space-y-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. HELLO or a number like 65"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:border-cyan-500 focus:outline-none"
          />
          <div className="flex gap-2">
            {['HELLO', 'RSA', '65', '42'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setMessage(preset)}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                Sample: "{preset}"
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleEncrypt}
            disabled={isEncrypting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>Encrypt Message: c = m^e mod n</span>
          </button>
        </div>
      </div>

      {/* Encryption Result */}
      {encryptionResult && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl space-y-4 animate-fadeIn font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Step 2: Encryption Result</span>
            </h3>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
              Formula: c = (m^{eVal}) mod {nVal}
            </span>
          </div>

          <div className="space-y-3">
            {encryptionResult.ascii_values && (
              <div>
                <span className="text-slate-400 block mb-1">ASCII Character Codes (m):</span>
                <div className="p-2.5 rounded-lg bg-slate-950 text-slate-300 flex flex-wrap gap-2">
                  {encryptionResult.characters?.map((ch, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      '{ch}' = {encryptionResult.ascii_values[idx]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-slate-400 block mb-1">Ciphertext (c):</span>
              <div className="p-3 rounded-lg bg-slate-950 text-cyan-300 text-sm font-bold break-all border border-cyan-900/40">
                {encryptionResult.ciphertext}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decryption Result */}
      {decryptionResult && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/40 shadow-xl space-y-4 animate-fadeIn font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Unlock className="w-4 h-4 text-purple-400" />
              <span>Step 3: Decryption Result</span>
            </h3>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-purple-300">
              Formula: m = (c^{dVal}) mod {nVal}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 block mb-1">Recovered Plaintext Message:</span>
              <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-base font-bold border border-emerald-900/40 flex items-center justify-between">
                <span>{decryptionResult.decrypted_message}</span>
                {decryptionResult.decrypted_message === message && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matches Original Message ✓</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
