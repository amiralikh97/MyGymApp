import { el, esc } from '../util.js';
import { openSheet, icon, toast } from '../ui.js';
import { allExercises, state, historyFor, addCustomExercise, invalidateExercises } from '../store.js';
import { showExercise } from './exercise.js';

const CATS = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio'];
const EQS = ['Any', 'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Smith Machine', 'Kettlebell', 'EZ Bar', 'Other'];

let lastCat = 'All', lastEq = 'Any', lastQ = '';

/**
 * Exercise picker. onPick(ids[]) fires with everything selected.
 */
export function openPicker(onPick, { multi = true, title = 'Add exercises' } = {}) {
  const chosen = new Set();

  openSheet(title, close => {
    const search = el('input', { type: 'search', placeholder: 'Search 100+ exercises…', value: lastQ, enterkeyhint: 'search' });
    const catRow = el('div', { class: 'chips' });
    const eqRow = el('div', { class: 'chips' });
    const list = el('div', { style: 'margin-top:12px' });
    const bar = el('div', { style: 'position:sticky;bottom:0;padding-top:10px;background:linear-gradient(transparent,var(--bg-elev) 30%)' });

    const mkChips = (row, items, get, set) => {
      row.innerHTML = '';
      items.forEach(v => row.append(el('button', {
        class: 'chip' + (get() === v ? ' on' : ''),
        onclick: () => { set(v); mkChips(row, items, get, set); draw(); }
      }, v)));
    };

    function refreshBar() {
      bar.innerHTML = '';
      if (!chosen.size) return;
      bar.append(el('button', {
        class: 'btn wide primary',
        onclick: () => { onPick([...chosen]); close(); }
      }, `Add ${chosen.size} exercise${chosen.size > 1 ? 's' : ''}`));
    }

    function draw() {
      const q = search.value.trim().toLowerCase();
      lastQ = search.value;
      let items = allExercises();
      if (lastCat !== 'All') items = items.filter(e => e.cat === lastCat);
      if (lastEq !== 'Any') items = items.filter(e => e.eq === lastEq);
      if (q) {
        items = items.filter(e =>
          e.name.toLowerCase().includes(q) ||
          e.eq.toLowerCase().includes(q) ||
          [...e.prim, ...e.sec].some(m => m.toLowerCase().includes(q)));
      }
      // Recently used first when there is no query.
      if (!q) {
        const recent = new Map();
        for (const w of state.workouts.slice(-25)) for (const en of w.entries) recent.set(en.exerciseId, w.start);
        items.sort((a, b) => (recent.get(b.id) || 0) - (recent.get(a.id) || 0) || a.name.localeCompare(b.name));
      } else {
        items.sort((a, b) => a.name.toLowerCase().indexOf(q) - b.name.toLowerCase().indexOf(q) || a.name.localeCompare(b.name));
      }

      list.innerHTML = '';
      if (!items.length) {
        list.append(el('div', { class: 'empty' },
          el('div', {}, 'No exercise matches that.'),
          el('button', { class: 'btn sm', style: 'margin-top:12px', onclick: () => createCustom(search.value, id => { chosen.add(id); draw(); refreshBar(); }) }, 'Create "' + esc(search.value || 'custom') + '"')));
        return;
      }
      items.slice(0, 300).forEach(e => {
        const n = historyFor(e.id).length;
        const row = el('button', {
          class: 'lrow',
          onclick: () => {
            if (!multi) { onPick([e.id]); close(); return; }
            chosen.has(e.id) ? chosen.delete(e.id) : chosen.add(e.id);
            row.style.borderColor = chosen.has(e.id) ? 'var(--accent)' : '';
            tick.className = 'tick' + (chosen.has(e.id) ? ' on' : '');
            refreshBar();
          }
        });
        const tick = el('div', { class: 'tick' + (chosen.has(e.id) ? ' on' : '') }, icon('check'));
        row.append(
          el('div', { style: 'flex:1;min-width:0' },
            el('div', { class: 't' }, e.name),
            el('div', { class: 's' }, `${e.eq} · ${e.prim.join(', ') || e.cat}${n ? ` · ${n} session${n > 1 ? 's' : ''}` : ''}`)),
          el('button', {
            class: 'icon-btn plain', title: 'How to do it',
            onclick: ev => { ev.stopPropagation(); showExercise(e.id, { back: () => openPicker(onPick, { multi, title }) }); }
          }, icon('info')),
          multi ? tick : icon('chev', 'chev'));
        if (chosen.has(e.id)) row.style.borderColor = 'var(--accent)';
        list.append(row);
      });
      list.append(el('div', { class: 'center tiny faint', style: 'padding:16px 0' },
        el('button', { class: 'btn sm ghost', onclick: () => createCustom('', id => { chosen.add(id); draw(); refreshBar(); }) }, '+ Create custom exercise')));
    }

    search.addEventListener('input', draw);
    mkChips(catRow, CATS, () => lastCat, v => lastCat = v);
    mkChips(eqRow, EQS, () => lastEq, v => lastEq = v);
    draw();
    setTimeout(() => { if (window.innerHeight > 700) search.focus(); }, 320);

    return el('div', {},
      search,
      el('div', { style: 'margin-top:10px' }, catRow),
      el('div', { style: 'margin-top:6px' }, eqRow),
      list, bar);
  });
}

export function createCustom(name = '', after) {
  openSheet('New exercise', close => {
    const f = {
      name: el('input', { value: name, placeholder: 'e.g. Cable Y-Raise' }),
      cat: el('select', {}, ...['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body', 'Cardio', 'Other'].map(c => el('option', {}, c))),
      eq: el('select', {}, ...['Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Smith Machine', 'Kettlebell', 'EZ Bar', 'Band', 'Plate', 'Other'].map(c => el('option', {}, c))),
      prim: el('input', { placeholder: 'e.g. Shoulders, Traps' }),
      desc: el('textarea', { rows: 3, placeholder: 'Notes on how you perform it (optional)' }),
      paired: el('input', { type: 'checkbox' })
    };
    const field = (label, node, hint) => el('div', {},
      el('div', { class: 'pill-h', style: 'margin-bottom:5px' }, label), node,
      hint && el('div', { class: 'tiny faint', style: 'margin-top:4px' }, hint));

    return el('div', { class: 'stack' },
      field('Name', f.name),
      el('div', { class: 'row' },
        el('div', { style: 'flex:1' }, field('Category', f.cat)),
        el('div', { style: 'flex:1' }, field('Equipment', f.eq))),
      field('Muscles worked', f.prim, 'Comma separated'),
      field('Notes', f.desc),
      el('label', { class: 'srow', style: 'border:0' }, f.paired,
        el('span', { style: 'flex:1' }, 'Two dumbbells (allow separate left/right weights)')),
      el('button', {
        class: 'btn wide primary',
        onclick: () => {
          const nm = f.name.value.trim();
          if (!nm) return toast('Give it a name first');
          const ex = addCustomExercise({
            name: nm, cat: f.cat.value, eq: f.eq.value,
            prim: f.prim.value.split(',').map(s => s.trim()).filter(Boolean),
            desc: f.desc.value.trim(), paired: f.paired.checked
          });
          invalidateExercises();
          close();
          toast('Exercise created');
          after?.(ex.id);
        }
      }, 'Create exercise'));
  });
}
