// ========================================
// Service Worker - Offline Caching
// ========================================

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `lead-database-${CACHE_VERSION}`;

// Files to cache on install
const STATIC_CACHE_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

// API endpoints that should use network-first strategy
const API_ENDPOINTS = [
  '/api/submit',
  '/api/records',
  '/api/record',
  '/api/health'
];

// ========================================
// Install Event
// ========================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_CACHE_FILES);
      })
      .then(() => {
        console.log('[SW] Service worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// ========================================
// Activate Event
// ========================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// ========================================
// Fetch Event
// ========================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests: Network-first strategy
  if (isAPIRequest(url.pathname)) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static files: Cache-first strategy
  event.respondWith(cacheFirstStrategy(request));
});

// ========================================
// Caching Strategies
// ========================================

/**
 * Cache-first strategy
 * Try cache first, fall back to network
 * Good for static assets
 */
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first strategy failed:', error);

    // Return offline page or error response
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

/**
 * Network-first strategy
 * Try network first, fall back to cache
 * Good for API requests
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful GET requests
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);

    // Try to get from cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return error response
    return new Response(JSON.stringify({
      success: false,
      error: 'Network unavailable',
      offline: true
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}

// ========================================
// Helper Functions
// ========================================

/**
 * Check if request is for an API endpoint
 */
function isAPIRequest(pathname) {
  return API_ENDPOINTS.some(endpoint => pathname.startsWith(endpoint));
}

// ========================================
// Background Sync (Future Enhancement)
// ========================================

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-submissions') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(syncSubmissions());
  }
});

async function syncSubmissions() {
  // This would integrate with the app's pending submissions
  console.log('[SW] Syncing pending submissions...');
}

// ========================================
// Push Notifications (Future Enhancement)
// ========================================

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification('Lead Database', options)
  );
});

// ========================================
// Message Handler
// ========================================

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      })
    );
  }
});

console.log('[SW] Service worker loaded');
