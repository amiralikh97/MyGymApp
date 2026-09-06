import { $, el } from './util.js';
import { icon, closeSheet, sheetOpen } from './ui.js';
import { state } from './store.js';
import { keepAwake, onRest, restLeft } from './timer.js';
import * as Train from './views/train.js';
import * as Library from './views/library.js';
import * as Progress from './views/progress.js';
import * as History from './views/history.js';
import * as Settings from './views/settings.js';
import { openChat } from './views/chat.js';

const TABS = [
  { id: 'train', label: 'Train', icon: 'dumbbell', title: 'Train', mod: Train },
  { id: 'history', label: 'History', icon: 'history', title: 'History', mod: History },
  { id: 'library', label: 'Exercises', icon: 'book', title: 'Exercise library', mod: Library },
  { id: 'progress', label: 'Progress', icon: 'chart', title: 'Progress', mod: Progress }
];

let current = 'train';
const ctx = {
  go(id) { current = id; render(); },
  refresh() { render(); }
};

function render() {
  const tab = TABS.find(t => t.id === current) || TABS[0];
  Train.cleanup();

  $('#title').textContent = tab.title;
  const sub = $('#subtitle');
  if (current === 'train' && state.active) {
    sub.textContent = `${state.active.name} · in progress`;
  } else if (current === 'train') {
    sub.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  } else sub.textContent = '';

  const actions = $('#topActions');
  actions.innerHTML = '';
  actions.append(el('button', { class: 'icon-btn', title: 'Settings', onclick: () => Settings.open(ctx) }, icon('cog')));

  tab.mod.render($('#main'), ctx);
  drawNav();
  window.scrollTo({ top: 0 });
}

function drawNav() {
  const nav = $('#nav');
  nav.innerHTML = '';
  for (const t of TABS) {
    const active = state.active && t.id === 'train';
    nav.append(el('button', {
      class: current === t.id ? 'on' : '', onclick: () => ctx.go(t.id)
    }, icon(t.icon), el('span', {}, active ? 'Active' : t.label)));
  }
}

/* Close the sheet with the phone/browser back gesture. */
history.replaceState({ sheet: false }, '');
window.addEventListener('popstate', () => { if (sheetOpen()) closeSheet(); });
new MutationObserver(() => {
  const open = sheetOpen();
  if (open && !history.state?.sheet) history.pushState({ sheet: true }, '');
  $('#aiFab').style.opacity = open ? '0' : '';
  $('#aiFab').style.pointerEvents = open ? 'none' : '';
}).observe($('#sheet'), { attributes: true, attributeFilter: ['class'] });

/* Floating AI coach button. Lifts clear of the rest timer when it appears. */
$('#aiFab').addEventListener('click', () => openChat(ctx));
document.addEventListener('ironlog:open-chat', () => openChat(ctx));
onRest(() => $('#aiFab').classList.toggle('shift', restLeft() > 0));

$('#sheetClose').addEventListener('click', closeSheet);
$('#scrim').addEventListener('click', closeSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheetOpen()) closeSheet(); });

/* Warn before leaving mid-workout. */
window.addEventListener('beforeunload', e => {
  if (state.active?.entries?.some(en => en.sets.some(s => s.done))) { e.preventDefault(); e.returnValue = ''; }
});

Settings.applyTheme();
render();
if (state.active) keepAwake(true);

/* ---------------------------------------------------------------------------
 * Service worker: offline support plus automatic updates.
 *
 * Without the reload below, a new deploy only takes effect on some later,
 * unpredictable launch - which looks exactly like a fix that never shipped.
 * ------------------------------------------------------------------------- */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', async () => {
    // Whether this page was already controlled decides if a controller change
    // means "updated" (reload) or just "first install" (do nothing).
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded) return;
      reloaded = true;
      location.reload();
    });

    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      // Check for a new version on launch, when the app is brought back to the
      // foreground, and hourly while it stays open.
      const check = () => reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
      setInterval(check, 60 * 60 * 1000);
    } catch (e) { /* offline, or served without a worker */ }
  });
}
