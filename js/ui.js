import { $, el } from './util.js';

/* ---------------- icons ---------------- */
const P = {
  dumbbell: 'M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11',
  history: 'M3 12a9 9 0 1 0 3-6.7M3 4v4h4M12 7v5l3.5 2',
  book: 'M4 4.5A1.5 1.5 0 0 1 5.5 3H19a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 0 4 19.5v-15z M4 19.5A1.5 1.5 0 0 0 5.5 21H20 M8 7.5h8 M8 11h5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  cog: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  chev: 'm9 18 6-6-6-6',
  up: 'm18 15-6-6-6 6',
  down: 'm6 9 6 6 6-6',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6',
  play: 'm6 3 15 9L6 21z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-5M12 8h.01',
  timer: 'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 10v4l2.5 2M9 2h6',
  search: 'm21 21-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  note: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5',
  flame: 'M12 22c4 0 7-2.7 7-6.5 0-4.6-4.5-6-4.5-9.5 0 0-2 1.4-2 4 0 1.5-1 2-1.5 2-1 0-1.5-1-1.5-2.5C8 12 5 13 5 15.5 5 19.3 8 22 12 22z',
  copy: 'M9 9h10v12H9zM5 15V3h10v2'
};
export function icon(name, cls = '') {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  if (cls) s.setAttribute('class', cls);
  P[name].split(' M').forEach((d, i) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', i === 0 ? d : 'M' + d);
    s.append(p);
  });
  return s;
}

/* ---------------- toast ---------------- */
let toastTimer;
export function toast(msg, ms = 1900) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('up');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('up'), ms);
}

/* ---------------- bottom sheet ---------------- */
let sheetClose = null;
let closeTimer = null;   // pending teardown from a close animation
export function openSheet(title, buildBody, onClose) {
  const sheet = $('#sheet'), scrim = $('#scrim'), body = $('#sheetBody');
  // A sheet opened while another is still animating out must not be torn
  // down by that animation's cleanup.
  clearTimeout(closeTimer); closeTimer = null;
  $('#sheetTitle').textContent = title;
  body.innerHTML = '';
  body.scrollTop = 0;
  const content = buildBody(closeSheet);
  if (content) body.append(content);
  sheet.classList.remove('hidden'); scrim.classList.remove('hidden');
  requestAnimationFrame(() => { sheet.classList.add('up'); scrim.classList.add('up'); });
  sheetClose = onClose || null;
  document.body.style.overflow = 'hidden';
}
export function closeSheet() {
  const sheet = $('#sheet'), scrim = $('#scrim');
  if (sheet.classList.contains('hidden')) return;
  sheet.classList.remove('up'); scrim.classList.remove('up');
  document.body.style.overflow = '';
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    closeTimer = null;
    sheet.classList.add('hidden'); scrim.classList.add('hidden'); $('#sheetBody').innerHTML = '';
  }, 260);
  const fn = sheetClose; sheetClose = null;
  fn?.();
}
export const sheetOpen = () => !$('#sheet').classList.contains('hidden');

export function confirmSheet(title, message, confirmLabel = 'Confirm', danger = true) {
  return new Promise(resolve => {
    let done = false;
    openSheet(title, close => el('div', { class: 'stack' },
      el('p', { class: 'muted', style: 'margin:0 0 6px' }, message),
      el('button', { class: 'btn wide ' + (danger ? 'danger' : 'primary'), onclick: () => { done = true; resolve(true); close(); } }, confirmLabel),
      el('button', { class: 'btn wide ghost', onclick: close }, 'Cancel')
    ), () => { if (!done) resolve(false); });
  });
}

export function promptSheet(title, { label = '', value = '', placeholder = '', type = 'text', ok = 'Save' } = {}) {
  return new Promise(resolve => {
    let done = false;
    openSheet(title, close => {
      const input = el('input', { type, value, placeholder, enterkeyhint: 'done' });
      const submit = () => { done = true; resolve(input.value.trim()); close(); };
      input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
      setTimeout(() => input.focus(), 320);
      return el('div', { class: 'stack' },
        label && el('div', { class: 'pill-h' }, label),
        input,
        el('button', { class: 'btn wide primary', onclick: submit }, ok));
    }, () => { if (!done) resolve(null); });
  });
}

/* ---------------- charts ---------------- */
const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (t, a = {}) => { const n = document.createElementNS(SVGNS, t); for (const k in a) n.setAttribute(k, a[k]); return n; };

/** Round a raw axis step up to a human-friendly 1/2/2.5/5 x 10^n value. */
function niceStep(raw) {
  if (!(raw > 0)) return 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
}

/**
 * Line chart with an optional dashed comparison series.
 * points: [{x:number(ts), y:number}]
 */
export function lineChart(points, { h = 170, fmt = null, series2 = null } = {}) {
  const W = 320, H = h, padL = 34, padR = 8, padT = 12, padB = 22;
  const svg = svgEl('svg', { class: 'chart', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', height: H });
  svg.style.height = H + 'px';
  if (!points.length) return svg;

  const all = [...points.map(p => p.y), ...(series2 || []).map(p => p.y)];
  let min = Math.min(...all), max = Math.max(...all);
  if (min === max) { min -= Math.max(1, min * .05); max += Math.max(1, max * .05); }
  const pad = (max - min) * .12; min = Math.max(0, min - pad); max += pad;
  // Snap the axis to round numbers so the labels read cleanly.
  const step = niceStep((max - min) / 3);
  min = Math.max(0, Math.floor(min / step) * step);
  max = Math.ceil(max / step) * step;
  const dp = step < 1 ? (step < .1 ? 2 : 1) : 0;
  const label = fmt || (v => v.toFixed(dp));
  const xs = points.map(p => p.x);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const X = v => padL + (x1 === x0 ? (W - padL - padR) / 2 : (v - x0) / (x1 - x0) * (W - padL - padR));
  const Y = v => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  // horizontal grid + y labels, one per round step
  for (let v = min; v <= max + 1e-9; v += step) {
    const y = Y(v);
    svg.append(svgEl('line', { class: 'grid', x1: padL, x2: W - padR, y1: y, y2: y }));
    const t = svgEl('text', { class: 'axis', x: 2, y: y + 3.5 });
    t.textContent = label(v);
    svg.append(t);
  }
  const path = ps => ps.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)} ${Y(p.y).toFixed(1)}`).join(' ');

  if (points.length > 1) {
    svg.append(svgEl('path', { class: 'area', d: `${path(points)} L${X(x1)} ${H - padB} L${X(x0)} ${H - padB} Z` }));
  }
  if (series2?.length) svg.append(svgEl('path', { class: 'ln2', d: path(series2) }));
  svg.append(svgEl('path', { class: 'ln', d: path(points) }));
  for (const p of points.slice(-40)) svg.append(svgEl('circle', { class: 'dot', cx: X(p.x), cy: Y(p.y), r: points.length > 25 ? 1.8 : 2.8 }));

  // x labels: first + last
  const lab = (v, anchor, x) => { const t = svgEl('text', { class: 'axis', x, y: H - 6, 'text-anchor': anchor }); t.textContent = new Date(v).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }); return t; };
  svg.append(lab(x0, 'start', padL));
  if (x1 !== x0) svg.append(lab(x1, 'end', W - padR));
  return svg;
}

/** Simple vertical bar chart. bars: [{label,value}] */
export function barChart(bars, { h = 130, fmt = v => v } = {}) {
  const W = 320, H = h, padB = 20, padT = 10;
  const svg = svgEl('svg', { class: 'chart', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none', height: H });
  svg.style.height = H + 'px';
  if (!bars.length) return svg;
  const max = Math.max(...bars.map(b => b.value), 1);
  const bw = W / bars.length;
  bars.forEach((b, i) => {
    const bh = (b.value / max) * (H - padB - padT);
    svg.append(svgEl('rect', {
      class: 'bar', x: i * bw + bw * .18, y: H - padB - bh,
      width: bw * .64, height: Math.max(bh, b.value > 0 ? 2 : 0), rx: 3,
      opacity: b.dim ? .35 : 1
    }));
    const t = svgEl('text', { class: 'axis', x: i * bw + bw / 2, y: H - 6, 'text-anchor': 'middle' });
    t.textContent = b.label;
    svg.append(t);
  });
  return svg;
}
