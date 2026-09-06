import { el, nf, mount } from '../util.js';
import { toast, openSheet, confirmSheet } from '../ui.js';
import { state, commit, exportData, importData, wipe, stats, clearChat } from '../store.js';
import { beep, primeAudio } from '../timer.js';
import { NVIDIA_URL, DEFAULT_MODEL, aiReady } from '../ai.js';

const U = () => state.settings.unit;
export const BUILD = '2026.09.06b';

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

    /* AI coach */
    body.append(el('div', { class: 'card', style: 'margin-top:12px' },
      el('div', { class: 'pill-h', style: 'margin-bottom:6px' }, 'AI Coach'),
      el('div', { class: 'muted small', style: 'margin-bottom:10px' },
        aiReady()
          ? 'Connected. Tap the robot button on the Train screen to chat.'
          : 'Not set up yet. The coach can read your history, suggest plans and add exercises for you.'),
      el('button', { class: 'btn wide' + (aiReady() ? '' : ' primary'), onclick: () => { close(); setTimeout(() => openAISetup(ctx), 270); } },
        aiReady() ? 'AI connection settings' : 'Set up the AI coach'),
      state.chat.length
        ? el('button', {
            class: 'btn wide ghost', style: 'margin-top:8px',
            onclick: async () => {
              if (await confirmSheet('Clear conversation?', 'Your chat history with the coach will be deleted. Your workouts are not affected.', 'Clear chat')) {
                clearChat(); toast('Chat cleared');
              }
            }
          }, `Clear conversation (${state.chat.length} messages)`)
        : null));

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
      'Iron Log · works offline · build ' + BUILD,
      el('div', { style: 'margin-top:4px' }, 'Add to your home screen for a full-screen app.'),
      el('button', {
        class: 'btn sm ghost', style: 'margin-top:10px',
        onclick: async () => {
          toast('Checking for updates…');
          try {
            const regs = await navigator.serviceWorker?.getRegistrations?.() || [];
            await Promise.all(regs.map(r => r.update()));
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
            toast('Reloading with the latest version…');
            setTimeout(() => location.reload(), 700);
          } catch (e) { location.reload(); }
        }
      }, 'Force update')));
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


/* ---------------- AI connection ---------------- */
export function openAISetup(ctx) {
  openSheet('AI Coach setup', close => {
    const ai = state.settings.ai;
    const wrap = el('div', { class: 'stack' });

    const url = el('input', { type: 'url', placeholder: 'https://your-proxy.workers.dev/v1/chat/completions', value: ai.url || '' });
    const key = el('input', { type: 'password', placeholder: 'nvapi-…', value: ai.key || '' });
    const model = el('input', { type: 'text', placeholder: DEFAULT_MODEL, value: ai.model || DEFAULT_MODEL });
    const status = el('div', { class: 'small', style: 'min-height:20px' });

    const field = (label, node, hint) => el('div', {},
      el('div', { class: 'pill-h', style: 'margin-bottom:5px' }, label), node,
      hint ? el('div', { class: 'tiny faint', style: 'margin-top:5px' }, hint) : null);

    // Becomes "Start chatting" once a test succeeds, so setup leads somewhere.
    const done = el('button', {
      class: 'btn wide ghost',
      onclick: () => {
        const go = done.dataset.go === '1';
        close();
        // A custom event keeps settings.js from importing chat.js, which would
        // close an import cycle back through app.js.
        if (go) document.dispatchEvent(new CustomEvent('ironlog:open-chat'));
      }
    }, 'Done');

    const persist = () => {
      ai.url = url.value.trim();
      ai.key = key.value.trim();
      ai.model = model.value.trim() || DEFAULT_MODEL;
      commit();
    };
    [url, key, model].forEach(i => i.addEventListener('input', persist));

    mount(wrap,
      el('div', { class: 'note warn' },
        el('div', { style: 'font-weight:650;margin-bottom:6px' }, 'Read this first'),
        el('div', { class: 'small' },
          "NVIDIA's API sends no CORS headers, so a browser cannot call it directly \u2014 it will always fail with " +
          "\u201cCould not reach the AI endpoint\u201d. You need a small proxy in between. " +
          "A proxy also keeps your API key off this device and out of your public repository, " +
          "where anyone could read it from the page source.")),

      el('button', { class: 'btn wide', onclick: () => { close(); setTimeout(() => proxyHelp(), 270); } },
        'How to set up the free proxy'),

      field('Endpoint URL', url,
        'Your proxy address. Only use NVIDIA\u2019s own URL if you are running the app somewhere that bypasses CORS.'),
      field('API key', key,
        'Stored only in this browser, never in the repo, never in exported backups. Leave blank if your proxy holds the key.'),
      field('Model', model, 'Any model your endpoint accepts.'),

      el('div', { class: 'row', style: 'gap:8px' },
        el('button', {
          class: 'btn primary', style: 'flex:1',
          onclick: async () => {
            persist();
            if (!ai.url) { status.textContent = 'Enter an endpoint URL first.'; status.style.color = 'var(--amber)'; return; }
            status.textContent = 'Testing\u2026'; status.style.color = 'var(--text-dim)';
            try {
              const r = await fetch(ai.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(ai.key ? { Authorization: 'Bearer ' + ai.key } : {}) },
                body: JSON.stringify({ model: ai.model, messages: [{ role: 'user', content: 'Reply with exactly: OK' }], max_tokens: 10, temperature: 0 })
              });
              if (!r.ok) {
                const t = await r.text().catch(() => '');
                status.textContent = 'HTTP ' + r.status + '. ' + t.slice(0, 140);
                status.style.color = 'var(--red)';
                return;
              }
              const j = await r.json();
              const reply = j.choices?.[0]?.message?.content?.trim();
              status.textContent = reply ? 'Connected \u2014 model replied \u201c' + reply.slice(0, 40) + '\u201d' : 'Connected, but the reply was empty.';
              status.style.color = reply ? 'var(--green)' : 'var(--amber)';
              ctx.refresh();
              if (reply) { done.classList.remove('ghost'); done.classList.add('primary'); done.textContent = 'Start chatting'; done.dataset.go = '1'; }
            } catch (e) {
              status.textContent = 'Blocked by the browser (CORS) or unreachable. This is what happens when you point straight at NVIDIA \u2014 set up the proxy.';
              status.style.color = 'var(--red)';
            }
          }
        }, 'Test connection'),
        el('button', {
          class: 'btn', onclick: () => { url.value = NVIDIA_URL; persist(); status.textContent = 'Direct NVIDIA URL set \u2014 expect this to be blocked in a browser.'; status.style.color = 'var(--amber)'; }
        }, 'Use NVIDIA URL')),
      status, done);
    return wrap;
  });
}

function proxyHelp() {
  openSheet('Free AI proxy setup', close => {
    const step = (n, title, ...kids) => el('div', { class: 'card' },
      el('div', { class: 'row', style: 'margin-bottom:6px' },
        el('span', { class: 'chip tag' }, String(n)),
        el('div', { style: 'font-weight:650' }, title)),
      ...kids);
    const code = t => el('pre', { class: 'code' }, t);

    return el('div', { class: 'stack' },
      el('p', { class: 'small muted', style: 'margin:0' },
        'A proxy is a few lines of code that sit between this app and NVIDIA. It adds the CORS headers the browser needs, and it holds your API key so the key never ships inside your public website. Cloudflare\u2019s free tier covers 100,000 requests a day \u2014 far more than you will use.'),
      step(1, 'Create a free Cloudflare account',
        el('div', { class: 'small' }, 'Go to dash.cloudflare.com and sign up. No card needed.')),
      step(2, 'Make a Worker',
        el('div', { class: 'small' }, 'In the dashboard: Compute (Workers) \u2192 Create \u2192 Start from Hello World \u2192 Deploy. Give it any name.')),
      step(3, 'Paste in the proxy code',
        el('div', { class: 'small', style: 'margin-bottom:8px' },
          'Click Edit code, delete what is there, and paste the contents of ',
          el('code', {}, 'proxy/cloudflare-worker.js'),
          ' from your project folder. Then Deploy.')),
      step(4, 'Add your API key as a secret',
        el('div', { class: 'small', style: 'margin-bottom:8px' },
          'Worker \u2192 Settings \u2192 Variables and Secrets \u2192 Add. Name it exactly ',
          el('code', {}, 'NVIDIA_API_KEY'),
          ', paste your nvapi- key as the value, and encrypt it. Deploy again.')),
      step(5, 'Lock it to your site',
        el('div', { class: 'small', style: 'margin-bottom:8px' },
          'Add a second variable (plain text, not secret) named ',
          el('code', {}, 'ALLOWED_ORIGIN'),
          ' set to your site address, so only your app can use your key:'),
        code('https://amiralikh97.github.io')),
      step(6, 'Point the app at it',
        el('div', { class: 'small', style: 'margin-bottom:8px' }, 'Copy your Worker URL and add /v1/chat/completions to the end. Paste that as the Endpoint URL, and leave the API key field empty \u2014 the Worker holds it.'),
        code('https://iron-log.YOUR-NAME.workers.dev/v1/chat/completions')),
      el('button', { class: 'btn wide primary', onclick: close }, 'Got it'));
  });
}
