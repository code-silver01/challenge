/**
 * API client — calls the orchestrator which fans out to agents.
 * Falls back to local processing when backend is unavailable.
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function analyzeCart(payload) {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using local agents:', err.message);
    return null; // caller uses local fallback
  }
}

export async function ocrImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/ocr`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`OCR error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('OCR unavailable:', err.message);
    return null;
  }
}
