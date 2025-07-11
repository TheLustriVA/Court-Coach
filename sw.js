// Service Worker for Court Coach PWA

const CACHE_NAME = 'court-coach-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline functionality
const CACHE_FILES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/themes.css',
    '/css/responsive.css',
    '/js/app.js',
    '/js/court.js',
    '/js/players.js',
    '/js/tools.js',
    '/js/storage.js',
    '/manifest.json',
    'https://unpkg.com/konva@9/konva.min.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Otherwise fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache non-successful responses
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Cache successful responses
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        
                        return networkResponse;
                    })
                    .catch(() => {
                        // Network failed, try to serve offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // For other requests, return a generic offline response
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// Background sync for saving data when back online
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle background sync tasks
            handleBackgroundSync()
        );
    }
});

async function handleBackgroundSync() {
    console.log('Service Worker: Background sync triggered');
    
    // Notify the app that we're back online
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
        client.postMessage({
            type: 'BACK_ONLINE'
        });
    });
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/images/icons/icon-192x192.png',
            badge: '/images/icons/icon-96x96.png',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/'
            },
            actions: [
                {
                    action: 'open',
                    title: 'Open Court Coach'
                },
                {
                    action: 'close',
                    title: 'Close'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            type: 'VERSION',
            version: CACHE_NAME
        });
    }
});

// Periodic background sync (for browsers that support it)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'content-sync') {
        event.waitUntil(
            // Handle periodic sync tasks
            handlePeriodicSync()
        );
    }
});

async function handlePeriodicSync() {
    console.log('Service Worker: Periodic sync triggered');
    
    // Check for app updates
    try {
        const response = await fetch('/manifest.json');
        const manifest = await response.json();
        
        // Compare versions and notify if update available
        if (manifest.version !== CACHE_NAME.split('-v')[1]) {
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'UPDATE_AVAILABLE',
                    version: manifest.version
                });
            });
        }
    } catch (error) {
        console.error('Service Worker: Failed to check for updates', error);
    }
}

// Handle app installation
self.addEventListener('appinstalled', (event) => {
    console.log('Service Worker: App installed');
    
    // Track installation
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'APP_INSTALLED'
            });
        });
    });
});

// Handle beforeinstallprompt
self.addEventListener('beforeinstallprompt', (event) => {
    console.log('Service Worker: Before install prompt');
    
    // Relay to main app
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'BEFORE_INSTALL_PROMPT'
            });
        });
    });
});

// Network status change handler
self.addEventListener('online', () => {
    console.log('Service Worker: Back online');
    
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'ONLINE'
            });
        });
    });
});

self.addEventListener('offline', () => {
    console.log('Service Worker: Gone offline');
    
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'OFFLINE'
            });
        });
    });
});

// Cache management utilities
function cleanupCaches() {
    return caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                }
            })
        );
    });
}

function getCacheSize() {
    return caches.open(CACHE_NAME).then(cache => {
        return cache.keys().then(keys => {
            return keys.length;
        });
    });
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker: Error', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
});

console.log('Service Worker: Loaded');
