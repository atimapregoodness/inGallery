if (!self.define) {
  let e,
    t = {};
  const n = (n, o) => (
    (n = new URL(n + ".js", o).href),
    t[n] ||
      new Promise((t) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = t), document.head.appendChild(e);
        } else (e = n), importScripts(n), t();
      }).then(() => {
        let e = t[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (o, i) => {
    const s =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (t[s]) return;
    let r = {};
    const c = (e) => n(e, s),
      l = { module: { uri: s }, exports: r, require: c };
    t[s] = Promise.all(o.map((e) => l[e] || c(e))).then((e) => (i(...e), r));
  };
}
define(["./workbox-7e5b8a06"], function (e) {
  "use strict";
  self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [{ url: "bundle.js", revision: "9cd6e5e6c917d66ce0a6435f5652a518" }],
      {}
    ),
    e.registerRoute(/\.(?:png|jpg|jpeg|svg|gif)$/, new e.CacheFirst(), "GET"),
    e.registerRoute(/https:\/\/api.example.com/, new e.NetworkFirst(), "GET");
});
