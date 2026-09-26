
const CACHE = 'infiniti-shell-540760d26e50237a';
const ASSETS = ["assets/duckdb-browser-eh.worker.js","assets/duckdb-eh.wasm","build/index.esm.js","build/infiniti-dictionary.esm.js","build/infiniti-dictionary.js","build/p-CklX5qcf.js","build/p-DQuL1Twl.js","build/p-a2f98dc1.entry.js","index.html"];
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
  if (url.href === 'https://extensions.duckdb.org/v1.5.4/wasm_eh/parquet.duckdb_extension.wasm') {
    event.respondWith((async () => {
      const cache = await caches.open('infiniti-dictionary-extension-v1');
      return await cache.match(url.href) || fetch(request);
    })());
    return;
  }
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const relative = url.pathname.slice(scope.pathname.length);
  if (!ASSETS.includes(relative) && relative !== '') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return await cache.match(relative || 'index.html') || fetch(request);
  })());
});
