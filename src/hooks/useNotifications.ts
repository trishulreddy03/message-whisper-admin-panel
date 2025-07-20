import { useState, useEffect } from 'react';
import { 
  requestNotificationPermission, 
  setupForegroundMessageListener,
  subscribeToTopic,
  getStoredFCMToken 
} from '@/lib/firebase';

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  type: 'message' | 'system';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check current permission status
    setPermission(Notification.permission);

    // Initialize notifications
    initializeNotifications();

    // Setup foreground message listener
    const unsubscribe = setupForegroundMessageListener((payload) => {
      const notification: Notification = {
        id: Date.now().toString(),
        title: payload.notification?.title || 'New Message',
        body: payload.notification?.body || 'You have a new message',
        timestamp: new Date(),
        read: false,
        type: 'message'
      };

      setNotifications(prev => [notification, ...prev]);
      
      // Show browser notification with enhanced options
      if (Notification.permission === 'granted') {
        const browserNotification = new Notification(notification.title, {
          body: notification.body,
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
          tag: 'message-notification',
          requireInteraction: true,
          silent: false,
          data: {
            url: '/',
            notificationId: notification.id
          }
        });

        // Handle notification click
        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
        };

        // Auto-close after 10 seconds
        setTimeout(() => {
          browserNotification.close();
        }, 10000);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const requestPermission = async () => {
    const token = await requestNotificationPermission();
    setPermission(Notification.permission);
    
    if (token) {
      // Subscribe to message topic for real-time notifications
      await subscribeToTopic('messages');
      console.log('Subscribed to message notifications');
    }
    
    return token;
  };

  const initializeNotifications = async () => {
    // Check if user already has a token
    const existingToken = getStoredFCMToken();
    if (existingToken && Notification.permission === 'granted') {
      await subscribeToTopic('messages');
      console.log('Using existing FCM token for notifications');
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    permission,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    addNotification,
    initializeNotifications
  };
};