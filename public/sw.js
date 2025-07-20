const CACHE_NAME = 'message-manager-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-72x72.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Import Firebase messaging for service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyBeRvVqePNkR1JCX8U5HrHFFMN_X0s2A08",
  authDomain: "my-portfolio-fb767.firebaseapp.com",
  projectId: "my-portfolio-fb767",
  storageBucket: "my-portfolio-fb767.firebasestorage.app",
  messagingSenderId: "82946204008",
  appId: "1:82946204008:web:7f69ab6209816b013d36dd"
});

const messaging = firebase.messaging();

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Message Manager';
  const notificationOptions = {
    body: payload.notification?.body || 'New message received',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      ...payload.data,
      dateOfArrival: Date.now(),
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'View Message',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icon-72x72.png'
      }
    ],
    tag: 'message-notification',
    requireInteraction: true,
    silent: false
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Push event for notifications (fallback)
self.addEventListener('push', (event) => {
  if (event.data) {
    const payload = event.data.json();
    const options = {
      body: payload.notification?.body || 'New message received',
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        ...payload.data,
        dateOfArrival: Date.now(),
        url: '/'
      },
      actions: [
        {
          action: 'open',
          title: 'View Message',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Dismiss',
          icon: '/icon-72x72.png'
        }
      ],
      tag: 'message-notification',
      requireInteraction: true
    };

    event.waitUntil(
      self.registration.showNotification('Message Manager', options)
    );
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app when notification is clicked
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // If the app is already open, focus it
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // If the app is not open, open a new window
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  } else if (event.action === 'close') {
    // Just close the notification
    console.log('Notification dismissed');
  }
});

// Handle notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('Notification was closed', event.notification);
});