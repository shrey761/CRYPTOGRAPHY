/**
 * Formatting and Helper Utilities
 */

export function truncateString(str, head = 16, tail = 16) {
  if (!str) return '';
  const s = String(str);
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}...${s.slice(-tail)}`;
}

export function copyToClipboard(text, onSuccess, onError) {
  if (!navigator.clipboard) {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError(err);
    }
    document.body.removeChild(textArea);
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => {
      if (onSuccess) onSuccess();
    })
    .catch((err) => {
      if (onError) onError(err);
    });
}

export function formatDate(isoString) {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getBitBadgeColor(bitSize) {
  switch (Number(bitSize)) {
    case 64:
    case 128:
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 512:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 1024:
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 2048:
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    default:
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  }
}
