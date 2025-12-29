'use client';
import React from 'react';
import '@/styles/notifications.css';
import { useUserContext } from '@/context/UserContext';

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

export default function NotificationsComponent() {
  const { user } = useUserContext();

  // Exemple de notifications (plus tard tu peux remplacer par un fetch)
  const notifications: Notification[] = [
    {
      id: 1,
      message: 'Votre signalement n°1 a été pris en charge.',
      date: '2025-12-20',
      read: false,
    },
    {
      id: 2,
      message: 'Un nouveau commentaire sur votre signalement n°2.',
      date: '2025-12-18',
      read: true,
    },
    {
      id: 3,
      message: 'Statut mis à jour pour le signalement n°3.',
      date: '2025-12-15',
      read: true,
    },
  ];

  return (
    <div className="notifications-section">
      <h1>Mes notifications</h1>

      {notifications.length === 0 ? (
        <p>Aucune notification.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`notification-item ${notif.read ? 'read' : 'unread'}`}
            >
              <div className="notification-message">{notif.message}</div>
              <div className="notification-date">{notif.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
