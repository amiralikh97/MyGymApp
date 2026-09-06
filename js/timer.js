import { state } from './store.js';
import { $, el, hms } from './util.js';

/* ---------------- audio ---------------- */
let ctx = null;
function beep(freq = 880, ms = 140, when = 0, vol = .18) {
  if (!state.settings.sound) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .012);
    g.gain.exponentialRampToValueAtTime(.0001, t + ms / 1000);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + ms / 1000 + .02);
  } catch (e) { /* audio unavailable */ }
}
// iOS requires a user gesture before audio will play at all.
export function primeAudio() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch (e) {}
}
function buzz(pattern) {
  if (state.settings.vibrate && navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) {} }
}

/* ---------------- wake lock ---------------- */
let wake = null;
export async function keepAwake(on) {
  try {
    if (on && state.settings.keepAwake && 'wakeLock' in navigator) {
      wake = wake || await navigator.wakeLock.request('screen');
      wake.addEventListener?.('release', () => { wake = null; });
    } else if (!on && wake) { await wake.release(); wake = null; }
  } catch (e) { /* not supported / denied */ }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && rest.endAt) keepAwake(true);
});

/* ---------------- rest timer ---------------- */
export const rest = { endAt: 0, total: 0, label: '', tick: 0, warned: false };
const listeners = new Set();
export const onRest = fn => { listeners.add(fn); return () => listeners.delete(fn); };

export function startRest(seconds, label = '') {
  rest.total = seconds;
  rest.endAt = Date.now() + seconds * 1000;
  rest.label = label;
  rest.warned = false;
  keepAwake(true);
  render();
}
export function addRest(delta) {
  if (!rest.endAt) return;
  rest.endAt = Math.max(Date.now(), rest.endAt + delta * 1000);
  rest.total = Math.max(rest.total + delta, 1);
  render();
}
export function stopRest() {
  rest.endAt = 0; rest.label = '';
  clearInterval(rest.tick); rest.tick = 0;
  keepAwake(false);
  render();
}
export const restLeft = () => rest.endAt ? Math.max(0, (rest.endAt - Date.now()) / 1000) : 0;

function fire() { listeners.forEach(f => f()); }

function render() {
  const bar = $('#restBar'), box = $('#restInner');
  if (!bar) return;
  if (!rest.endAt) { bar.classList.remove('up'); box.innerHTML = ''; fire(); return; }

  const left = restLeft();
  const done = left <= 0;

  if (!box.dataset.built) {
    box.innerHTML = '';
    box.append(
      el('div', { class: 'rest-progress', id: 'restFill' }),
      el('button', { class: 'icon-btn', title: 'Subtract 15s', onclick: () => addRest(-15) },
        el('span', { style: 'font-size:12px;font-weight:700' }, '-15')),
      el('div', { style: 'flex:1;min-width:0' },
        el('div', { class: 'clock small mono', id: 'restClock' }, '0:00'),
        el('div', { class: 'tiny faint', id: 'restLabel' }, '')),
      el('button', { class: 'icon-btn', title: 'Add 15s', onclick: () => addRest(15) },
        el('span', { style: 'font-size:12px;font-weight:700' }, '+15')),
      el('button', { class: 'btn sm primary', onclick: stopRest }, 'Skip')
    );
    box.dataset.built = '1';
  }
  bar.classList.add('up');
  box.classList.toggle('done', done);
  $('#restClock').textContent = done ? 'Rest done' : hms(left);
  $('#restLabel').textContent = rest.label || '';
  $('#restFill').style.width = (100 - Math.min(100, left / rest.total * 100)) + '%';
  $('#restInner .btn').textContent = done ? 'Done' : 'Skip';

  if (!done && left <= 3.4 && !rest.warned) { rest.warned = 'tick'; beep(660, 90); beep(660, 90, 1); beep(660, 90, 2); }
  if (done && rest.warned !== 'end') {
    rest.warned = 'end';
    beep(880, 180); beep(1180, 260, .18);
    buzz([220, 90, 220]);
    setTimeout(() => { if (restLeft() <= 0) stopRest(); }, 4000);
  }
  fire();

  // 200ms is plenty: the bar animates via CSS, the clock only shows seconds.
  if (!rest.tick) rest.tick = setInterval(() => rest.endAt ? render() : stopRest(), 200);
}
export { beep };
