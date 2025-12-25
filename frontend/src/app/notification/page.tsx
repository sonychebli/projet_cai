'use client';

import React from 'react';
import '@/styles/notifications.css';

export default function NotificationsPage() {
  // Exemple de notifications
  const notifications = [
    'Votre signalement n°1 a été pris en charge.',
    'Un nouveau commentaire sur votre signalement n°2.',
    'Statut mis à jour pour le signalement n°3.'
  ];

  return (
    <div className="notifications-page">
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notif, idx) => (
          <li key={idx}>{notif}</li>
        ))}
      </ul>
    </div>
  );
}
