import { matchPrecache, precache } from "workbox-precaching";

// Workbox handles revisions, atomic installation, and obsolete entry cleanup.
// Do not add its global precache route: admin/viewer pages share /build assets
// and must not receive cached broadcaster resources.
// oxlint-disable-next-line no-underscore-dangle -- Workbox injection point is required.
precache(self.__WB_MANIFEST);

// Claim the first installed worker immediately so a primed page can reload offline.
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

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
        // Chromium can omit clientId while loading a newly navigated offline page.
        // Prefer the referrer when present; if neither is available, serve the
        // already-precached file rather than making an impossible network request.
        const pageUrl =
          client?.url ||
          (request.referrer.startsWith(self.location.origin) ? request.referrer : "");
        if (pageUrl && !/^\/broadcasts\/[^/]+\/broadcaster$/.test(new URL(pageUrl).pathname))
          return fetch(request);
        return (await matchPrecache(url.pathname)) || fetch(request);
      })(),
    );
  }
});
