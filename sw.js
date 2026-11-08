// Service worker (gerado no build a partir deste modelo). Guarda o jogo no aparelho para jogar sem internet.
const CACHE = 'hardly-studying-mw8h8xlq';
const ARQUIVOS = ["./","./assets/index--HYFd4BF.js","./icones/icone-192.png","./icones/icone-512.png","./icones/icone-mascaravel-512.png","./index.html","./manifest.webmanifest"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // página: tenta a rede (para pegar versão nova), cai no cache sem internet
    e.respondWith(fetch(req).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});
