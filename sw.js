
const CACHE = 'infiniti-shell-169d5c2f4f959bd7';
const ASSETS = ["assets/duckdb-browser-eh.worker.js","assets/duckdb-eh.wasm","build/index.esm.js","build/infiniti-dictionary.esm.js","build/infiniti-dictionary.js","build/p-CklX5qcf.js","build/p-DQuL1Twl.js","build/p-dda0648a.entry.js","index.html"];
self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil((async () => {
  for (const key of await caches.keys()) if (key.startsWith('infiniti-shell-') && key !== CACHE) await caches.delete(key);
  await self.clients.claim();
})()));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const relative = url.pathname.slice(scope.pathname.length);
  if (!ASSETS.includes(relative) && relative !== '') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return await cache.match(relative || 'index.html') || fetch(request);
  })());
});
