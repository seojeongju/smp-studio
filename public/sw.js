/* 그레이스샵 경량 PWA — HTML/API는 네트워크 우선, 해시 정적 자산만 캐시 */
const CACHE_VERSION = 'grace-pwa-v1';
const PRECACHE = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

function isHashedAsset(url) {
  return url.pathname.startsWith('/assets/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (isApiRequest(url)) return;

  // 문서(HTML): 항상 네트워크 우선 — 배포 후 옛 화면 잔류 방지
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Vite 해시 번들: 캐시 우선
  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 그 외 동일 출처 GET: 네트워크 우선, 실패 시에만 캐시
  event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await cache.match('/');
      if (shell) return shell;
    }
    throw new Error('offline');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh.ok) {
    cache.put(request, fresh.clone());
  }
  return fresh;
}
