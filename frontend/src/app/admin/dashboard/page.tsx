'use client';

import { LogOut, FileText, Users, BarChart3, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';

export default function AdminMenu() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('plaintes');

  const handleLogout = () => {
    router.push('/admin-login');
  };

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  return (
    <div className="admin-dashboard">
      <style jsx>{`
        .admin-dashboard {
          font-family: Arial, sans-serif;
        }

        .admin-top-menu {
          background: #667eea;
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-container {
          display: flex;
          align-items: center;
        }

        .site-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0;
        }

        nav ul {
          display: flex;
          list-style: none;
          gap: 15px;
          margin: 0;
          padding: 0;
        }

        nav ul li {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 12px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        nav ul li:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        nav ul li.active {
          background: white;
          color: #5563d6;
          font-weight: bold;
        }

        .logout-btn {
          background: #f56565;
          border: none;
          padding: 8px 16px;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .logout-btn:hover {
          background: #e53e3e;
        }

        .admin-content {
          padding: 40px 30px;
          text-align: center;
        }

        .admin-content h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 15px;
        }

        .admin-content p {
          font-size: 1.1rem;
          color: #555;
        }
      `}</style>

      <div className="admin-top-menu">
        {/* Logo et titre */}
        <div className="header-left">
          <div className="logo-container">
            <Image src="/logo.jfif" alt="SecuriCité Logo" width={50} height={50} />
          </div>
          <h1 className="site-title">SecuriCité</h1>
        </div>

        <nav>
          <ul>
            <li
              className={activeTab === 'plaintes' ? 'active' : ''}
              onClick={() => handleNavigation('plaintes', '/admin/plaintes')}
            >
              <FileText size={18} /> Plaintes
            </li>
            <li
              className={activeTab === 'utilisateurs' ? 'active' : ''}
              onClick={() => handleNavigation('utilisateurs', '/admin/utilisateurs')}
            >
              <Users size={18} /> Utilisateurs
            </li>
            <li
              className={activeTab === 'rapports' ? 'active' : ''}
              onClick={() => handleNavigation('rapports', '/admin/rapports')}
            >
              <BarChart3 size={18} /> Rapports
            </li>
            <li
              className={activeTab === 'communication' ? 'active' : ''}
              onClick={() => handleNavigation('communication', '/admin/communication')}
            >
              <MessageSquare size={18} /> Communication
            </li>
          </ul>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {/* Contenu principal */}
      <div className="admin-content">
        <h2>Bienvenue sur votre tableau de bord Admin</h2>
        <p>Gérez les plaintes, utilisateurs, rapports et communications depuis ici.</p>
      </div>
    </div>
  );
}
