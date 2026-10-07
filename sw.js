/* PPHS offline service worker */
var VER = "pphs-v1";
var CORE = ["./", "./index.html", "./manifest.json", "./favicon.ico",
  "./icons/icon-16.png", "./icons/icon-32.png", "./icons/icon-180.png", "./icons/icon-192.png"];
var CDN = [
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VER).then(function (c) {
    var jobs = CORE.map(function (u) { return c.add(u).catch(function () {}); });
    CDN.forEach(function (u) {
      jobs.push(fetch(new Request(u, { mode: "no-cors" })).then(function (r) { return c.put(u, r); }).catch(function () {}));
    });
    return Promise.all(jobs);
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VER; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function timeout(ms) { return new Promise(function (_, rej) { setTimeout(rej, ms); }); }

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var fontHost = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  var cdnHost = url.hostname === "cdnjs.cloudflare.com";
  if (!sameOrigin && !fontHost && !cdnHost) return;   // Sheets, Google login etc. go straight to network

  // Page: network first (fresh updates), fall back to cache fast on weak/no net
  if (req.mode === "navigate") {
    e.respondWith(
      Promise.race([fetch(req), timeout(4000)]).then(function (res) {
        var copy = res.clone();
        caches.open(VER).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (r) { return r || caches.match("./"); });
      })
    );
    return;
  }

  // Everything else: cache first, refresh in background
  e.respondWith(
    caches.match(req, { ignoreSearch: sameOrigin }).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === "opaque")) {
          var copy = res.clone();
          caches.open(VER).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
