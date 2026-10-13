/**
 * Simple API Service for RSA Key Generation System
 */

const API_BASE = '/api';

export const api = {
  // Generate RSA Key Pair
  generateKey: async ({ p, q, e, bits = 16, label = '' }) => {
    const payload = { bits };
    if (p) payload.p = Number(p);
    if (q) payload.q = Number(q);
    if (e) payload.e = Number(e);
    if (label) payload.label = label;

    const res = await fetch(`${API_BASE}/rsa/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Key generation failed.');
    }
    return res.json();
  },

  // Encrypt Message
  encrypt: async ({ message, e, n }) => {
    const res = await fetch(`${API_BASE}/rsa/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, e: Number(e), n: Number(n) }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Encryption failed.');
    }
    return res.json();
  },

  // Decrypt Ciphertext
  decrypt: async ({ ciphertext, d, n }) => {
    const res = await fetch(`${API_BASE}/rsa/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ciphertext, d: Number(d), n: Number(n) }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Decryption failed.');
    }
    return res.json();
  },

  // Get Key History from SQLite
  getHistory: async () => {
    const res = await fetch(`${API_BASE}/rsa/history`);
    if (!res.ok) throw new Error('Failed to fetch history.');
    return res.json();
  },

  // Delete History Record
  deleteHistory: async (id) => {
    const res = await fetch(`${API_BASE}/rsa/history/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete history record.');
    return res.json();
  },

  // Clear All History
  clearHistory: async () => {
    const res = await fetch(`${API_BASE}/rsa/history`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear history.');
    return res.json();
  },
};
