import { el, mount } from '../util.js';
import { openSheet, icon, toast } from '../ui.js';
import { state, commit, addCustomExercise, addEntry, startWorkout, saveRoutine, invalidateExercises } from '../store.js';
import { chat, parseActions, describeAction, findExercise, aiReady } from '../ai.js';
import { openAISetup } from './settings.js';

let controller = null;

const STARTERS = [
  'What should I train today?',
  'Build me a 3-day plan for the week',
  'Am I making progress on bench press?',
  'What muscles am I neglecting?',
  'Suggest an exercise for wider shoulders'
];

export function openChat(ctx) {
  openSheet('AI Coach', close => {
    const wrap = el('div', { style: 'display:flex;flex-direction:column;min-height:52vh' });
    const log = el('div', { class: 'chat-log', id: 'chatLog' });
    const composer = el('div', { class: 'chat-composer' });
    const input = el('textarea', { rows: 1, placeholder: 'Ask your coach…', enterkeyhint: 'send' });
    const send = el('button', { class: 'btn primary chat-send', title: 'Send' }, icon('chev'));

    /* ---------- rendering ---------- */
    function bubble(role, text) {
      const b = el('div', { class: 'msg ' + role });
      b.append(el('div', { class: 'msg-body' }, renderText(text)));
      log.append(b);
      return b;
    }

    function renderText(text) {
      // Deliberately minimal: bold, inline code and list bullets. No raw HTML.
      const frag = document.createDocumentFragment();
      for (const line of String(text).split('\n')) {
        const p = el('div', { class: 'msg-line' });
        let rest = line;
        const bullet = /^\s*[-*]\s+/.test(line);
        if (bullet) { rest = line.replace(/^\s*[-*]\s+/, ''); p.classList.add('bullet'); }
        const parts = rest.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        for (const seg of parts) {
          if (!seg) continue;
          if (seg.startsWith('**') && seg.endsWith('**')) p.append(el('strong', {}, seg.slice(2, -2)));
          else if (seg.startsWith('`') && seg.endsWith('`')) p.append(el('code', {}, seg.slice(1, -1)));
          else p.append(document.createTextNode(seg));
        }
        frag.append(p);
      }
      return frag;
    }

    function actionCard(a, container) {
      const d = describeAction(a);
      if (!d) return;
      const card = el('div', { class: 'action-card' });
      const btn = el('button', { class: 'btn sm primary' }, d.cta);
      btn.addEventListener('click', async () => {
        const msg = await applyAction(a, ctx);
        card.innerHTML = '';
        mount(card, el('div', { class: 'row' }, el('span', { class: 'ok' }, '✓'), el('div', { class: 'small' }, msg)));
      });
      mount(card,
        el('div', { style: 'flex:1;min-width:0' },
          el('div', { class: 'tiny faint' }, 'Suggested change'),
          el('div', { class: 'small', style: 'font-weight:600;margin-top:2px' }, d.title)),
        btn);
      container.append(card);
    }

    function redrawLog() {
      log.innerHTML = '';
      if (!state.chat.length) {
        const intro = el('div', { class: 'chat-intro' },
          el('div', { style: 'font-size:30px' }, '🤖'),
          el('div', { style: 'font-weight:650;margin-top:6px' }, 'Your training coach'),
          el('div', { class: 'small muted', style: 'margin:6px 0 14px' },
            'It can see your workout history, records and exercise library — and it can add exercises or build routines for you.'));
        const chips = el('div', { class: 'stack', style: 'gap:7px' });
        STARTERS.forEach(s => chips.append(el('button', { class: 'btn sm ghost', style: 'justify-content:flex-start;text-align:left', onclick: () => ask(s) }, s)));
        intro.append(chips);
        log.append(intro);
        return;
      }
      for (const m of state.chat) {
        if (m.role === 'user') { bubble('user', m.content); continue; }
        const { text, actions } = parseActions(m.content);
        const b = bubble('bot', text || (actions.length ? '' : '(no reply)'));
        // A reply that is nothing but an action card needs no empty bubble above it.
        if (!text && actions.length) b.querySelector('.msg-body').remove();
        actions.forEach(a => actionCard(a, b));
      }
      log.scrollTop = log.scrollHeight;
    }

    /* ---------- sending ---------- */
    async function ask(text) {
      if (!text.trim() || controller) return;
      if (!aiReady()) {
        toast('Set up the AI connection first');
        close(); setTimeout(() => openAISetup(ctx), 280);
        return;
      }
      state.chat.push({ role: 'user', content: text.trim() });
      commit();
      redrawLog();
      input.value = ''; autosize();

      const b = bubble('bot', '');
      const bodyEl = b.querySelector('.msg-body');
      bodyEl.append(el('span', { class: 'typing' }, el('i'), el('i'), el('i')));
      log.scrollTop = log.scrollHeight;

      controller = new AbortController();
      send.classList.add('stop');
      send.innerHTML = ''; send.append(el('span', { style: 'font-size:12px;font-weight:700' }, '■'));

      let acc = '';
      try {
        await chat(state.chat, {
          signal: controller.signal,
          onDelta: piece => {
            acc += piece;
            const { text } = parseActions(acc);
            bodyEl.innerHTML = '';
            bodyEl.append(renderText(
              text || (acc.includes('```ironlog') ? 'Preparing a change…' : '…')));
            log.scrollTop = log.scrollHeight;
          }
        });
        state.chat.push({ role: 'assistant', content: acc });
        commit();
        redrawLog();
      } catch (e) {
        if (e.name === 'AbortError') {
          if (acc.trim()) { state.chat.push({ role: 'assistant', content: acc }); commit(); }
          redrawLog();
        } else {
          bodyEl.innerHTML = '';
          bodyEl.append(el('div', { class: 'err' }, renderText(e.message)));
          const fix = el('button', { class: 'btn sm', style: 'margin-top:8px', onclick: () => { close(); setTimeout(() => openAISetup(ctx), 280); } }, 'Open AI settings');
          bodyEl.append(fix);
        }
      } finally {
        controller = null;
        send.classList.remove('stop');
        send.innerHTML = ''; send.append(icon('chev'));
        log.scrollTop = log.scrollHeight;
      }
    }

    const autosize = () => { input.style.height = 'auto'; input.style.height = Math.min(120, input.scrollHeight) + 'px'; };
    input.addEventListener('input', autosize);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input.value); }
    });
    send.addEventListener('click', () => {
      if (controller) { controller.abort(); return; }
      ask(input.value);
    });

    mount(composer, input, send);
    mount(wrap, log, composer);
    redrawLog();
    return wrap;
  });
}

/* ---------------------------------------------------------------------------
 * Applying a confirmed action
 * ------------------------------------------------------------------------- */
async function applyAction(a, ctx) {
  try {
    if (a.action === 'create_exercise') {
      const clean = s => Array.isArray(s) ? s.filter(x => typeof x === 'string') : [];
      const ex = addCustomExercise({
        name: String(a.name || 'New exercise').slice(0, 80),
        cat: a.cat || 'Other', eq: a.eq || 'Other',
        prim: clean(a.prim), sec: clean(a.sec),
        paired: !!a.paired, uni: !!a.uni, bw: !!a.bw,
        mech: a.mech || 'Compound', force: a.force || 'Push', level: a.level || 'Beginner',
        desc: typeof a.desc === 'string' ? a.desc : '',
        setup: clean(a.setup), steps: clean(a.steps), tips: clean(a.tips),
        safety: clean(a.safety), mistakes: clean(a.mistakes)
      });
      invalidateExercises();
      ctx.refresh();
      return `"${ex.name}" added to your library.`;
    }

    if (a.action === 'add_to_workout') {
      const names = Array.isArray(a.names) ? a.names : [a.name].filter(Boolean);
      const found = names.map(findExercise).filter(Boolean);
      if (!found.length) return 'None of those exercises could be matched to your library.';
      if (!state.active) startWorkout();
      found.forEach(e => addEntry(e.id));
      ctx.refresh();
      return `Added ${found.map(e => e.name).join(', ')} to your workout.`;
    }

    if (a.action === 'create_routine') {
      const names = Array.isArray(a.names) ? a.names : [];
      const found = names.map(findExercise).filter(Boolean);
      if (!found.length) return 'None of those exercises could be matched to your library.';
      saveRoutine(String(a.name || 'AI routine').slice(0, 60), found.map(e => e.id));
      ctx.refresh();
      return `Routine "${a.name}" saved with ${found.length} exercises.`;
    }
    return 'Unknown action.';
  } catch (e) {
    return 'Could not apply that: ' + e.message;
  }
}
