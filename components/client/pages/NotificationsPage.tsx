'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Package, Tag, AlertCircle, CheckCircle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getFirebaseDb, Collections } from '@/lib/firebase/config';
import { getFirebaseAuth } from '@/lib/firebase/config';
import { collection, query, where, orderBy, getDocs, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';

interface NotificationsPageProps {
  onNavigate: (page: string) => void;
}

interface Notification {
  id: string;
  type: 'order' | 'deal' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionPage?: string;
}

export default function NotificationsPage({ onNavigate }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (!user) { setLoading(false); return; }

      const db = getFirebaseDb();
      let snap;
      try {
        const q = query(
          collection(db, Collections.NOTIFICATIONS),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        snap = await getDocs(q);
      } catch {
        const q = query(collection(db, Collections.NOTIFICATIONS), where('userId', '==', user.uid));
        snap = await getDocs(q);
      }

      const data: Notification[] = [];
      snap.forEach((d) => {
        const n = d.data();
        const createdAt = n.createdAt?.toDate?.() || new Date();
        const diffMs = Date.now() - createdAt.getTime();
        const diffH = Math.floor(diffMs / 3600000);
        const diffD = Math.floor(diffMs / 86400000);
        const time = diffH < 1 ? 'À l\'instant' : diffH < 24 ? `Il y a ${diffH}h` : diffD === 1 ? 'Hier' : `Il y a ${diffD} jours`;
        data.push({
          id: d.id,
          type: n.type || 'info',
          title: n.title || '',
          message: n.message || '',
          time,
          read: n.read || false,
          actionLabel: n.actionLabel,
          actionPage: n.actionPage,
        });
      });
      setNotifications(data);
    } catch (e) {
      console.error('Erreur chargement notifications:', e);
    }
    setLoading(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package size={20} className="text-blue-500" />;
      case 'deal': return <Tag size={20} className="text-orange" />;
      case 'success': return <CheckCircle size={20} className="text-green" />;
      case 'warning': return <AlertCircle size={20} className="text-yellow-500" />;
      default: return <Bell size={20} className="text-gray-medium" />;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const db = getFirebaseDb();
      await updateDoc(doc(db, Collections.NOTIFICATIONS, id), { read: true });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      const db = getFirebaseDb();
      const batch = writeBatch(db);
      notifications.filter(n => !n.read).forEach(n => {
        batch.update(doc(db, Collections.NOTIFICATIONS, n.id), { read: true });
      });
      await batch.commit();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const deleteNotification = async (id: string) => {
    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, Collections.NOTIFICATIONS, id));
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <header className="header">
        <button 
          onClick={() => onNavigate('dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          ← Retour
        </button>
        <div className="header-logo">🔔 Notifications</div>
        <div></div>
      </header>

      <div style={{ padding: 'var(--spacing-lg)' }}>
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-md)'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
              Notifications
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)' }}>
              {loading ? 'Chargement...' : `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #333',
                borderRadius: '8px',
                color: 'var(--color-orange)',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Filtres */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === 'all' ? 'var(--color-orange)' : '#222',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            style={{
              padding: '8px 16px',
              backgroundColor: filter === 'unread' ? 'var(--color-orange)' : '#222',
              border: '1px solid #333',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Non lues ({unreadCount})
          </button>
        </div>

        {/* Liste des notifications */}
        {filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
            <h3 style={{ marginBottom: '8px' }}>Aucune notification</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Vous êtes à jour!
            </p>
            <Button onClick={() => onNavigate('dashboard')} variant="primary">
              Retour aux deals
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !notification.read && markAsRead(notification.id)}
                style={{
                  backgroundColor: notification.read ? '#1a1a1a' : '#222',
                  borderRadius: '12px',
                  padding: 'var(--spacing-md)',
                  border: `1px solid ${notification.read ? '#333' : 'var(--color-orange)'}`,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-gray-medium)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={16} />
                </button>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#2a2a2a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getIcon(notification.type)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600 }}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-orange)'
                        }} />
                      )}
                    </div>

                    <p style={{
                      fontSize: '14px',
                      color: 'var(--color-gray-medium)',
                      marginBottom: '8px',
                      lineHeight: '1.5'
                    }}>
                      {notification.message}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--color-gray-dark)'
                      }}>
                        {notification.time}
                      </span>

                      {notification.actionLabel && notification.actionPage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(notification.actionPage!);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: 'var(--color-orange)',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          {notification.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: '80px' }}></div>
    </div>
  );
}
