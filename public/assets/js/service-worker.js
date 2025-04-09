const CACHE_NAME = "my-cache-v1";
const FILES_TO_CACHE = [
  "/home",
  "/manifest.json",
  "/assets/css/app.css",
  "/assets/js/app.js",
  "/assets/images/inGallery_logo_black.png", // add your logo if it’s used in manifest or layout
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install event triggered");
  console.log("[Service Worker] Caching files:", FILES_TO_CACHE);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Opened cache:", CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // activate worker immediately
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activate event triggered");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log("[Service Worker] Existing caches:", cacheNames);
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[Service Worker] Deleting old cache:", name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Fetch event triggered for:", event.request.url);
  if (event.request.method !== "GET") {
    console.log(
      "[Service Worker] Non-GET request ignored:",
      event.request.method
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[Service Worker] Serving from cache:", event.request.url);
      } else {
        console.log(
          "[Service Worker] Fetching from network:",
          event.request.url
        );
      }
      return (
        cachedResponse ||
        fetch(event.request).catch((error) => {
          console.error("[Service Worker] Fetch failed:", error);
          // Optional fallback, e.g., return offline.html if needed
        })
      );
    })
  );
});
