import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/90 text-emerald-100',
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/90 text-rose-100',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/90 text-amber-100',
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
      border: 'border-blue-500/40',
      bg: 'bg-blue-950/90 text-blue-100',
    },
  }[type] || {
    icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    border: 'border-blue-500/40',
    bg: 'bg-blue-950/90 text-blue-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${typeConfig.bg} ${typeConfig.border} min-w-[280px] max-w-md`}
      >
        {typeConfig.icon}
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          onClick={onClose}
          className="p-1 hover:opacity-80 rounded text-gray-400 hover:text-white transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
