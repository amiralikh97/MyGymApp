import { el, fmtDate, fmtTime, dur, nf, fromKg, bigN, isWorking, setVolume } from '../util.js';
import { icon, openSheet, confirmSheet, toast, barChart } from '../ui.js';
import { state, sortedWorkouts, exercise, deleteWorkout, workoutVolume, saveRoutine, startWorkout, stats } from '../store.js';
import { showExercise } from './exercise.js';

const U = () => state.settings.unit;

export function render(main, ctx) {
  main.innerHTML = '';
  const v = el('div', { class: 'view' });
  const ws = sortedWorkouts();

  if (!ws.length) {
    v.append(el('div', { class: 'empty' },
      el('div', { class: 'big' }, '📓'),
      el('div', {}, 'No workouts yet.'),
      el('div', { class: 'small', style: 'margin-top:4px' }, 'Finished workouts show up here.')));
    main.append(v); return;
  }

  // last 12 weeks of activity
  const now = Date.now(), week = 7 * 864e5;
  const bars = [];
  for (let i = 11; i >= 0; i--) {
    const from = now - (i + 1) * week, to = now - i * week;
    bars.push({ label: i % 3 === 0 ? (i === 0 ? 'now' : `-${i}w`) : '', value: ws.filter(w => w.start > from && w.start <= to).length });
  }
  v.append(el('div', { class: 'card' },
    el('div', { class: 'pill-h', style: 'margin-bottom:4px' }, 'Workouts per week'),
    barChart(bars, { h: 110 })));

  const s = stats();
  v.append(el('div', { class: 'stat-grid', style: 'margin-top:12px' },
    el('div', { class: 'stat' }, el('div', { class: 'v mono' }, s.workouts), el('div', { class: 'k' }, 'Workouts')),
    el('div', { class: 'stat' }, el('div', { class: 'v mono' }, dur(s.time)), el('div', { class: 'k' }, 'Time trained')),
    el('div', { class: 'stat' }, el('div', { class: 'v mono' }, bigN(fromKg(s.totalVol, U()))), el('div', { class: 'k' }, 'Volume ' + U())),
    el('div', { class: 'stat' }, el('div', { class: 'v mono' }, s.totalSets), el('div', { class: 'k' }, 'Sets logged'))));

  let lastMonth = '';
  const list = el('div', { style: 'margin-top:16px' });
  for (const w of ws) {
    const m = new Date(w.start).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    if (m !== lastMonth) { list.append(el('div', { class: 'pill-h', style: 'margin:16px 2px 8px' }, m)); lastMonth = m; }
    const sets = w.entries.reduce((a, e) => a + e.sets.filter(isWorking).length, 0);
    list.append(el('button', { class: 'lrow', onclick: () => detail(w, ctx) },
      el('div', { style: 'flex:1;min-width:0' },
        el('div', { class: 't' }, w.name),
        el('div', { class: 's' }, `${fmtDate(w.start)} · ${dur(w.duration || 0)} · ${w.entries.length} exercises · ${sets} sets`)),
      icon('chev', 'chev')));
  }
  v.append(list);
  main.append(v);
}

function detail(w, ctx) {
  openSheet(w.name, close => {
    const body = el('div', { class: 'stack' });
    body.append(el('div', { class: 'muted small' }, `${fmtDate(w.start)} at ${fmtTime(w.start)} · ${dur(w.duration || 0)} · ${bigN(fromKg(workoutVolume(w), U()))} ${U()} volume`));
    if (w.notes) body.append(el('div', { class: 'note' }, w.notes));

    for (const e of w.entries) {
      const ex = exercise(e.exerciseId);
      body.append(el('div', { class: 'card' },
        el('button', { class: 'row', style: 'width:100%;background:none;text-align:left', onclick: () => showExercise(e.exerciseId) },
          el('div', { style: 'flex:1;min-width:0;font-weight:650' }, ex?.name || 'Unknown'),
          icon('chev', 'chev')),
        e.notes ? el('div', { class: 'tiny faint', style: 'margin:4px 0' }, e.notes) : null,
        el('div', { style: 'margin-top:8px' }, ...e.sets.map((s, i) => el('div', { class: 'row small', style: 'padding:3px 0' },
          el('div', { class: 'set-no', style: 'width:26px' }, s.type === 'warmup' ? 'W' : String(i + 1)),
          el('div', { class: 'mono', style: 'flex:1' },
            (s.wl != null || s.wr != null
              ? `${nf(fromKg(+s.wl || 0, U()), 1)} / ${nf(fromKg(+s.wr || 0, U()), 1)} ${U()}`
              : `${nf(fromKg(+s.w || 0, U()), 1)} ${U()}`) + `  ×  ${s.reps}`),
          el('div', { class: 'tiny faint mono' }, nf(fromKg(setVolume(s, ex), U()), 0)))))));
    }

    body.append(el('button', {
      class: 'btn wide', onclick: () => {
        if (state.active) return toast('Finish your current workout first');
        startWorkout(w.name, w.entries.map(e => ({
          id: Math.random().toString(36).slice(2), exerciseId: e.exerciseId, notes: '',
          sets: e.sets.map(s => ({ id: Math.random().toString(36).slice(2), w: s.w, wl: s.wl, wr: s.wr, reps: s.reps, type: s.type, done: false, t: null }))
        })));
        close(); ctx.go('train');
      }
    }, 'Repeat this workout'));
    body.append(el('button', {
      class: 'btn wide ghost', onclick: () => { saveRoutine(w.name, w.entries.map(e => e.exerciseId)); toast('Routine saved'); }
    }, 'Save as routine'));
    body.append(el('button', {
      class: 'btn wide danger', onclick: async () => {
        if (await confirmSheet('Delete workout?', 'This cannot be undone.', 'Delete')) { deleteWorkout(w.id); close(); ctx.refresh(); toast('Deleted'); }
      }
    }, 'Delete workout'));
    return body;
  });
}
