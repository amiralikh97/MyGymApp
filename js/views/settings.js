import { el, nf, mount } from '../util.js';
import { toast, openSheet, confirmSheet } from '../ui.js';
import { state, commit, exportData, importData, wipe, stats } from '../store.js';
import { beep, primeAudio } from '../timer.js';

const U = () => state.settings.unit;

export function open(ctx) {
  openSheet('Settings', close => {
    const s = state.settings;
    const body = el('div', {});

    const toggle = (label, key, hint) => {
      const sw = el('div', { class: 'sw' + (s[key] ? ' on' : '') });
      return el('button', { class: 'srow', style: 'width:100%;text-align:left', onclick: () => { s[key] = !s[key]; sw.classList.toggle('on', s[key]); commit(); } },
        el('label', {}, label, hint ? el('div', { class: 'tiny faint', style: 'font-weight:400' }, hint) : null), sw);
    };

    /* units */
    const unitSeg = el('div', { class: 'seg', style: 'width:150px' });
    const drawUnit = () => {
      unitSeg.innerHTML = '';
      ['kg', 'lb'].forEach(u => unitSeg.append(el('button', {
        class: s.unit === u ? 'on' : '', onclick: () => { s.unit = u; commit(); drawUnit(); ctx.refresh(); }
      }, u)));
    };
    drawUnit();

    const themeSeg = el('div', { class: 'seg', style: 'width:190px' });
    const drawTheme = () => {
      themeSeg.innerHTML = '';
      [['auto', 'Auto'], ['dark', 'Dark'], ['light', 'Light']].forEach(([k, label]) => themeSeg.append(el('button', {
        class: s.theme === k ? 'on' : '', onclick: () => { s.theme = k; commit(); drawTheme(); applyTheme(); }
      }, label)));
    };
    drawTheme();

    const num = (key, min, max, step = 5) => {
      const i = el('input', { type: 'number', inputmode: 'numeric', value: s[key], min, max, step });
      i.addEventListener('input', () => { const v = Number(i.value); if (!Number.isNaN(v)) { s[key] = Math.min(max, Math.max(min, v)); commit(); } });
      return i;
    };

    body.append(el('div', { class: 'card' },
      el('div', { class: 'pill-h', style: 'margin-bottom:4px' }, 'Preferences'),
      el('div', { class: 'srow' }, el('label', {}, 'Weight unit'), unitSeg),
      el('div', { class: 'srow' }, el('label', {}, 'Theme'), themeSeg),
      el('div', { class: 'srow' }, el('label', {}, 'Default rest', el('div', { class: 'tiny faint', style: 'font-weight:400' }, 'Seconds between working sets')), num('restDefault', 0, 900)),
      el('div', { class: 'srow' }, el('label', {}, 'Warm-up rest', el('div', { class: 'tiny faint', style: 'font-weight:400' }, 'Seconds after a warm-up set')), num('restWarmup', 0, 900)),
      toggle('Start rest timer automatically', 'autoRest', 'When you tick a set complete'),
      toggle('Sound', 'sound', 'Beeps when rest ends'),
      toggle('Vibrate', 'vibrate', 'On supported phones'),
      toggle('Keep screen awake', 'keepAwake', 'While a rest timer is running'),
      el('button', { class: 'btn sm ghost', style: 'margin-top:8px', onclick: () => { primeAudio(); beep(880, 180); beep(1180, 260, .18); toast('Test sound played'); } }, 'Test alert sound')));

    /* plate calculator */
    body.append(el('div', { class: 'card', style: 'margin-top:12px' },
      el('div', { class: 'pill-h', style: 'margin-bottom:8px' }, 'Tools'),
      el('button', { class: 'btn wide', onclick: () => { close(); setTimeout(plateCalc, 270); } }, 'Barbell plate calculator'),
      el('button', { class: 'btn wide ghost', style: 'margin-top:8px', onclick: () => { close(); setTimeout(oneRepMax, 270); } }, '1-rep-max calculator')));

    /* data */
    const st = stats();
    body.append(el('div', { class: 'card', style: 'margin-top:12px' },
      el('div', { class: 'pill-h', style: 'margin-bottom:8px' }, 'Your data'),
      el('div', { class: 'muted small', style: 'margin-bottom:10px' },
        `${st.workouts} workouts · ${st.totalSets} sets · ${state.custom.length} custom exercises. Everything is stored only on this device — nothing is uploaded anywhere.`),
      el('button', { class: 'btn wide', onclick: doExport }, 'Export backup (.json)'),
      el('button', { class: 'btn wide', style: 'margin-top:8px', onclick: () => doImport(ctx) }, 'Import backup'),
      el('button', {
        class: 'btn wide danger', style: 'margin-top:8px',
        onclick: async () => {
          if (await confirmSheet('Erase everything?', 'All workouts, routines and custom exercises will be permanently deleted from this device. Export a backup first if you are not sure.', 'Erase all data')) {
            wipe(); close(); ctx.refresh(); toast('All data erased');
          }
        }
      }, 'Erase all data')));

    body.append(el('div', { class: 'center tiny faint', style: 'padding:22px 0 4px' },
      'Iron Log · works offline · v1.0',
      el('div', { style: 'margin-top:4px' }, 'Add to your home screen for a full-screen app.')));
    return body;
  });
}

export function applyTheme() {
  const t = state.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}

function doExport() {
  const blob = new Blob([exportData()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: `ironlog-backup-${new Date().toISOString().slice(0, 10)}.json` });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('Backup downloaded');
}

function doImport(ctx) {
  const inp = el('input', { type: 'file', accept: 'application/json,.json', style: 'display:none' });
  inp.addEventListener('change', async () => {
    const f = inp.files[0]; if (!f) return;
    try {
      const text = await f.text();
      const merge = await confirmSheet('Import backup', 'Merge with your existing data, or replace everything? Replace deletes what is on this device first.', 'Merge', false);
      importData(text, merge);
      toast('Backup imported'); ctx.refresh();
    } catch (e) { toast('Could not read that file'); }
    inp.remove();
  });
  document.body.append(inp); inp.click();
}

/* ---------------- plate calculator ---------------- */
function plateCalc() {
  openSheet('Plate calculator', () => {
    const wrap = el('div', { class: 'stack' });
    const barIn = el('input', { type: 'number', value: U() === 'kg' ? 20 : 45, inputmode: 'decimal' });
    const target = el('input', { type: 'number', placeholder: 'Target weight', inputmode: 'decimal', enterkeyhint: 'go' });
    const out = el('div', { class: 'card' });

    const PLATES = U() === 'kg' ? [25, 20, 15, 10, 5, 2.5, 1.25] : [45, 35, 25, 10, 5, 2.5];

    const calc = () => {
      const t = Number(target.value), bar = Number(barIn.value) || 0;
      out.innerHTML = '';
      if (!t) { out.append(el('div', { class: 'muted small center' }, 'Enter a target weight.')); return; }
      let side = (t - bar) / 2;
      if (side < 0) { out.append(el('div', { class: 'muted small center' }, 'That is lighter than the bar.')); return; }
      const used = [];
      for (const p of PLATES) { const n = Math.floor(side / p + 1e-9); if (n) { used.push([p, n]); side -= n * p; } }
      mount(out,
        el('div', { class: 'pill-h', style: 'margin-bottom:8px' }, 'Per side'),
        used.length
          ? el('div', { class: 'row wrap' }, ...used.map(([p, n]) => el('span', { class: 'chip tag', style: 'font-size:14px;padding:8px 13px' }, `${n} × ${nf(p, 2)}`)))
          : el('div', { class: 'muted small' }, 'Just the bar.'),
        side > 0.01 ? el('div', { class: 'tiny', style: 'margin-top:10px;color:var(--amber)' }, `${nf(side * 2, 2)} ${U()} short — closest you can load is ${nf(t - side * 2, 2)} ${U()}.`) : null);
    };
    [barIn, target].forEach(i => i.addEventListener('input', calc));
    calc();
    setTimeout(() => target.focus(), 320);

    wrap.append(
      el('div', { class: 'row' },
        el('div', { style: 'flex:1' }, el('div', { class: 'pill-h', style: 'margin-bottom:5px' }, 'Bar weight (' + U() + ')'), barIn),
        el('div', { style: 'flex:1' }, el('div', { class: 'pill-h', style: 'margin-bottom:5px' }, 'Target (' + U() + ')'), target)),
      out,
      el('div', { class: 'tiny faint center' }, 'Assumes a matching pair of plates on each side.'));
    return wrap;
  });
}

/* ---------------- 1RM calculator ---------------- */
function oneRepMax() {
  openSheet('1-rep-max calculator', () => {
    const wrap = el('div', { class: 'stack' });
    const wIn = el('input', { type: 'number', placeholder: 'Weight', inputmode: 'decimal' });
    const rIn = el('input', { type: 'number', placeholder: 'Reps', inputmode: 'numeric' });
    const out = el('div', { class: 'card' });
    const calc = () => {
      const w = Number(wIn.value), r = Number(rIn.value);
      out.innerHTML = '';
      if (!w || !r) { out.append(el('div', { class: 'muted small center' }, 'Enter a weight and rep count.')); return; }
      const max = w * (1 + Math.min(r, 15) / 30);
      mount(out,
        el('div', { class: 'center' },
          el('div', { class: 'clock mono' }, nf(max, 1) + ' ' + U()),
          el('div', { class: 'tiny faint' }, 'estimated 1 rep max')),
        el('div', { class: 'divider' }),
        ...[[0.95, 2], [0.9, 4], [0.85, 6], [0.8, 8], [0.75, 10], [0.7, 12]].map(([pct, reps]) =>
          el('div', { class: 'srow' },
            el('label', {}, `${Math.round(pct * 100)}%`),
            el('div', { class: 'mono' }, `${nf(max * pct, 1)} ${U()}`),
            el('div', { class: 'tiny faint', style: 'width:64px;text-align:right' }, `~${reps} reps`))));
    };
    [wIn, rIn].forEach(i => i.addEventListener('input', calc));
    calc();
    wrap.append(el('div', { class: 'row' },
      el('div', { style: 'flex:1' }, el('div', { class: 'pill-h', style: 'margin-bottom:5px' }, 'Weight (' + U() + ')'), wIn),
      el('div', { style: 'flex:1' }, el('div', { class: 'pill-h', style: 'margin-bottom:5px' }, 'Reps'), rIn)),
      out,
      el('div', { class: 'tiny faint center' }, 'Epley formula. Estimates get rough above about 12 reps.'));
    return wrap;
  });
}
