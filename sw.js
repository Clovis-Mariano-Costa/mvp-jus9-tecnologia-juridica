const JUS9_MVP_CACHE = 'jus9-mvp-pwa-v5';
const JUS9_MVP_ASSETS = [
  '/',
  '/app.html',
  '/index.html',
  '/selecionar-perfil.html',
  '/app-painel.html',
  '/app-perfis.html',
  '/app-agenda.html',
  '/agenda.html',
  '/daj-express.html',
  '/perfis/autor-editor.html',
  '/perfis/advogado-defensor.html',
  '/perfil-autor-editor.html',
  '/ia-estudantes.html',
  '/ia-profissional.html',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/css/visual-mvp-fase1.css',
  '/assets/css/visual-mvp-fase2.css',
  '/assets/js/mvp.js',
  '/assets/js/daj-express.js',
  '/assets/js/autor-editor-mvp.js',
  '/assets/img/favicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(JUS9_MVP_CACHE).then((cache) => cache.addAll(JUS9_MVP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== JUS9_MVP_CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok && new URL(event.request.url).origin === self.location.origin) {
            caches.open(JUS9_MVP_CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match('/offline.html'));
    })
  );
});
