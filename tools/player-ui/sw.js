import { matchPrecache, precache } from "workbox-precaching";

// Workbox handles revisions, atomic installation, and obsolete entry cleanup.
// Do not add its global precache route: admin/viewer pages share /build assets
// and must not receive cached broadcaster resources.
precache(self.__WB_MANIFEST);

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") void self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate" && /^\/broadcasts\/[^/]+\/broadcaster$/.test(url.pathname)) {
    event.respondWith(matchPrecache("/operator-shell").then((cached) => cached || fetch(request)));
    return;
  }

  if (url.pathname.startsWith("/build/") || url.pathname === "/assets/early-play.js") {
    event.respondWith(
      (async () => {
        // The worker controls the root origin, but only the broadcaster may use
        // its cached assets. All API and media traffic remains network-only.
        const client = event.clientId ? await self.clients.get(event.clientId) : null;
        if (!client || !/^\/broadcasts\/[^/]+\/broadcaster$/.test(new URL(client.url).pathname))
          return fetch(request);
        return (await matchPrecache(url.pathname)) || fetch(request);
      })(),
    );
  }
});
