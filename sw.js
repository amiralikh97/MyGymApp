// Bump CACHE when you deploy changes so clients pick them up.
const CACHE = 'ironlog-v1';
const ASSETS = [
  './', './index.html', './css/app.css', './manifest.webmanifest',
  './js/app.js', './js/store.js', './js/util.js', './js/ui.js', './js/timer.js',
  './js/data/exercises.js',
  './js/views/train.js', './js/views/library.js', './js/views/progress.js',
  './js/views/history.js', './js/views/settings.js', './js/views/picker.js', './js/views/exercise.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png', './icons/icon-maskable.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Stale-while-revalidate: instant offline loads, updates land on the next visit.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
