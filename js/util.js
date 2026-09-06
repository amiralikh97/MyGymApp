export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function el(tag, props = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'style') n.style.cssText = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(n.dataset, v);
    else if (v !== null && v !== undefined && v !== false) n.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid === null || kid === undefined || kid === false) continue;
    n.append(kid.nodeType ? kid : document.createTextNode(kid));
  }
  return n;
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

/* ---------- time ---------- */
export function hms(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
}
export function dur(sec) {
  const m = Math.round(sec / 60);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
}
export const dayKey = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x.getTime(); };
export function fmtDate(ts) {
  const d = new Date(ts), now = new Date();
  const diff = Math.round((dayKey(now) - dayKey(d)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7 && diff > 0) return d.toLocaleDateString(undefined, { weekday: 'long' });
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}) });
}
export const fmtTime = ts => new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

/* ---------- numbers ---------- */
export function nf(n, dp = 1) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  const r = Math.round(n * 10 ** dp) / 10 ** dp;
  return Number.isInteger(r) ? String(r) : r.toFixed(dp);
}
export function bigN(n) {
  if (n >= 1e6) return nf(n / 1e6, 1) + 'M';
  if (n >= 1000) return nf(n / 1000, 1) + 'k';
  return nf(n, 0);
}
export const KG_LB = 2.2046226218;
export const toKg = (v, unit) => unit === 'lb' ? v / KG_LB : v;
export const fromKg = (v, unit) => unit === 'lb' ? v * KG_LB : v;

/* ---------- training math ---------- */
// Epley formula, capped: beyond ~12 reps the estimate stops being meaningful.
export function e1rm(weight, reps) {
  if (!weight || !reps) return 0;
  if (reps === 1) return weight;
  return weight * (1 + Math.min(reps, 15) / 30);
}

// Load actually moved by a set, in the app's base unit (kg).
export function setLoad(set, ex) {
  if (set.wl != null || set.wr != null) return (Number(set.wl) || 0) + (Number(set.wr) || 0);
  const w = Number(set.w) || 0;
  return ex?.paired && !ex?.uni ? w * 2 : w;
}
// Weight "per implement" - what you compare between sessions.
export function setWeight(set) {
  if (set.wl != null || set.wr != null) {
    const a = Number(set.wl) || 0, b = Number(set.wr) || 0;
    return (a + b) / ((set.wl != null && set.wr != null) ? 2 : 1);
  }
  return Number(set.w) || 0;
}
export const setVolume = (set, ex) => setLoad(set, ex) * (Number(set.reps) || 0);
export const isWorking = s => s.done && s.type !== 'warmup';

export function debounce(fn, ms = 250) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
