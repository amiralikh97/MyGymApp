import { el, hms, nf, fromKg, toKg, fmtDate, dur, bigN, isWorking } from '../util.js';
import { icon, toast, openSheet, confirmSheet, promptSheet } from '../ui.js';
import {
  state, commit, save, exercise, startWorkout, addEntry, removeEntry, moveEntry,
  finishWorkout, discardWorkout, elapsed, newSet, lastPerformance, prCheck,
  workoutVolume, stats, saveRoutine, deleteRoutine, sortedWorkouts
} from '../store.js';
import { startRest, stopRest, primeAudio, keepAwake } from '../timer.js';
import { openPicker } from './picker.js';
import { showExercise } from './exercise.js';

const U = () => state.settings.unit;
const disp = kg => kg === '' || kg == null ? '' : nf(fromKg(Number(kg), U()), 2);

let sessionTick = null;
let updateBar = () => {};   // set by activeView so set logging can refresh totals at once

export function render(main, ctx) {
  clearInterval(sessionTick); sessionTick = null;
  main.innerHTML = '';
  main.append(state.active ? activeView(ctx) : startView(ctx));
}
export function cleanup() { clearInterval(sessionTick); sessionTick = null; updateBar = () => {}; }

/* ============================ idle screen ============================ */
function startView(ctx) {
  const v = el('div', { class: 'view stack' });
  const s = stats();
  const last = sortedWorkouts()[0];

  v.append(el('div', { class: 'card', style: 'text-align:center;padding:22px 16px' },
    el('div', { style: 'font-size:15px;font-weight:650' }, 'Ready to train?'),
    el('div', { class: 'muted small', style: 'margin:6px 0 16px' },
      s.workouts ? `${s.thisWeek} workout${s.thisWeek === 1 ? '' : 's'} this week · ${s.workouts} total` : 'Start your first workout and it will be saved on this device.'),
    el('button', {
      class: 'btn primary wide', onclick: () => { primeAudio(); startWorkout(); keepAwake(true); ctx.refresh(); }
    }, icon('play'), 'Start empty workout')));

  /* routines */
  v.append(el('div', {},
    el('div', { class: 'row', style: 'margin:6px 2px 8px' },
      el('div', { class: 'pill-h' }, 'Routines'),
      el('div', { class: 'spacer' }),
      el('button', { class: 'btn sm ghost', onclick: () => newRoutine(ctx) }, '+ New')),
    state.routines.length
      ? el('div', {}, ...state.routines.map(r => el('div', { class: 'lrow' },
        el('button', {
          style: 'flex:1;min-width:0;text-align:left;background:none',
          onclick: () => {
            primeAudio();
            startWorkout(r.name, r.exerciseIds.map(id => {
              const prev = lastPerformance(id);
              const seed = prev?.sets?.filter(isWorking)[0];
              return { id: Math.random().toString(36).slice(2), exerciseId: id, notes: '', sets: [newSet(seed ? { w: seed.w, wl: seed.wl, wr: seed.wr, reps: seed.reps } : {})] };
            }));
            keepAwake(true); ctx.refresh();
          }
        },
          el('div', { class: 't' }, r.name),
          el('div', { class: 's' }, r.exerciseIds.map(id => exercise(id)?.name).filter(Boolean).slice(0, 3).join(' · ') + (r.exerciseIds.length > 3 ? ` +${r.exerciseIds.length - 3}` : ''))),
        el('button', {
          class: 'icon-btn plain', onclick: async () => {
            if (await confirmSheet('Delete routine?', `"${r.name}" will be removed. Your logged workouts are not affected.`, 'Delete')) { deleteRoutine(r.id); ctx.refresh(); }
          }
        }, icon('trash')))))
      : el('div', { class: 'card muted small center' }, 'Save a set of exercises as a routine to start it in one tap.')));

  if (last) {
    v.append(el('div', {},
      el('div', { class: 'pill-h', style: 'margin:6px 2px 8px' }, 'Last workout'),
      el('button', {
        class: 'lrow', onclick: () => {
          primeAudio();
          startWorkout(last.name, last.entries.map(e => ({
            id: Math.random().toString(36).slice(2), exerciseId: e.exerciseId, notes: '',
            sets: e.sets.map(s => newSet({ w: s.w, wl: s.wl, wr: s.wr, reps: s.reps, type: s.type }))
          })));
          keepAwake(true); ctx.refresh();
        }
      },
        el('div', { style: 'flex:1;min-width:0' },
          el('div', { class: 't' }, last.name),
          el('div', { class: 's' }, `${fmtDate(last.start)} · ${last.entries.length} exercises · ${dur(last.duration || 0)}`)),
        el('span', { class: 'badge' }, 'Repeat'))));
  }
  return v;
}

function newRoutine(ctx) {
  openPicker(async ids => {
    const name = await promptSheet('Name this routine', { placeholder: 'e.g. Push Day A', ok: 'Save routine' });
    if (name === null) return;
    saveRoutine(name || 'My routine', ids);
    toast('Routine saved');
    ctx.refresh();
  }, { title: 'Pick exercises for the routine' });
}

/* ============================ active session ============================ */
function activeView(ctx) {
  const w = state.active;
  const v = el('div', { class: 'view stack' });

  /* --- session bar --- */
  const clock = el('div', { class: 'clock mono' }, hms(elapsed()));
  const volEl = el('div', { class: 'tiny faint mono' }, '');
  updateBar = () => {
    if (!state.active) return;
    clock.textContent = hms(elapsed());
    const sets = w.entries.reduce((a, e) => a + e.sets.filter(isWorking).length, 0);
    volEl.textContent = `${sets} set${sets === 1 ? '' : 's'} · ${bigN(fromKg(workoutVolume(w), U()))} ${U()} volume`;
  };
  updateBar();
  clearInterval(sessionTick);
  sessionTick = setInterval(updateBar, 1000);

  v.append(el('div', { class: 'session-bar' },
    el('div', { style: 'flex:1;min-width:0' },
      el('div', { class: 'pill-h' }, w.name),
      clock, volEl),
    el('button', { class: 'icon-btn', title: 'Rename', onclick: async () => {
      const n = await promptSheet('Workout name', { value: w.name });
      if (n) { w.name = n; commit(); ctx.refresh(); }
    } }, icon('note')),
    el('button', { class: 'btn primary', onclick: () => finish(ctx) }, 'Finish')));

  /* --- exercises --- */
  const listWrap = el('div', { class: 'stack' });
  v.append(listWrap);

  const redraw = () => {
    listWrap.innerHTML = '';
    if (!w.entries.length) {
      listWrap.append(el('div', { class: 'empty' },
        el('div', { class: 'big' }, '🏋️'),
        el('div', {}, 'No exercises yet.'),
        el('div', { class: 'small', style: 'margin-top:4px' }, 'Add your first one below.')));
    }
    w.entries.forEach((entry, i) => listWrap.append(entryBlock(entry, i, redraw, ctx)));
  };
  redraw();

  v.append(el('button', {
    class: 'btn wide', style: 'margin-top:4px',
    onclick: () => openPicker(ids => { ids.forEach(addEntry); redraw(); updateBar(); })
  }, icon('plus'), 'Add exercise'));

  const notes = el('textarea', { rows: 2, placeholder: 'Workout notes (how you felt, gym, bodyweight…)' });
  notes.value = w.notes || '';
  notes.addEventListener('input', () => { w.notes = notes.value; save(); });
  v.append(el('div', { class: 'card' }, el('div', { class: 'pill-h', style: 'margin-bottom:6px' }, 'Notes'), notes));

  v.append(el('button', {
    class: 'btn wide ghost danger', onclick: async () => {
      if (await confirmSheet('Discard workout?', 'Everything logged in this session will be deleted.', 'Discard')) {
        discardWorkout(); stopRest(); keepAwake(false); ctx.refresh(); toast('Workout discarded');
      }
    }
  }, 'Discard workout'));

  return v;
}

/* ============================ one exercise block ============================ */
function entryBlock(entry, index, redrawAll, ctx) {
  const ex = exercise(entry.exerciseId) || { name: 'Unknown exercise', prim: [], eq: '', sec: [] };
  const block = el('div', { class: 'ex-block' });
  const canSplit = !!ex.paired;
  const prev = lastPerformance(entry.exerciseId);

  const head = el('div', { class: 'ex-head' },
    el('button', {
      style: 'flex:1;min-width:0;text-align:left;background:none',
      onclick: () => showExercise(entry.exerciseId)
    },
      el('div', { class: 'name' }, ex.name),
      el('div', { class: 'meta' }, [ex.eq, ex.prim.join(', ')].filter(Boolean).join(' · ')
        + (prev ? ` · last ${fmtDate(prev.t)}` : ' · first time'))),
    el('button', { class: 'icon-btn', title: 'Options', onclick: () => entryMenu(entry, index, redrawAll, ctx) }, icon('cog')));
  block.append(head);

  const sets = el('div', { class: 'sets' });
  block.append(sets);

  const drawSets = () => {
    sets.innerHTML = '';
    const split = entry.sets.some(s => s.wl != null || s.wr != null);
    const wLabel = ex.bw ? `+${U()}` : U();
    sets.append(el('div', { class: 'set-hd' + (split ? ' split' : '') },
      el('div', {}, 'Set'),
      ...(split ? [el('div', { class: 'center' }, 'Left'), el('div', { class: 'center' }, 'Right')] : [el('div', { class: 'center' }, wLabel)]),
      el('div', { class: 'center' }, 'Reps'),
      el('div', { class: 'center' }, 'Prev'),
      el('div', {})));

    entry.sets.forEach((s, i) => sets.append(setRow(entry, s, i, split, ex, prev, drawSets, ctx)));

    sets.append(el('div', { class: 'row', style: 'gap:8px;padding:8px 6px 4px' },
      el('button', {
        class: 'btn sm', style: 'flex:1',
        onclick: () => {
          const lastSet = entry.sets[entry.sets.length - 1];
          entry.sets.push(newSet(lastSet ? { w: lastSet.w, wl: lastSet.wl, wr: lastSet.wr, reps: lastSet.reps } : {}));
          commit(); drawSets();
        }
      }, icon('plus'), 'Add set'),
      canSplit && el('button', {
        class: 'btn sm', title: 'Different weight in each hand',
        onclick: () => {
          const isSplit = entry.sets.some(s => s.wl != null);
          entry.sets.forEach(s => {
            if (isSplit) { s.w = s.wl != null ? String(Math.max(Number(s.wl) || 0, Number(s.wr) || 0)) : s.w; s.wl = s.wr = null; }
            else { s.wl = s.w === '' ? '' : s.w; s.wr = s.w === '' ? '' : s.w; }
          });
          commit(); drawSets();
        }
      }, entry.sets.some(s => s.wl != null) ? 'Single weight' : 'L / R weights')));
  };
  drawSets();
  return block;
}

function setRow(entry, s, i, split, ex, prev, drawSets, ctx) {
  const row = el('div', { class: 'set-row' + (split ? ' split' : '') + (s.done ? ' done' : '') });
  const typeLabel = { normal: String(i + 1), warmup: 'W', drop: 'D', failure: 'F' }[s.type] || String(i + 1);

  row.append(el('button', {
    class: 'set-no' + (s.type !== 'normal' ? ' warm' : ''),
    title: 'Set type',
    onclick: () => setMenu(entry, s, i, drawSets)
  }, typeLabel));

  const mkInput = (key, ph) => {
    const inp = el('input', { type: 'number', inputmode: 'decimal', step: 'any', placeholder: ph, enterkeyhint: 'next' });
    inp.value = key === 'reps' ? (s.reps ?? '') : disp(s[key]);
    inp.addEventListener('input', () => {
      if (key === 'reps') s.reps = inp.value === '' ? '' : Number(inp.value);
      else s[key] = inp.value === '' ? '' : toKg(Number(inp.value), U());
      save();
    });
    inp.addEventListener('focus', () => inp.select());
    return inp;
  };

  if (split) { row.append(mkInput('wl', '0'), mkInput('wr', '0')); }
  else row.append(mkInput('w', ex.bw ? '0' : '—'));
  row.append(mkInput('reps', '0'));

  const p = prev?.sets?.[i];
  row.append(el('div', { class: 'prev mono' }, p
    ? (p.wl != null || p.wr != null
      ? `${nf(fromKg(+p.wl || 0, U()), 1)}/${nf(fromKg(+p.wr || 0, U()), 1)}×${p.reps}`
      : `${nf(fromKg(+p.w || 0, U()), 1)}×${p.reps}`)
    : '—'));

  const tick = el('button', { class: 'tick' + (s.done ? ' on' : ''), title: 'Mark set complete' }, icon('check'));
  tick.addEventListener('click', () => {
    primeAudio();
    s.done = !s.done;
    if (s.done) {
      s.t = Date.now();
      // Blank weight is legitimate for bodyweight work; blank reps is not.
      if (s.reps === '' || s.reps == null) { s.reps = 0; drawSets(); }
      const pr = s.type === 'warmup' ? null : prCheck(entry.exerciseId, s);
      commit();
      if (state.settings.autoRest) {
        const secs = entry.rest ?? (s.type === 'warmup' ? state.settings.restWarmup : state.settings.restDefault);
        if (secs > 0) startRest(secs, exercise(entry.exerciseId)?.name || '');
      }
      updateBar();
      if (pr === 'weight') toast('🏆 New heaviest set!');
      else if (pr === 'e1rm') toast('🔥 Strength record!');
      else if (pr === 'first') toast('First time logged — baseline set');
    } else { s.t = null; commit(); updateBar(); }
    drawSets();
  });
  row.append(tick);
  return row;
}

function setMenu(entry, s, i, drawSets) {
  openSheet('Set ' + (i + 1), close => el('div', { class: 'stack' },
    ...[['normal', 'Normal set'], ['warmup', 'Warm-up set (not counted in records)'], ['drop', 'Drop set'], ['failure', 'Taken to failure']]
      .map(([k, label]) => el('button', {
        class: 'btn wide' + (s.type === k ? ' primary' : ''),
        onclick: () => { s.type = k; commit(); drawSets(); close(); }
      }, label)),
    el('div', { class: 'divider' }),
    el('button', {
      class: 'btn wide danger',
      onclick: () => {
        entry.sets.splice(i, 1);
        if (!entry.sets.length) entry.sets.push(newSet());
        commit(); drawSets(); close();
      }
    }, 'Delete this set')));
}

function entryMenu(entry, index, redrawAll, ctx) {
  const ex = exercise(entry.exerciseId);
  openSheet(ex?.name || 'Exercise', close => {
    const noteBox = el('textarea', { rows: 2, placeholder: 'Notes for this exercise (seat height, grip…)' });
    noteBox.value = entry.notes || '';
    noteBox.addEventListener('input', () => { entry.notes = noteBox.value; save(); });

    const restIn = el('input', { type: 'number', inputmode: 'numeric', placeholder: state.settings.restDefault });
    if (entry.rest != null) restIn.value = entry.rest;
    restIn.addEventListener('input', () => { entry.rest = restIn.value === '' ? null : Number(restIn.value); save(); });

    return el('div', { class: 'stack' },
      el('button', { class: 'btn wide', onclick: () => { close(); setTimeout(() => showExercise(entry.exerciseId), 270); } }, icon('info'), 'How to do this exercise'),
      el('div', { class: 'srow' }, el('label', {}, 'Rest timer for this exercise'), restIn, el('span', { class: 'faint small' }, 'sec')),
      el('div', {}, el('div', { class: 'pill-h', style: 'margin-bottom:6px' }, 'Exercise notes'), noteBox),
      el('div', { class: 'row', style: 'gap:8px' },
        el('button', { class: 'btn', style: 'flex:1', onclick: () => { moveEntry(entry.id, -1); redrawAll(); close(); } }, icon('up'), 'Up'),
        el('button', { class: 'btn', style: 'flex:1', onclick: () => { moveEntry(entry.id, 1); redrawAll(); close(); } }, icon('down'), 'Down')),
      el('button', {
        class: 'btn wide danger',
        onclick: async () => {
          close();
          if (await confirmSheet('Remove exercise?', `"${ex?.name}" and its sets will be removed from this workout.`, 'Remove')) {
            removeEntry(entry.id); redrawAll();
          }
        }
      }, icon('trash'), 'Remove from workout'));
  });
}

/* ============================ finish ============================ */
async function finish(ctx) {
  const w = state.active;
  const done = w.entries.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
  if (!done) {
    if (await confirmSheet('Nothing logged', 'No sets are marked complete. Discard this workout?', 'Discard')) {
      discardWorkout(); stopRest(); keepAwake(false); ctx.refresh();
    }
    return;
  }
  const mins = Math.round(elapsed() / 60);
  if (!await confirmSheet('Finish workout?', `${done} sets logged over ${mins} minute${mins === 1 ? '' : 's'}. Save it to your history?`, 'Finish & save', false)) return;

  const saved = finishWorkout();
  stopRest(); keepAwake(false);
  ctx.refresh();
  if (saved) summary(saved, ctx);
}

function summary(w, ctx) {
  openSheet('Workout complete 💪', close => {
    const sets = w.entries.reduce((a, e) => a + e.sets.filter(isWorking).length, 0);
    return el('div', { class: 'stack' },
      el('div', { class: 'stat-grid' },
        el('div', { class: 'stat' }, el('div', { class: 'v mono' }, dur(w.duration || 0)), el('div', { class: 'k' }, 'Duration')),
        el('div', { class: 'stat' }, el('div', { class: 'v mono' }, sets), el('div', { class: 'k' }, 'Sets')),
        el('div', { class: 'stat' }, el('div', { class: 'v mono' }, bigN(fromKg(workoutVolume(w), U()))), el('div', { class: 'k' }, 'Volume ' + U())),
        el('div', { class: 'stat' }, el('div', { class: 'v mono' }, w.entries.length), el('div', { class: 'k' }, 'Exercises'))),
      el('div', { class: 'card' }, ...w.entries.map(e => el('div', { class: 'row', style: 'padding:5px 0' },
        el('div', { style: 'flex:1;min-width:0' }, exercise(e.exerciseId)?.name || '—'),
        el('div', { class: 'tiny faint mono' }, e.sets.filter(isWorking).length + ' sets')))),
      el('button', {
        class: 'btn wide', onclick: async () => {
          const name = await promptSheet('Save as routine', { value: w.name, ok: 'Save routine' });
          if (name !== null) { saveRoutine(name || w.name, w.entries.map(e => e.exerciseId)); toast('Routine saved'); }
        }
      }, 'Save as routine'),
      el('button', { class: 'btn wide primary', onclick: close }, 'Done'));
  });
}
