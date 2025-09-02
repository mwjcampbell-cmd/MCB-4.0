self.addEventListener("install", e => {
  console.log("Service Worker installed");
  e.waitUntil(
    caches.open("mcb-cache").then(cache => cache.addAll(["/", "/index.html", "/style.css", "/main.js"]))
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
