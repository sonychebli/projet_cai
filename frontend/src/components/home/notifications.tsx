'use client';
import React, { useEffect, useState } from 'react';
import '@/styles/notifications.css';
import { useUserContext } from '@/context/UserContext';
import { notificationService } from '@/services/api';

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
  type?: string;
  reportId?: number;
}

export default function NotificationsComponent() {
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Conversion explicite en number
        const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
        const data = await notificationService.getUserNotifications(userId);
        setNotifications(data);
      } catch (err) {
        console.error('Erreur lors du chargement des notifications:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Erreur lors du marquage comme lu:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      // ✅ Conversion explicite en number
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      await notificationService.markAllAsRead(userId);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications:', err);
    }
  };

  if (loading) {
    return (
      <div className="notifications-section">
        <div className="loading-spinner">
          <p>Chargement de vos notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-section">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-section">
      <div className="notifications-header">
        <h1>Mes notifications</h1>
        {unreadCount > 0 && (
          <div className="notifications-actions">
            <span className="unread-badge">{unreadCount} non lue(s)</span>
            <button onClick={handleMarkAllAsRead} className="mark-all-read-btn">
              Tout marquer comme lu
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>🔔 Aucune notification pour le moment.</p>
          <p>Vous serez notifié des mises à jour de vos signalements.</p>
        </div>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`notification-item ${notif.read ? 'read' : 'unread'}`}
              onClick={() => !notif.read && handleMarkAsRead(notif.id)}
            >
              <div className="notification-content">
                <div className="notification-message">{notif.message}</div>
                <div className="notification-date">
                  {new Date(notif.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              {!notif.read && <span className="unread-indicator">●</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}