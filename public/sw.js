// Minimal service worker: enables PWA install. Network-first, no aggressive caching
// so app/API updates always reach the user.
const VERSION = "aiai-sw-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Never cache API or cross-origin; just pass through.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
