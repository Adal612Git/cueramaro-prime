import { env } from '../safety/env';
const BASE = env.VITE_API_BASE;
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
async function request(path: string, init?: RequestInit, retries = 2) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const url = path.startsWith('/') ? BASE + path : BASE + '/' + path;
    const res = await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: { accept: 'application/json', ...(init?.headers || {}) },
    });
    if (!res.ok) {
      if (retries > 0 && (res.status >= 500 || res.status === 429)) {
        await sleep(400 * (3 - retries));
        return request(path, init, retries - 1);
      }
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} @ ${url} :: ${text}`);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  } finally {
    clearTimeout(t);
  }
}
export const api = { health: () => request('/health'), productos: () => request('/productos') };
