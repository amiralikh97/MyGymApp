// Bumped on every deploy: the browser only reinstalls this worker when the
// file's bytes change, so a stale version number means clients never update.
const CACHE = 'ironlog-v3';

const ASSETS = [
  './', './index.html', './css/app.css', './manifest.webmanifest',
  './js/app.js', './js/store.js', './js/util.js', './js/ui.js', './js/timer.js', './js/ai.js',
  './js/data/exercises.js',
  './js/views/train.js', './js/views/library.js', './js/views/progress.js',
  './js/views/history.js', './js/views/settings.js', './js/views/picker.js', './js/views/exercise.js',
  './js/views/chat.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png', './icons/icon-maskable.png'
];

const NET_TIMEOUT = 3500;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/**
 * Network-first, falling back to cache.
 *
 * The previous stale-while-revalidate strategy served the cached copy first,
 * so a deployed fix took two app launches to appear and looked like the bug
 * was never fixed. Being online should always mean running current code; the
 * cache is the offline safety net, not the default source.
 *
 * Offline, fetch rejects immediately and we fall straight through to the
 * cache. The timeout only matters on a connection that hangs rather than
 * failing outright.
 */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  e.respondWith((async () => {
    try {
      const res = await withTimeout(fetch(req), NET_TIMEOUT);
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    } catch (err) {
      const hit = await caches.match(req);
      if (hit) return hit;
      // A navigation with nothing cached for that exact URL still gets the app.
      if (req.mode === 'navigate') {
        const shell = await caches.match('./index.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(r => { clearTimeout(t); resolve(r); },
                 e => { clearTimeout(t); reject(e); });
  });
}
