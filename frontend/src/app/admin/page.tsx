'use client';

import React, { useState } from 'react';
import { LogOut, Users, FileText, BarChart3, MessageSquare, UserCheck, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/admin-utilisateurs.module.css'; // CSS module

export default function AdminUtilisateursPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('utilisateurs');

  const handleLogout = () => router.push('/admin-login');

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  // Exemple de données utilisateurs
  const utilisateurs = [
    { id: 1, nom: 'Alice Dupont', email: 'alice@example.com', role: 'Utilisateur', statut: 'Actif' },
    { id: 2, nom: 'Bob Martin', email: 'bob@example.com', role: 'Modérateur', statut: 'Suspendu' },
    { id: 3, nom: 'Charlie Rose', email: 'charlie@example.com', role: 'Utilisateur', statut: 'Actif' },
  ];

  return (
    <div className={styles.adminDashboard}>
      {/* Menu Top */}
      <div className={styles.adminTopMenu}>
        <div className={styles.logo}>SecuriCité </div>
        <nav>
          <ul>
            <li className={activeTab === 'plaintes' ? styles.active : ''} onClick={() => handleNavigation('plaintes', '/admin/plaintes')}>
              <FileText size={18} /> Plaintes
            </li>
            <li className={activeTab === 'utilisateurs' ? styles.active : ''} onClick={() => handleNavigation('utilisateurs', '/admin/utilisateurs')}>
              <Users size={18} /> Utilisateurs
            </li>
            <li className={activeTab === 'rapports' ? styles.active : ''} onClick={() => handleNavigation('rapports', '/admin/rapports')}>
              <BarChart3 size={18} /> Rapports
            </li>
            <li className={activeTab === 'communication' ? styles.active : ''} onClick={() => handleNavigation('communication', '/admin/communication')}>
              <MessageSquare size={18} /> Communication
            </li>
          </ul>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {/* Contenu principal */}
      <div className={styles.dashboardContent}>
        <div className={styles.contentWrapper}>
          <h2>Gestion des utilisateurs</h2>
          <p className={styles.subtitle}>
            Surveiller les comptes utilisateurs, modérer les signalements et gérer la confidentialité des données.
          </p>

          <div className={styles.dataTableContainer}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map(user => (
                  <tr key={user.id}>
                    <td>{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.statut}</td>
                    <td>
                      <button className={styles.btnAction}><UserCheck size={16} /> Activer</button>
                      <button className={styles.btnAction}><UserX size={16} /> Suspendre</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
