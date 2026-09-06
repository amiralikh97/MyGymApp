import { el, nf, fmtDate, fromKg, mount } from '../util.js';
import { openSheet, lineChart, toast, confirmSheet } from '../ui.js';
import { exercise, historyFor, personalBests, state, deleteCustomExercise } from '../store.js';

const U = () => state.settings.unit;
const w = kg => nf(fromKg(kg, U()), 1);

function section(title, items, cls = '') {
  if (!items?.length) return null;
  return el('div', { class: cls },
    el('h3', {}, title),
    el(title === 'How to do it' ? 'ol' : 'ul', {}, ...items.map(t => el('li', {}, t))));
}

/**
 * Full exercise page: description, coaching, safety, and the user's own history.
 * opts.back - render a back button that returns to wherever they came from.
 * opts.onAdd - show an "add to workout" action.
 */
export function showExercise(id, opts = {}) {
  const ex = exercise(id);
  if (!ex) return;

  openSheet(ex.name, close => {
    const body = el('div', { class: 'ex-detail' });
    const hist = historyFor(id);
    const pb = personalBests(id);

    mount(body, el('div', { class: 'chips', style: 'margin-bottom:12px' },
      el('span', { class: 'chip tag' }, ex.eq),
      el('span', { class: 'chip tag2' }, ex.mech),
      el('span', { class: 'chip tag2' }, ex.level),
      ex.force && el('span', { class: 'chip tag2' }, ex.force)));

    body.append(el('p', { style: 'margin:0 0 4px', class: ex.desc ? '' : 'muted' },
      ex.desc || 'Your own exercise — no notes added. Everything below is tracked the same way as the built-in ones.'));

    body.append(el('div', { class: 'card', style: 'margin-top:14px' },
      el('div', { class: 'pill-h' }, 'Muscles worked'),
      el('div', { style: 'margin-top:7px' },
        el('strong', {}, 'Main: '), ex.prim.join(', ') || '—'),
      ex.sec?.length ? el('div', { class: 'muted small', style: 'margin-top:4px' },
        el('strong', {}, 'Also: '), ex.sec.join(', ')) : null));

    mount(body, section('Setup', ex.setup), section('How to do it', ex.steps), section('Tips', ex.tips));

    if (ex.safety?.length) {
      body.append(el('div', { class: 'note warn', style: 'margin-top:20px' },
        el('h3', { style: 'margin:0 0 8px' }, '⚠ Safety & precautions'),
        el('ul', {}, ...ex.safety.map(t => el('li', {}, t)))));
    }
    mount(body, section('Common mistakes', ex.mistakes));

    /* ---- personal history ---- */
    body.append(el('h3', {}, 'Your history'));
    if (!pb) {
      body.append(el('p', { class: 'muted small', style: 'margin-top:0' }, 'No sets logged yet. Once you train this, your best lifts and progress chart appear here.'));
    } else {
      body.append(el('div', { class: 'stat-grid' },
        el('div', { class: 'stat' },
          el('div', { class: 'v mono' }, w(pb.heaviest.topWeight) + ' ' + U()),
          el('div', { class: 'k' }, 'Heaviest set'),
          el('div', { class: 'd faint tiny' }, `${pb.heaviest.topReps} reps · ${fmtDate(pb.heaviest.t)}`)),
        el('div', { class: 'stat' },
          el('div', { class: 'v mono' }, w(pb.best1rm.e1rm) + ' ' + U()),
          el('div', { class: 'k' }, 'Est. 1 rep max'),
          el('div', { class: 'd faint tiny' }, fmtDate(pb.best1rm.t))),
        el('div', { class: 'stat' },
          el('div', { class: 'v mono' }, pb.bestReps.reps),
          el('div', { class: 'k' }, 'Most reps'),
          el('div', { class: 'd faint tiny' }, `at ${w(pb.bestReps.w)} ${U()}`)),
        el('div', { class: 'stat' },
          el('div', { class: 'v mono' }, pb.sessions),
          el('div', { class: 'k' }, 'Sessions'),
          el('div', { class: 'd faint tiny' }, 'since ' + fmtDate(pb.first.t)))));

      if (hist.length > 1) {
        body.append(el('div', { class: 'card', style: 'margin-top:12px' },
          el('div', { class: 'row', style: 'margin-bottom:6px' },
            el('div', { class: 'pill-h' }, 'Top set over time'),
            el('div', { class: 'spacer' }),
            el('div', { class: 'tiny faint' }, U())),
          lineChart(hist.map(h => ({ x: h.t, y: fromKg(h.topWeight, U()) })))));
      }

      body.append(el('div', { style: 'margin-top:12px' },
        ...hist.slice().reverse().slice(0, 12).map(h => el('div', { class: 'lrow' },
          el('div', { style: 'flex:1;min-width:0' },
            el('div', { class: 't' }, fmtDate(h.t)),
            el('div', { class: 's' }, h.sets.map(s =>
              s.wl != null || s.wr != null
                ? `${w(+s.wl || 0)}/${w(+s.wr || 0)}×${s.reps}`
                : `${w(+s.w || 0)}×${s.reps}`).join('  ·  '))),
          el('div', { class: 'tiny faint mono' }, nf(fromKg(h.volume, U()), 0) + ' ' + U())))));
    }

    /* ---- actions ---- */
    const actions = el('div', { class: 'stack', style: 'margin-top:22px' });
    if (opts.onAdd) actions.append(el('button', { class: 'btn wide primary', onclick: () => { opts.onAdd(id); close(); } }, 'Add to workout'));
    if (opts.back) actions.append(el('button', { class: 'btn wide ghost', onclick: () => { close(); setTimeout(opts.back, 270); } }, '← Back'));
    if (ex.custom) actions.append(el('button', {
      class: 'btn wide danger',
      onclick: async () => {
        if (await confirmSheet('Delete exercise?', `"${ex.name}" will be removed from your library. Logged workouts keep their history.`, 'Delete')) {
          deleteCustomExercise(id); toast('Deleted');
        }
      }
    }, 'Delete custom exercise'));
    body.append(actions);

    return body;
  });
}
