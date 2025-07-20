import { useState, useEffect } from 'react';
import { requestNotificationPermission, setupForegroundMessageListener } from '@/lib/firebase';

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
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
          tag: 'message-notification',
          requireInteraction: true
        });
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
    return token;
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
    addNotification
  };
};