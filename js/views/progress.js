import { el, nf, fromKg, toKg, fmtDate, bigN, isWorking, setVolume } from '../util.js';
import { icon, openSheet, lineChart, barChart, toast, promptSheet, confirmSheet } from '../ui.js';
import { state, commit, allExercises, exercise, historyFor, personalBests, stats } from '../store.js';

const U = () => state.settings.unit;
const cv = kg => fromKg(kg, U());

export function render(main, ctx) {
  main.innerHTML = '';
  const v = el('div', { class: 'view stack' });
  const s = stats();

  if (!state.workouts.length) {
    v.append(el('div', { class: 'empty' },
      el('div', { class: 'big' }, '📈'),
      el('div', {}, 'No data yet.'),
      el('div', { class: 'small', style: 'margin-top:4px' }, 'Log a couple of workouts and your strength trends appear here.')));
    main.append(v); return;
  }

  /* ---- headline stats ---- */
  v.append(el('div', { class: 'stat-grid' },
    el('div', { class: 'stat' }, el('div', { class: 'v mono' }, s.thisWeek), el('div', { class: 'k' }, 'This week')),
    el('div', { class: 'stat' }, el('div', { class: 'v mono' }, s.streak), el('div', { class: 'k' }, 'Week streak')),
    el('div', { class: 'stat' }, el('div', { class: 'v mono' }, bigN(cv(s.totalVol))), el('div', { class: 'k' }, 'Total volume ' + U())),
    el('div', { class: 'stat' }, el('div', { class: 'v mono' }, s.workouts), el('div', { class: 'k' }, 'Workouts'))));

  /* ---- weekly volume trend ---- */
  const week = 7 * 864e5, now = Date.now();
  const vols = [];
  for (let i = 7; i >= 0; i--) {
    const from = now - (i + 1) * week, to = now - i * week;
    const tot = state.workouts.filter(w => w.start > from && w.start <= to)
      .reduce((a, w) => a + w.entries.reduce((b, e) => b + e.sets.filter(isWorking).reduce((c, st) => c + setVolume(st, exercise(e.exerciseId)), 0), 0), 0);
    vols.push({ label: i === 0 ? 'now' : (i % 2 === 0 ? `-${i}w` : ''), value: cv(tot) });
  }
  v.append(el('div', { class: 'card' },
    el('div', { class: 'pill-h', style: 'margin-bottom:4px' }, `Weekly volume (${U()})`),
    barChart(vols, { h: 120 }),
    el('div', { class: 'tiny faint center', style: 'margin-top:4px' }, 'Total weight moved per week — the simplest measure of whether you are doing more over time.')));

  /* ---- muscle split, last 30 days ---- */
  const since = now - 30 * 864e5;
  const byMuscle = {};
  for (const w of state.workouts.filter(w => w.start > since)) {
    for (const e of w.entries) {
      const ex = exercise(e.exerciseId); if (!ex) continue;
      const sets = e.sets.filter(isWorking).length;
      for (const m of (ex.prim.length ? ex.prim : [ex.cat])) byMuscle[m] = (byMuscle[m] || 0) + sets;
    }
  }
  const ms = Object.entries(byMuscle).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (ms.length) {
    const max = ms[0][1];
    v.append(el('div', { class: 'card' },
      el('div', { class: 'pill-h', style: 'margin-bottom:10px' }, 'Sets per muscle · last 30 days'),
      ...ms.map(([m, n]) => el('div', { style: 'margin-bottom:9px' },
        el('div', { class: 'row tiny', style: 'margin-bottom:3px' },
          el('div', { style: 'flex:1' }, m),
          el('div', { class: 'faint mono' }, n)),
        el('div', { style: 'height:6px;border-radius:3px;background:var(--bg-elev2);overflow:hidden' },
          el('div', { style: `height:100%;width:${n / max * 100}%;background:var(--accent);border-radius:3px` }))))));
  }

  /* ---- bodyweight ---- */
  v.append(bodyweightCard(ctx));

  /* ---- per-exercise strength ---- */
  const trained = allExercises()
    .map(ex => ({ ex, h: historyFor(ex.id) }))
    .filter(x => x.h.length)
    .sort((a, b) => b.h[b.h.length - 1].t - a.h[a.h.length - 1].t);

  v.append(el('div', {},
    el('div', { class: 'pill-h', style: 'margin:6px 2px 8px' }, 'Strength by exercise'),
    ...trained.map(({ ex, h }) => {
      const last = h[h.length - 1];
      const first = h[0];
      const delta = last.e1rm - first.e1rm;
      const pct = first.e1rm ? delta / first.e1rm * 100 : 0;
      return el('button', { class: 'lrow', onclick: () => exerciseProgress(ex.id) },
        el('div', { style: 'flex:1;min-width:0' },
          el('div', { class: 't' }, ex.name),
          el('div', { class: 's' }, `${nf(cv(last.topWeight), 1)} ${U()} × ${last.topReps} · ${h.length} session${h.length > 1 ? 's' : ''} · ${fmtDate(last.t)}`)),
        h.length > 1 ? el('div', { class: 'tiny mono ' + (delta > .5 ? 'up' : delta < -.5 ? 'down' : 'faint'), style: 'text-align:right' },
          (delta > 0 ? '+' : '') + nf(pct, 0) + '%',
          el('div', { class: 'faint', style: 'font-size:10px' }, 'est 1RM')) : el('span', { class: 'badge' }, 'new'),
        icon('chev', 'chev'));
    })));

  main.append(v);
}

/* ---------------- bodyweight ---------------- */
function bodyweightCard(ctx) {
  const bw = [...state.bodyweight].sort((a, b) => a.t - b.t);
  const latest = bw[bw.length - 1];
  const card = el('div', { class: 'card' },
    el('div', { class: 'row', style: 'margin-bottom:6px' },
      el('div', { class: 'pill-h' }, 'Bodyweight'),
      el('div', { class: 'spacer' }),
      el('button', {
        class: 'btn sm', onclick: async () => {
          const val = await promptSheet('Log bodyweight', { label: `Weight in ${U()}`, type: 'number', value: latest ? nf(cv(latest.kg), 1) : '', ok: 'Save' });
          if (!val) return;
          state.bodyweight.push({ t: Date.now(), kg: toKg(Number(val), U()) });
          commit(); ctx.refresh(); toast('Logged');
        }
      }, '+ Log')));

  if (!bw.length) {
    card.append(el('div', { class: 'muted small' }, 'Track your bodyweight to see it alongside your lifts.'));
    return card;
  }
  const first = bw[0], change = latest.kg - first.kg;
  card.append(el('div', { class: 'row', style: 'margin-bottom:8px' },
    el('div', { class: 'clock small mono' }, nf(cv(latest.kg), 1) + ' ' + U()),
    el('div', { class: 'spacer' }),
    bw.length > 1 ? el('div', { class: 'small mono ' + (change > 0 ? 'up' : change < 0 ? 'down' : 'faint') },
      (change > 0 ? '+' : '') + nf(cv(change), 1) + ' ' + U() + ' since ' + fmtDate(first.t)) : null));
  if (bw.length > 1) card.append(lineChart(bw.map(b => ({ x: b.t, y: cv(b.kg) })), { h: 120 }));
  card.append(el('button', {
    class: 'btn sm ghost', style: 'margin-top:8px',
    onclick: async () => {
      if (await confirmSheet('Remove last entry?', `${nf(cv(latest.kg), 1)} ${U()} from ${fmtDate(latest.t)}`, 'Remove')) {
        state.bodyweight = state.bodyweight.filter(b => b !== latest); commit(); ctx.refresh();
      }
    }
  }, 'Remove last entry'));
  return card;
}

/* ---------------- per-exercise deep dive ---------------- */
const METRICS = [
  ['top', 'Top set', h => cv(h.topWeight)],
  ['e1rm', 'Est. 1RM', h => cv(h.e1rm)],
  ['vol', 'Volume', h => cv(h.volume)],
  ['reps', 'Reps', h => h.totalReps]
];

export function exerciseProgress(id) {
  const ex = exercise(id);
  let metric = 'top', range = 0; // 0 = all

  openSheet(ex.name + ' · progress', close => {
    const wrap = el('div', { class: 'stack' });
    const chartBox = el('div', { class: 'card' });
    const seg = el('div', { class: 'seg' });
    const rangeRow = el('div', { class: 'chips' });

    const drawSeg = () => {
      seg.innerHTML = '';
      METRICS.forEach(([k, label]) => seg.append(el('button', {
        class: metric === k ? 'on' : '', onclick: () => { metric = k; drawSeg(); drawChart(); }
      }, label)));
    };
    const drawRange = () => {
      rangeRow.innerHTML = '';
      [[0, 'All time'], [90, '3 months'], [30, '30 days']].forEach(([d, label]) => rangeRow.append(el('button', {
        class: 'chip' + (range === d ? ' on' : ''), onclick: () => { range = d; drawRange(); drawChart(); }
      }, label)));
    };

    function drawChart() {
      const all = historyFor(id);
      const h = range ? all.filter(x => x.t > Date.now() - range * 864e5) : all;
      chartBox.innerHTML = '';
      if (h.length < 2) {
        chartBox.append(el('div', { class: 'muted small center', style: 'padding:26px 0' },
          h.length ? 'One session logged in this range — train it again to see a trend.' : 'No sessions in this range.'));
        return;
      }
      const fn = METRICS.find(m => m[0] === metric)[2];
      const pts = h.map(x => ({ x: x.t, y: fn(x) }));
      const first = pts[0].y, last = pts[pts.length - 1].y;
      const d = last - first, pct = first ? d / first * 100 : 0;
      chartBox.append(
        el('div', { class: 'row', style: 'margin-bottom:8px' },
          el('div', {},
            el('div', { class: 'clock small mono' }, nf(last, 1) + (metric === 'reps' ? '' : ' ' + U())),
            el('div', { class: 'tiny faint' }, 'latest')),
          el('div', { class: 'spacer' }),
          el('div', { class: 'small mono ' + (d > 0 ? 'up' : d < 0 ? 'down' : 'faint'), style: 'text-align:right' },
            (d > 0 ? '+' : '') + nf(d, 1) + (metric === 'reps' ? '' : ' ' + U()),
            el('div', { class: 'tiny faint' }, (d > 0 ? '+' : '') + nf(pct, 0) + '% over ' + h.length + ' sessions'))),
        lineChart(pts, { h: 190 }));
    }

    drawSeg(); drawRange(); drawChart();

    const pb = personalBests(id);
    wrap.append(seg, rangeRow, chartBox);

    if (pb) {
      wrap.append(el('div', { class: 'card' },
        el('div', { class: 'pill-h', style: 'margin-bottom:10px' }, 'Personal records'),
        ...[
          ['Heaviest set', `${nf(cv(pb.heaviest.topWeight), 1)} ${U()} × ${pb.heaviest.topReps}`, fmtDate(pb.heaviest.t)],
          ['Best est. 1RM', `${nf(cv(pb.best1rm.e1rm), 1)} ${U()}`, fmtDate(pb.best1rm.t)],
          ['Most reps in a set', `${pb.bestReps.reps} @ ${nf(cv(pb.bestReps.w), 1)} ${U()}`, fmtDate(pb.bestReps.t)],
          ['Best session volume', `${bigN(cv(pb.bestVol.volume))} ${U()}`, fmtDate(pb.bestVol.t)]
        ].map(([k, val, when]) => el('div', { class: 'srow' },
          el('label', {}, k),
          el('div', { style: 'text-align:right' },
            el('div', { class: 'mono', style: 'font-weight:650' }, val),
            el('div', { class: 'tiny faint' }, when))))));
    }

    /* goal */
    const goal = state.goals[id];
    wrap.append(el('div', { class: 'card' },
      el('div', { class: 'row' },
        el('div', { style: 'flex:1' },
          el('div', { class: 'pill-h' }, 'Goal'),
          el('div', { class: 'small muted', style: 'margin-top:4px' },
            goal ? `${nf(cv(goal), 1)} ${U()} — ${pb ? nf(Math.min(100, pb.heaviest.topWeight / goal * 100), 0) : 0}% there` : 'Set a target weight to work toward.')),
        el('button', {
          class: 'btn sm', onclick: async () => {
            const val = await promptSheet('Target top-set weight', { label: U(), type: 'number', value: goal ? nf(cv(goal), 1) : '' });
            if (val === null) return;
            if (!val) delete state.goals[id]; else state.goals[id] = toKg(Number(val), U());
            commit(); close(); setTimeout(() => exerciseProgress(id), 270);
          }
        }, goal ? 'Change' : 'Set goal')),
      goal && pb ? el('div', { style: 'height:8px;border-radius:4px;background:var(--bg-elev2);margin-top:10px;overflow:hidden' },
        el('div', { style: `height:100%;width:${Math.min(100, pb.heaviest.topWeight / goal * 100)}%;background:var(--accent)` })) : null));

    wrap.append(el('button', { class: 'btn wide ghost', onclick: () => { close(); setTimeout(() => import('./exercise.js').then(m => m.showExercise(id)), 270); } },
      icon('info'), 'How to do this exercise'));
    return wrap;
  });
}
