import { el } from '../util.js';
import { icon } from '../ui.js';
import { allExercises, historyFor } from '../store.js';
import { showExercise } from './exercise.js';
import { createCustom } from './picker.js';

const CATS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio'];
const EQS = ['Any', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Smith Machine', 'Kettlebell', 'EZ Bar', 'Band', 'Plate', 'Other'];
let cat = 'All', eq = 'Any', q = '';

export function render(main, ctx) {
  main.innerHTML = '';
  const v = el('div', { class: 'view' });
  const search = el('input', { type: 'search', placeholder: 'Search exercises, muscles, equipment…', value: q });
  const catRow = el('div', { class: 'chips', style: 'margin-top:10px' });
  const eqRow = el('div', { class: 'chips', style: 'margin-top:6px' });
  const list = el('div', { style: 'margin-top:14px' });

  const chips = (row, items, get, set) => {
    row.innerHTML = '';
    items.forEach(x => row.append(el('button', {
      class: 'chip' + (get() === x ? ' on' : ''),
      onclick: () => { set(x); chips(row, items, get, set); draw(); }
    }, x)));
  };

  function draw() {
    q = search.value;
    const s = q.trim().toLowerCase();
    let items = allExercises();
    if (cat !== 'All') items = items.filter(e => e.cat === cat);
    if (eq !== 'Any') items = items.filter(e => e.eq === eq);
    if (s) items = items.filter(e => e.name.toLowerCase().includes(s) || e.eq.toLowerCase().includes(s) || [...e.prim, ...e.sec].some(m => m.toLowerCase().includes(s)));
    items.sort((a, b) => a.name.localeCompare(b.name));

    list.innerHTML = '';
    list.append(el('div', { class: 'pill-h', style: 'margin:0 2px 8px' }, `${items.length} exercise${items.length === 1 ? '' : 's'}`));
    if (!items.length) list.append(el('div', { class: 'empty' }, 'Nothing matches those filters.'));

    for (const e of items) {
      const n = historyFor(e.id).length;
      list.append(el('button', { class: 'lrow', onclick: () => showExercise(e.id) },
        el('div', { style: 'flex:1;min-width:0' },
          el('div', { class: 't' }, e.name, e.custom ? el('span', { class: 'badge', style: 'margin-left:6px' }, 'Custom') : null),
          el('div', { class: 's' }, `${e.eq} · ${e.prim.join(', ') || e.cat}`)),
        n ? el('span', { class: 'badge' }, n + '×') : null,
        icon('chev', 'chev')));
    }
    list.append(el('div', { class: 'center', style: 'padding:18px 0' },
      el('button', { class: 'btn sm ghost', onclick: () => createCustom('', () => draw()) }, '+ Create custom exercise')));
  }

  search.addEventListener('input', draw);
  chips(catRow, CATS, () => cat, x => cat = x);
  chips(eqRow, EQS, () => eq, x => eq = x);
  draw();
  v.append(search, catRow, eqRow, list);
  main.append(v);
}
