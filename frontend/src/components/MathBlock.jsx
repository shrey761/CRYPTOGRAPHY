import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../utils/formatters';

export default function MathBlock({ title, formula, description, variables = {}, showCopy = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${formula}\n${Object.entries(variables).map(([k, v]) => `${k} = ${v}`).join('\n')}`;
    copyToClipboard(textToCopy, () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative rounded-xl bg-slate-900/90 border border-slate-700/70 p-4 shadow-lg overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>

      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-xs uppercase font-bold tracking-wider text-cyan-400 font-mono flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          {title}
        </h4>
        {showCopy && (
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-cyan-300 p-1 rounded hover:bg-slate-800 transition-colors"
            title="Copy formula & values"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>

      {formula && (
        <div className="my-2 px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-cyan-200 text-sm overflow-x-auto">
          {formula}
        </div>
      )}

      {description && (
        <p className="text-xs text-slate-400 mb-2 leading-relaxed">
          {description}
        </p>
      )}

      {Object.keys(variables).length > 0 && (
        <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1">
          {Object.entries(variables).map(([key, val]) => (
            <div key={key} className="flex items-baseline justify-between text-xs font-mono">
              <span className="text-slate-400 font-semibold">{key}:</span>
              <span className="text-emerald-400 font-mono-num ml-2 truncate max-w-[70%]" title={String(val)}>
                {String(val)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
