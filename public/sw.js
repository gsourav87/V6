/* Sothik Bangla Calendar — service worker
 * Strategy:
 *  - Navigations (HTML): network-first so the daily calendar/panchang is always fresh,
 *    falling back to the cached app shell / offline page when offline.
 *  - Hashed build assets + fonts/icons: cache-first (they're content-hashed / immutable).
 *  - /api/* : always network (never cached).
 */
const VERSION = "v2";
const APP_CACHE = `sbc-app-${VERSION}`;
const RUNTIME_CACHE = `sbc-runtime-${VERSION}`;
const CORE = ["/", "/offline.html", "/manifest.webmanifest", "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== APP_CACHE && k !== RUNTIME_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Allow the page to tell a waiting SW to activate immediately.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;        // let cross-origin (APIs, fonts CDN) pass through
  if (url.pathname.startsWith("/api/")) return;           // never cache API

  // HTML navigations → network-first
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put("/", copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/") ).then((r) => r || caches.match("/offline.html")))
    );
    return;
  }

  // Static assets → cache-first, then populate runtime cache
  if (/\.(?:js|css|woff2?|ttf|png|jpe?g|svg|webp|ico|json)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy)).catch(() => {});
          return res;
        }).catch(() => cached)
      )
    );
  }
});
