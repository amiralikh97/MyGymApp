// ---------------------------------------------------------------------------
// AI coach client
// ---------------------------------------------------------------------------
// Talks to any OpenAI-compatible chat-completions endpoint. NVIDIA's own API
// sends no CORS headers, so a browser cannot call it directly - point `url` at
// a small proxy instead (see proxy/cloudflare-worker.js). The proxy also keeps
// the API key off the device and out of the repository.
// ---------------------------------------------------------------------------

import { state, allExercises, historyFor, personalBests, exercise, stats } from './store.js';
import { nf, fromKg, fmtDate, isWorking, setWeight } from './util.js';

export const DEFAULT_MODEL = 'deepseek-ai/deepseek-v4-pro-0813';
export const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

export const aiConfig = () => state.settings.ai || {};
// An endpoint is all that is required. The key is optional - the usual setup
// puts it in the proxy, and a genuinely missing key comes back as a 401 with a
// message that says so, rather than being guessed at up front.
export const aiReady = () => !!aiConfig().url;

/* ---------------------------------------------------------------------------
 * Context: a compact picture of the user's training for the system prompt.
 * ------------------------------------------------------------------------- */
function libraryDigest() {
  const byCat = {};
  for (const e of allExercises()) (byCat[e.cat] ||= []).push(e.name);
  return Object.entries(byCat).map(([c, names]) => `${c}: ${names.join(', ')}`).join('\n');
}

function recentDigest(limit = 8) {
  const ws = [...state.workouts].sort((a, b) => b.start - a.start).slice(0, limit);
  if (!ws.length) return 'No workouts logged yet.';
  const U = state.settings.unit;
  return ws.map(w => {
    const lines = w.entries.map(e => {
      const ex = exercise(e.exerciseId);
      const sets = e.sets.filter(isWorking);
      if (!sets.length) return null;
      const top = sets.reduce((a, s) => setWeight(s) > setWeight(a) ? s : a, sets[0]);
      return `    ${ex?.name || '?'} - ${sets.length} sets, top ${nf(fromKg(setWeight(top), U), 1)}${U} x ${top.reps}`;
    }).filter(Boolean);
    return `  ${fmtDate(w.start)} "${w.name}" (${Math.round((w.duration || 0) / 60)} min)\n${lines.join('\n')}`;
  }).join('\n');
}

function prDigest() {
  const U = state.settings.unit;
  const rows = [];
  for (const ex of allExercises()) {
    const pb = personalBests(ex.id);
    if (!pb) continue;
    rows.push(`  ${ex.name}: best ${nf(fromKg(pb.heaviest.topWeight, U), 1)}${U} x ${pb.heaviest.topReps}, est 1RM ${nf(fromKg(pb.best1rm.e1rm, U), 1)}${U}, ${pb.sessions} sessions, last ${fmtDate(pb.last.t)}`);
  }
  return rows.length ? rows.join('\n') : '  None yet.';
}

function activeDigest() {
  const w = state.active;
  if (!w) return 'No workout in progress.';
  const U = state.settings.unit;
  const lines = w.entries.map(e => {
    const ex = exercise(e.exerciseId);
    const done = e.sets.filter(s => s.done);
    return `  ${ex?.name || '?'}: ${done.length}/${e.sets.length} sets done` +
      (done.length ? ` (last ${nf(fromKg(setWeight(done[done.length - 1]), U), 1)}${U} x ${done[done.length - 1].reps})` : '');
  });
  return `IN PROGRESS: "${w.name}"\n${lines.join('\n') || '  (no exercises added yet)'}`;
}

export function buildContext() {
  const U = state.settings.unit;
  const s = stats();
  const bw = state.bodyweight?.[state.bodyweight.length - 1];
  return `USER TRAINING DATA (units: ${U})

Summary: ${s.workouts} workouts logged, ${s.thisWeek} in the last 7 days, ${s.streak} week streak.${bw ? ` Bodyweight ${nf(fromKg(bw.kg, U), 1)}${U}.` : ''}

${activeDigest()}

RECENT WORKOUTS:
${recentDigest()}

PERSONAL RECORDS:
${prDigest()}

EXERCISE LIBRARY (use these exact names when referring to existing exercises):
${libraryDigest()}`;
}

const SYSTEM = `You are the built-in coach inside "Iron Log", a workout tracking app. You are talking to the app's owner about their own training.

You can see their full training history, personal records and exercise library in the context below. Use it - refer to their actual numbers, name their actual lifts, and notice things like stalled progress, missed muscle groups or uneven training frequency.

STYLE
- Be direct and practical. Short paragraphs, no filler, no motivational fluff.
- Use their weight unit. Give concrete numbers (sets, reps, weights) rather than vague advice.
- If they ask for a plan, give a specific one they can follow this week.
- If something in their data looks like an injury risk (huge jumps in load, no rest days, glaring imbalances), say so plainly once.
- You are not a doctor. For pain or injury, say so briefly and suggest they see a professional.

ACTIONS
You can change the app. To do so, emit a fenced code block tagged \`ironlog\` containing ONE json object. The user sees a button and must confirm before anything changes - never claim you already did it, say what the button will do.

Add a new exercise to their library:
\`\`\`ironlog
{"action":"create_exercise","name":"Cable Y-Raise","cat":"Shoulders","eq":"Cable","prim":["Shoulders"],"sec":["Traps"],"paired":true,"desc":"one or two plain sentences","setup":["..."],"steps":["...","..."],"tips":["..."],"safety":["..."],"mistakes":["..."]}
\`\`\`
cat must be one of: Chest, Back, Shoulders, Arms, Legs, Core, Full Body, Cardio.
eq must be one of: Barbell, Dumbbell, Machine, Cable, Bodyweight, Smith Machine, Kettlebell, EZ Bar, Band, Plate, Other.
Write setup/steps/tips/safety/mistakes in the same plain, beginner-friendly voice as the rest of the app. Always include safety notes.

Add exercises to the workout in progress (or start one):
\`\`\`ironlog
{"action":"add_to_workout","names":["Barbell Bench Press","Incline Dumbbell Press"]}
\`\`\`

Save a routine:
\`\`\`ironlog
{"action":"create_routine","name":"Push Day A","names":["Barbell Bench Press","Seated Dumbbell Shoulder Press","Triceps Pushdown (Rope or Bar)"]}
\`\`\`

Only emit an action when the user actually asked for that change. You may emit several blocks in one reply.

Always write at least one plain sentence outside the block saying what you are proposing and why - never reply with a bare code block.`;

/* ---------------------------------------------------------------------------
 * Streaming chat
 * ------------------------------------------------------------------------- */
export async function chat(messages, { onDelta, signal } = {}) {
  const cfg = aiConfig();
  if (!cfg.url) throw new Error('No AI endpoint configured. Open Settings and set one up.');

  const body = {
    model: cfg.model || DEFAULT_MODEL,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'system', content: buildContext() },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ],
    temperature: 0.6,
    max_tokens: 2048,
    stream: true
  };

  let res;
  try {
    res = await fetch(cfg.url, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(cfg.key ? { Authorization: 'Bearer ' + cfg.key } : {})
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    // A blocked cross-origin request is indistinguishable from an offline one
    // here, so name both likely causes rather than guessing.
    const direct = /integrate\.api\.nvidia\.com/.test(cfg.url || '');
    throw new Error(
      'Could not reach the AI endpoint.\n\n' + (direct
        ? 'This is NVIDIA\'s own address, and a browser cannot call it: NVIDIA sends no CORS headers. Point this at your proxy instead.'
        : 'Either you are offline, or your proxy rejected this origin. Check that ALLOWED_ORIGIN on the Worker matches ' + location.origin + ' exactly.')
    );
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    if (res.status === 401 || res.status === 403) throw new Error('The API key was rejected (HTTP ' + res.status + '). Check it in Settings.');
    if (res.status === 429) throw new Error('Rate limited by the API. Wait a moment and try again.');
    throw new Error(`Request failed (HTTP ${res.status}). ${txt.slice(0, 300)}`);
  }

  // Some proxies drop streaming; fall back to reading a whole JSON body.
  const ctype = res.headers.get('content-type') || '';
  if (!res.body || ctype.includes('application/json')) {
    const j = await res.json();
    const text = j.choices?.[0]?.message?.content || '';
    onDelta?.(text);
    return text;
  }

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '', full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split('\n\n');
    buf = parts.pop();
    for (const part of parts) {
      const line = part.split('\n').find(l => l.startsWith('data:'));
      if (!line) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') continue;
      try {
        const j = JSON.parse(payload);
        const d = j.choices?.[0]?.delta;
        const piece = d?.content;      // reasoning_content is deliberately ignored
        if (piece) { full += piece; onDelta?.(piece); }
      } catch (e) { /* skip malformed chunk */ }
    }
  }
  return full;
}

/* ---------------------------------------------------------------------------
 * Actions embedded in a reply
 * ------------------------------------------------------------------------- */
const FENCE = /```ironlog\s*([\s\S]*?)```/g;

/** Split a reply into display text (fences removed) and parsed actions. */
export function parseActions(text) {
  const actions = [];
  let clean = text.replace(FENCE, (_, json) => {
    try {
      const o = JSON.parse(json.trim());
      if (o && o.action) actions.push(o);
    } catch (e) { /* model produced invalid json - drop the block */ }
    return '';
  });
  // Hide a fence that is still mid-stream so half-typed json never shows.
  clean = clean.replace(/```ironlog[\s\S]*$/, '');
  return { text: clean.replace(/\n{3,}/g, '\n\n').trim(), actions };
}

export function describeAction(a) {
  switch (a.action) {
    case 'create_exercise': return { title: 'Add "' + (a.name || '?') + '" to your exercise library', cta: 'Add exercise' };
    case 'add_to_workout': return { title: 'Add to your workout: ' + (a.names || []).join(', '), cta: 'Add to workout' };
    case 'create_routine': return { title: 'Save routine "' + (a.name || '?') + '" (' + (a.names || []).length + ' exercises)', cta: 'Save routine' };
    default: return null;
  }
}

/** Resolve a model-supplied exercise name to a library id, tolerating near misses. */
export function findExercise(name) {
  if (!name) return null;
  const n = String(name).trim().toLowerCase();
  const all = allExercises();
  return all.find(e => e.name.toLowerCase() === n)
    || all.find(e => e.id === n)
    || all.find(e => e.name.toLowerCase().includes(n))
    || all.find(e => n.includes(e.name.toLowerCase()))
    || null;
}
