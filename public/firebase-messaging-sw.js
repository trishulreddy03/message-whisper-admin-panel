// Firebase messaging service worker for enhanced FCM support
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBeRvVqePNkR1JCX8U5HrHFFMN_X0s2A08",
  authDomain: "my-portfolio-fb767.firebaseapp.com",
  projectId: "my-portfolio-fb767",
  storageBucket: "my-portfolio-fb767.firebasestorage.app",
  messagingSenderId: "82946204008",
  appId: "1:82946204008:web:7f69ab6209816b013d36dd"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Message Manager';
  const notificationOptions = {
    body: payload.notification?.body || 'New message received',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    data: {
      ...payload.data,
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'View',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ],
    tag: 'message-notification',
    requireInteraction: false,
    silent: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});