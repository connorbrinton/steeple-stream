/* Steeple Stream broadcaster application shell. Version and assets are injected by the server. */
const CACHE_PREFIX = "steeple-broadcaster-";
const CACHE_NAME = CACHE_PREFIX + "__ASSET_VERSION__";
const PRECACHE_ASSETS = __PRECACHE_ASSETS__;
const SHELL_URL = "/operator-shell";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Do not activate unless the entire required application shell is available.
      await Promise.all(
        PRECACHE_ASSETS.map(async (url) => {
          const response = await fetch(url, { cache: "reload", credentials: "same-origin" });
          if (
            !response.ok ||
            response.redirected ||
            new URL(response.url).origin !== self.location.origin
          ) {
            throw new Error(`Failed to precache ${url}: ${response.status}`);
          }
          await cache.put(url, response);
        }),
      );
      // No skipWaiting: an active broadcaster decides when a new version takes over.
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "ACTIVATE_UPDATE") void self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (
    request.mode === "navigate" &&
    url.pathname.startsWith("/broadcasts/") &&
    url.pathname.endsWith("/broadcaster")
  ) {
    event.respondWith(
      caches
        .open(CACHE_NAME)
        .then(async (cache) => (await cache.match(SHELL_URL)) || fetch(request)),
    );
    return;
  }

  // The API, video media, authentication, and dynamically imported player are network-only.
  if (url.pathname.startsWith("/build/") || url.pathname === "/assets/early-play.js") {
    event.respondWith(
      (async () => {
        // Scope is "/" to cover /build, but never serve old assets to admin/viewer pages.
        const client = event.clientId ? await self.clients.get(event.clientId) : null;
        const broadcaster =
          client &&
          new URL(client.url).pathname.startsWith("/broadcasts/") &&
          new URL(client.url).pathname.endsWith("/broadcaster");
        if (!broadcaster) return fetch(request);
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(url.pathname)) || fetch(request);
      })(),
    );
  }
});
