// Собрано scripts/build-sw.mjs — не редактировать руками
const VERSION = "d1a26a47cb4d";
const BASE = "/life";
const FILES = ["/life/404.html","/life/404/index.html","/life/_next/static/HscqGY7S3CdN64OvOxE7s/_buildManifest.js","/life/_next/static/HscqGY7S3CdN64OvOxE7s/_ssgManifest.js","/life/_next/static/chunks/139.8d54880d25bc452f.js","/life/_next/static/chunks/2-5c76f5a30e530fb1.js","/life/_next/static/chunks/240-e740775740060db4.js","/life/_next/static/chunks/255-56dfc1af63c957ee.js","/life/_next/static/chunks/361.595d0b75123adf6f.js","/life/_next/static/chunks/4bd1b696-409494caf8c83275.js","/life/_next/static/chunks/509-af9ff9f7be912934.js","/life/_next/static/chunks/521-fd13c2dd99b026c4.js","/life/_next/static/chunks/619-f072ac750404f9da.js","/life/_next/static/chunks/646.c2c67a3e35c59670.js","/life/_next/static/chunks/745-ee2498c7370caaac.js","/life/_next/static/chunks/769-4d8113b980ce4787.js","/life/_next/static/chunks/856-1ed9a1981e791a62.js","/life/_next/static/chunks/app/_not-found/page-3944b05b1b7db5d3.js","/life/_next/static/chunks/app/analysis/page-93fb2aa1806ab457.js","/life/_next/static/chunks/app/books/page-f3b8f9cbe6638d8e.js","/life/_next/static/chunks/app/dashboard/page-792f4d53b2d453d6.js","/life/_next/static/chunks/app/decisions/page-3b42fc792e510b9e.js","/life/_next/static/chunks/app/goals/page-3abeee03057a96ae.js","/life/_next/static/chunks/app/journal/page-fe4f802af5d43497.js","/life/_next/static/chunks/app/layout-ea6e21ebf688e489.js","/life/_next/static/chunks/app/manifest.webmanifest/route-fff4d0a48c856f4f.js","/life/_next/static/chunks/app/page-ef124aab708049e9.js","/life/_next/static/chunks/app/people/page-5fe460f195258489.js","/life/_next/static/chunks/app/retro/page-a6788aa450775c0f.js","/life/_next/static/chunks/app/settings/page-9c1ed642b6520c49.js","/life/_next/static/chunks/app/week/page-6241c1a483368a99.js","/life/_next/static/chunks/d0f5a89a.af7b72e16913fa3e.js","/life/_next/static/chunks/framework-f52ebcb9f26a1e11.js","/life/_next/static/chunks/main-app-3583f70a6ae0ba9e.js","/life/_next/static/chunks/main-fc86210ab163aca1.js","/life/_next/static/chunks/pages/_app-0d6ce27712411be2.js","/life/_next/static/chunks/pages/_error-a8479a8c7bc399cf.js","/life/_next/static/chunks/polyfills-42372ed130431b0a.js","/life/_next/static/chunks/webpack-d594679b6bd6a6a9.js","/life/_next/static/css/7414893b52a5da07.css","/life/analysis/index.html","/life/analysis/index.txt","/life/books/index.html","/life/books/index.txt","/life/dashboard/index.html","/life/dashboard/index.txt","/life/decisions/index.html","/life/decisions/index.txt","/life/goals/index.html","/life/goals/index.txt","/life/icons/life-180.png","/life/icons/life-192.png","/life/icons/life-32.png","/life/icons/life-512.png","/life/icons/life-maskable-512.png","/life/icons/life.svg","/life/index.html","/life/index.txt","/life/journal/index.html","/life/journal/index.txt","/life/manifest.webmanifest","/life/people/index.html","/life/people/index.txt","/life/retro/index.html","/life/retro/index.txt","/life/settings/index.html","/life/settings/index.txt","/life/sql-wasm-browser.wasm","/life/week/index.html","/life/week/index.txt"];
const CACHE = "life-" + VERSION;

self.addEventListener("install", (event) => {
  // cache: "reload" — мимо HTTP-кэша, иначе в новую версию попадут старые страницы
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES.map((url) => new Request(url, { cache: "reload" }))))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith("life-") && key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

// новая версия ждёт, пока пользователь не нажмёт «обновить»
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE + "/")) return;
  event.respondWith(respond(req, url));
});

async function respond(req, url) {
  const cache = await caches.open(CACHE);
  let path = url.pathname;
  // /life/week или /life/week/ → /life/week/index.html
  if (req.mode === "navigate" && !/\.[a-z0-9]+$/i.test(path)) {
    path = path.replace(/\/?$/, "/") + "index.html";
  }
  // ?_rsc=… у данных страниц Next.js на содержимое не влияет
  const hit = await cache.match(path, { ignoreSearch: true });
  if (hit) return hit;
  try {
    return await fetch(req);
  } catch (e) {
    if (req.mode === "navigate") {
      const home = await cache.match(BASE + "/index.html");
      if (home) return home;
    }
    throw e;
  }
}
