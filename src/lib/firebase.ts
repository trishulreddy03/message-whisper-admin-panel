import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBeRvVqePNkR1JCX8U5HrHFFMN_X0s2A08",
  authDomain: "my-portfolio-fb767.firebaseapp.com",
  projectId: "my-portfolio-fb767",
  storageBucket: "my-portfolio-fb767.firebasestorage.app",
  messagingSenderId: "82946204008",
  appId: "1:82946204008:web:7f69ab6209816b013d36dd",
  measurementId: "G-8TPFD6M35S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
let messaging: any = null;

if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.log('Firebase messaging not supported in this environment');
  }
}

// Request permission for notifications
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.warn('Firebase messaging not available');
      return null;
    }
    
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      try {
        // For now, we'll use a placeholder VAPID key
        // In production, replace with your actual VAPID key from Firebase Console
        const token = await getToken(messaging, {
          vapidKey: 'BKzOIYb0lKZJNxMitavGwZQnRPRNWyYNVK7Bjrof_mU2VPR7_xJfRskEVuDbTcoBqeszDlSbQpu3zMPt1AcdB60'
        });
        console.log('FCM registration token:', token);
        
        // Store token in localStorage for demo purposes
        if (token) {
          localStorage.setItem('fcm-token', token);
        }
        
        return token;
      } catch (tokenError) {
        console.error('Error getting FCM token:', tokenError);
        console.log('Note: You need to generate a VAPID key in Firebase Console > Project Settings > Cloud Messaging');
        return null;
      }
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Get stored FCM token
export const getStoredFCMToken = (): string | null => {
  return localStorage.getItem('fcm-token');
};

// Subscribe to topic (for real-time notifications)
export const subscribeToTopic = async (topic: string = 'messages') => {
  try {
    const token = getStoredFCMToken();
    if (!token) {
      console.warn('No FCM token available for topic subscription');
      return false;
    }
    
    // In a real application, you would send this token to your server
    // to subscribe to specific topics
    console.log(`Token ${token} ready for topic subscription: ${topic}`);
    return true;
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    return false;
  }
};

// Listen for foreground messages
export const setupForegroundMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) return () => {};
  
  return onMessage(messaging, (payload) => {
    console.log('Message received in foreground:', payload);
    callback(payload);
  });
};

export { messaging };
