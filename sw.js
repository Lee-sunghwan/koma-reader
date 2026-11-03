// 코마 리더 오프라인 캐시: 앱 파일만 저장합니다 (만화와 단어장은 IndexedDB 에 따로 있음)
const V = "koma-reader-v9";
const FILES = ["./", "index.html", "manifest.webmanifest", "vendor/jszip.min.js", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // 인터넷이 되면 최신 앱을 받아 캐시를 갱신하고, 안 되면 저장된 앱을 씀
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match("index.html"))));
});
