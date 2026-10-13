import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-16 text-slate-400 text-xs py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>RSA Key Generation System — CNS Course Project</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <button onClick={() => onNavigate('keygen')} className="hover:text-cyan-300 transition-colors cursor-pointer">
            Keygen
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('cipher')} className="hover:text-cyan-300 transition-colors cursor-pointer">
            Encrypt/Decrypt
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('history')} className="hover:text-cyan-300 transition-colors cursor-pointer">
            History
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('viva')} className="hover:text-cyan-300 transition-colors cursor-pointer">
            Viva Guide
          </button>
        </div>
      </div>
    </footer>
  );
}
