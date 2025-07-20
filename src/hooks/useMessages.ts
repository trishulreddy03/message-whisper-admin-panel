import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNotifications } from './useNotifications';

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
  timestamp: any;
  status: 'read' | 'unread';
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const messagesRef = collection(db, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages: Message[] = [];
        const changes = snapshot.docChanges();
        
        snapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() } as Message);
        });

        // Check for new messages
        changes.forEach((change) => {
          if (change.type === 'added' && messages.length > 0) {
            const newMessage = { id: change.doc.id, ...change.doc.data() } as Message;
            if (newMessage.status === 'unread') {
              addNotification({
                title: 'New Message Received',
                body: `From ${newMessage.name}: ${newMessage.subject}`,
                read: false,
                type: 'message'
              });
            }
          }
        });

        setMessages(newMessages);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [messages.length, addNotification]);

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status: 'read'
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  };

  const getStats = () => {
    const total = messages.length;
    const unread = messages.filter(m => m.status === 'unread').length;
    const read = messages.filter(m => m.status === 'read').length;
    
    const thisWeek = messages.filter(m => {
      if (!m.timestamp) return false;
      const messageDate = m.timestamp.toDate ? m.timestamp.toDate() : new Date(m.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return messageDate > weekAgo;
    }).length;

    return { total, unread, read, thisWeek };
  };

  return {
    messages,
    loading,
    error,
    markAsRead,
    deleteMessage,
    stats: getStats()
  };
};