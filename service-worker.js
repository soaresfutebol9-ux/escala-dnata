// Sempre que você alterar arquivos do app, mude este número de versão.
// Isso força os aparelhos das pessoas a baixarem a versão nova em vez
// de continuarem usando a versão antiga guardada em cache.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `escala-patio-${CACHE_VERSION}`;

// Arquivos do "esqueleto" do app — funcionam mesmo sem internet.
// Os dados da escala em si (Firestore) sempre exigem conexão.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith('escala-patio-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Só cuidamos de requisições GET para o próprio site.
  // Firestore, Firebase e Google Fonts seguem direto pela rede.
  if(event.request.method !== 'GET' || url.origin !== self.location.origin){
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if(response && response.ok){
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
