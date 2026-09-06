import { EXERCISES } from './data/exercises.js';
import { uid, dayKey, setWeight, e1rm, setVolume, isWorking } from './util.js';

const KEY = 'ironlog.v1';

const DEFAULTS = {
  version: 1,
  settings: {
    unit: 'kg',
    restDefault: 90,
    restWarmup: 45,
    autoRest: true,
    sound: true,
    vibrate: true,
    keepAwake: true,
    theme: 'auto',
    plateIncrement: 2.5,
    ai: { url: '', key: '', model: 'deepseek-ai/deepseek-v4-pro-0813' }
  },
  custom: [],          // user-created exercises
  workouts: [],        // finished workouts (newest last)
  active: null,        // in-progress workout
  routines: [],        // saved templates
  bodyweight: [],      // {t, kg}
  goals: {},           // exerciseId -> target weight (kg)
  chat: []             // AI coach conversation
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const d = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULTS), ...d,
      settings: {
        ...DEFAULTS.settings, ...(d.settings || {}),
        ai: { ...DEFAULTS.settings.ai, ...((d.settings || {}).ai || {}) }
      }
    };
  } catch (e) {
    console.error('load failed', e);
    return structuredClone(DEFAULTS);
  }
}

export const state = load();

let saveTimer = null;
const subs = new Set();

export function save(immediate = false) {
  clearTimeout(saveTimer);
  const write = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.error('save failed', e); }
  };
  immediate ? write() : (saveTimer = setTimeout(write, 300));
}
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
export function emit() { subs.forEach(f => f()); }
export function commit(immediate = false) { save(immediate); emit(); }

/* ---------------- exercise catalogue ---------------- */
export function allExercises() { return [...EXERCISES, ...state.custom]; }
const byId = () => Object.fromEntries(allExercises().map(e => [e.id, e]));
let _map = null;
export function exercise(id) {
  if (!_map || !_map[id]) _map = byId();
  return _map[id];
}
export function invalidateExercises() { _map = null; }

export function addCustomExercise(data) {
  const ex = {
    id: 'custom-' + uid(), custom: true, cat: 'Other', eq: 'Other',
    prim: [], sec: [], mech: 'Compound', force: 'Push', level: 'Beginner',
    desc: '', setup: [], steps: [], tips: [], safety: [], mistakes: [], ...data
  };
  state.custom.push(ex);
  invalidateExercises();
  commit(true);
  return ex;
}
export function deleteCustomExercise(id) {
  state.custom = state.custom.filter(e => e.id !== id);
  invalidateExercises();
  commit(true);
}

/* ---------------- workout session ---------------- */
export function startWorkout(name, entries = []) {
  state.active = {
    id: uid(), start: Date.now(), end: null, name: name || defaultName(),
    notes: '', entries, paused: 0, pausedAt: null
  };
  commit(true);
  return state.active;
}
function defaultName() {
  const h = new Date().getHours();
  return h < 11 ? 'Morning Workout' : h < 16 ? 'Afternoon Workout' : h < 21 ? 'Evening Workout' : 'Late Workout';
}
export function elapsed(w = state.active) {
  if (!w) return 0;
  const end = w.end || (w.pausedAt || Date.now());
  return Math.max(0, (end - w.start - (w.paused || 0)) / 1000);
}
export function addEntry(exerciseId) {
  const ex = exercise(exerciseId);
  const prev = lastPerformance(exerciseId);
  const seed = prev?.sets?.filter(isWorking).slice(0, 1) || [];
  const s = seed[0];
  const entry = {
    id: uid(), exerciseId, notes: '',
    sets: [newSet(s ? { w: s.w, wl: s.wl, wr: s.wr, reps: s.reps } : {}, ex)]
  };
  state.active.entries.push(entry);
  commit(true);
  return entry;
}
export function newSet(from = {}, ex) {
  return { id: uid(), w: from.w ?? '', wl: from.wl ?? null, wr: from.wr ?? null, reps: from.reps ?? '', type: from.type || 'normal', done: false, t: null };
}
export function removeEntry(entryId) {
  state.active.entries = state.active.entries.filter(e => e.id !== entryId);
  commit(true);
}
export function moveEntry(entryId, dir) {
  const a = state.active.entries, i = a.findIndex(e => e.id === entryId), j = i + dir;
  if (i < 0 || j < 0 || j >= a.length) return;
  [a[i], a[j]] = [a[j], a[i]];
  commit(true);
}
export function finishWorkout() {
  const w = state.active;
  if (!w) return null;
  w.end = Date.now();
  w.duration = elapsed(w);
  w.entries = w.entries
    .map(e => ({ ...e, sets: e.sets.filter(s => s.done) }))
    .filter(e => e.sets.length);
  state.active = null;
  if (w.entries.length) { state.workouts.push(w); commit(true); return w; }
  commit(true);
  return null;
}
export function discardWorkout() { state.active = null; commit(true); }

export function deleteWorkout(id) {
  state.workouts = state.workouts.filter(w => w.id !== id);
  commit(true);
}

/* ---------------- history / analytics ---------------- */
export function sortedWorkouts() { return [...state.workouts].sort((a, b) => b.start - a.start); }

export function historyFor(exerciseId) {
  const out = [];
  for (const w of state.workouts) {
    for (const e of w.entries) {
      if (e.exerciseId !== exerciseId) continue;
      const sets = e.sets.filter(isWorking);
      if (!sets.length) continue;
      const ex = exercise(exerciseId);
      const top = sets.reduce((a, s) => setWeight(s) > setWeight(a) ? s : a, sets[0]);
      const best = sets.reduce((a, s) => e1rm(setWeight(s), +s.reps) > a ? e1rm(setWeight(s), +s.reps) : a, 0);
      out.push({
        t: w.start, workoutId: w.id, sets,
        topWeight: setWeight(top), topReps: +top.reps || 0,
        e1rm: best,
        volume: sets.reduce((a, s) => a + setVolume(s, ex), 0),
        totalReps: sets.reduce((a, s) => a + (+s.reps || 0), 0)
      });
    }
  }
  return out.sort((a, b) => a.t - b.t);
}

export function lastPerformance(exerciseId, beforeTs = Infinity) {
  const h = historyFor(exerciseId).filter(x => x.t < beforeTs);
  return h.length ? h[h.length - 1] : null;
}

export function personalBests(exerciseId) {
  const h = historyFor(exerciseId);
  if (!h.length) return null;
  const heaviest = h.reduce((a, x) => x.topWeight > a.topWeight ? x : a, h[0]);
  const best1rm = h.reduce((a, x) => x.e1rm > a.e1rm ? x : a, h[0]);
  const bestVol = h.reduce((a, x) => x.volume > a.volume ? x : a, h[0]);
  let bestReps = { reps: 0, t: 0, w: 0 };
  for (const s of h) for (const st of s.sets) {
    if ((+st.reps || 0) > bestReps.reps) bestReps = { reps: +st.reps, t: s.t, w: setWeight(st) };
  }
  return { heaviest, best1rm, bestVol, bestReps, sessions: h.length, first: h[0], last: h[h.length - 1] };
}

// Is this set a record at the moment it is logged?
export function prCheck(exerciseId, set) {
  const w = setWeight(set), r = +set.reps || 0;
  if (!w || !r) return null;
  const h = historyFor(exerciseId);
  if (!h.length) return 'first';
  const maxW = Math.max(...h.map(x => x.topWeight));
  const max1 = Math.max(...h.map(x => x.e1rm));
  if (w > maxW) return 'weight';
  if (e1rm(w, r) > max1) return 'e1rm';
  return null;
}

export function stats() {
  const ws = state.workouts;
  const totalVol = ws.reduce((a, w) => a + workoutVolume(w), 0);
  const totalSets = ws.reduce((a, w) => a + w.entries.reduce((b, e) => b + e.sets.filter(isWorking).length, 0), 0);
  const days = [...new Set(ws.map(w => dayKey(w.start)))].sort((a, b) => b - a);
  // Consecutive calendar weeks (Mon-start) containing at least one workout.
  // The current week is allowed to be empty so far without breaking the run.
  const trained = new Set(ws.map(w => weekStart(w.start)));
  let cursor = weekStart(Date.now());
  if (!trained.has(cursor)) cursor = weekStart(cursor - 864e5);
  let streak = 0;
  while (trained.has(cursor)) { streak++; cursor = weekStart(cursor - 864e5); }
  const weekAgo = Date.now() - 7 * 864e5;
  return {
    workouts: ws.length, totalVol, totalSets,
    thisWeek: ws.filter(w => w.start > weekAgo).length,
    time: ws.reduce((a, w) => a + (w.duration || 0), 0),
    streak, days: days.length
  };
}
export function weekStart(ts) {
  const d = new Date(ts);
  d.setHours(12, 0, 0, 0);                    // midday avoids DST edge cases
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
export function workoutVolume(w) {
  return w.entries.reduce((a, e) => {
    const ex = exercise(e.exerciseId);
    return a + e.sets.filter(isWorking).reduce((b, s) => b + setVolume(s, ex), 0);
  }, 0);
}

/* ---------------- routines ---------------- */
export function saveRoutine(name, exerciseIds) {
  const r = { id: uid(), name, exerciseIds, created: Date.now() };
  state.routines.push(r); commit(true); return r;
}
export function deleteRoutine(id) { state.routines = state.routines.filter(r => r.id !== id); commit(true); }
export function updateRoutine(id, patch) {
  const r = state.routines.find(x => x.id === id);
  if (!r) return null;
  Object.assign(r, patch);
  commit(true);
  return r;
}

/* ---------------- data portability ---------------- */
export function exportData() {
  // The API key is a credential, not training data - keep it out of backups.
  const { ai, ...settings } = state.settings;
  return JSON.stringify({
    ...state,
    settings: { ...settings, ai: { ...ai, key: '' } },
    exported: new Date().toISOString(), app: 'ironlog'
  }, null, 2);
}
export function importData(json, merge = false) {
  const d = JSON.parse(json);
  if (!d || typeof d !== 'object' || !Array.isArray(d.workouts)) throw new Error('Not an Iron Log backup file.');
  if (merge) {
    const have = new Set(state.workouts.map(w => w.id));
    state.workouts.push(...d.workouts.filter(w => !have.has(w.id)));
    const haveC = new Set(state.custom.map(c => c.id));
    state.custom.push(...(d.custom || []).filter(c => !haveC.has(c.id)));
    const haveR = new Set(state.routines.map(r => r.id));
    state.routines.push(...(d.routines || []).filter(r => !haveR.has(r.id)));
    state.bodyweight.push(...(d.bodyweight || []));
  } else {
    Object.assign(state, structuredClone(DEFAULTS), d, { settings: { ...DEFAULTS.settings, ...(d.settings || {}) } });
  }
  invalidateExercises();
  commit(true);
}
export function clearChat() { state.chat = []; commit(true); }
export function wipe() {
  Object.assign(state, structuredClone(DEFAULTS));
  invalidateExercises();
  commit(true);
}
