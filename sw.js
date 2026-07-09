const CACHE_NAME = 'pmp-mastery-v34';
const ASSETS = [
  './index.html',
  './styles.css',
  './questions.js',
  './questions2.js',
  './questions3.js',
  './questions4.js',
  './questions5.js',
  './flashcards.js',
  './app.js',
  './manifest.json',
  './pmp_logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ─── Fetch (cache-first) ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;

  if (url.includes('/pages/page-') && url.includes('/markdown.md')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() =>
        new Response('Page content offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return res;
      }).catch(() =>
        new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })
      );
    })
  );
});

// ─── Notification Click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});

// ─── Background Notification Scheduler ───────────────────────────────────────
// The page sends postMessage({ type:'SCHEDULE_NOTIF', intervalSec, remainingSec, tips[] })
// The SW owns the timer — notifications fire even when the page/tab is closed.
// On page reload the page reads pmp_notif_next_fire from localStorage and sends
// the correct remainingSec so the schedule continues from where it left off.

let _notifTimer  = null;
let _notifTips   = [];
let _intervalSec = 1800; // default 30 min

function _pickTip() {
  if (!_notifTips.length) {
    return { title: 'PMP Study Reminder', body: 'Open the app to review a concept and keep your exam prep on track!' };
  }
  return _notifTips[Math.floor(Math.random() * _notifTips.length)];
}

function _fireNotification() {
  const tip = _pickTip();
  self.registration.showNotification(`📚 PMP Tip: ${tip.title}`, {
    body:     tip.body,
    icon:     './pmp_logo.png',
    badge:    './pmp_logo.png',
    tag:      'pmp-study-tip',
    renotify: true,
    silent:   false
  });
  // Broadcast next fire time to any open pages so they can sync localStorage
  const nextFireAt = Date.now() + _intervalSec * 1000;
  self.clients.matchAll().then(list =>
    list.forEach(c => c.postMessage({ type: 'NOTIF_FIRED', nextFireAt }))
  );
}

function _scheduleNext(delayMs) {
  if (_notifTimer) { clearTimeout(_notifTimer); _notifTimer = null; }
  // Clamp between 1 second and 24 hours
  const safe = Math.min(Math.max(delayMs, 1000), 86400000);
  _notifTimer = setTimeout(() => {
    _fireNotification();
    _scheduleNext(_intervalSec * 1000); // recurring at full interval
  }, safe);
}

function _cancelSchedule() {
  if (_notifTimer) { clearTimeout(_notifTimer); _notifTimer = null; }
}

self.addEventListener('message', (event) => {
  const data = event.data || {};

  if (data.type === 'SCHEDULE_NOTIF') {
    _intervalSec = data.intervalSec || 1800;
    if (data.tips && data.tips.length) _notifTips = data.tips;

    // remainingSec lets us resume without restarting the full clock
    const remainingSec = (data.remainingSec > 0 && data.remainingSec < _intervalSec)
      ? data.remainingSec
      : _intervalSec;

    _scheduleNext(remainingSec * 1000);

    if (event.source) {
      event.source.postMessage({
        type: 'NOTIF_SCHEDULED',
        remainingSec,
        intervalSec: _intervalSec
      });
    }
  }

  if (data.type === 'CANCEL_NOTIF') {
    _cancelSchedule();
  }

  if (data.type === 'FIRE_NOW') {
    _fireNotification();
  }
});
