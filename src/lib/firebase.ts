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
    if (!messaging) return null;
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // You'll need to generate this in Firebase Console
      });
      console.log('FCM registration token:', token);
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
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