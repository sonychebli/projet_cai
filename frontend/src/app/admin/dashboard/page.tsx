'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, FileText, Users, BarChart3, MessageSquare, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService, authService } from '@/services/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReports: 0,
    activeUsers: 0,
    pendingReports: 0,
    inProgressReports: 0,
    resolvedReports: 0,
    rejectedReports: 0,
    reportsByType: []
  });

  useEffect(() => {
    // Check if user is authenticated and is admin
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/admin-login');
      return;
    }

    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      
      if (response.success) {
        setStats(response.data);
      } else {
        console.error('Failed to fetch stats:', response.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/admin-login');
  };

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <style jsx>{`
        .admin-dashboard { font-family: Arial, sans-serif; }
        .admin-top-menu {
          background: #667eea;
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-left { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .logo-container { display: flex; align-items: center; }
        .site-title { font-size: 1.5rem; font-weight: bold; margin: 0; }
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
        nav ul li:hover { background: rgba(255, 255, 255, 0.2); }
        nav ul li.active { background: white; color: #5563d6; font-weight: bold; }
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
        .logout-btn:hover { background: #e53e3e; }
        .dashboard-content { padding: 40px 30px; }
        .content-wrapper { max-width: 1200px; margin: 0 auto; }
        h2 { color: #333; font-size: 2rem; margin-bottom: 10px; }
        .subtitle { color: #666; margin-bottom: 30px; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stat-card h3 {
          color: #666;
          font-size: 0.9rem;
          margin: 0 0 10px 0;
          font-weight: normal;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }
        .stat-change {
          font-size: 0.85rem;
          color: #48bb78;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .reports-by-type {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .type-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .type-item:last-child { border-bottom: none; }
      `}</style>

      <div className="admin-top-menu">
        <div className="header-left" onClick={() => router.push('/admin/dashboard')}>
          <div className="logo-container">
            <Image src="/logo.jfif" alt="SecuriCité Logo" width={50} height={50} />
          </div>
          <h1 className="site-title">SecuriCité Admin</h1>
        </div>

        <nav>
          <ul>
            <li className={activeTab === 'plaintes' ? 'active' : ''} onClick={() => handleNavigation('plaintes', '/admin/plaintes')}>
              <FileText size={18} /> Plaintes
            </li>
            <li className={activeTab === 'utilisateurs' ? 'active' : ''} onClick={() => handleNavigation('utilisateurs', '/admin/utilisateurs')}>
              <Users size={18} /> Utilisateurs
            </li>
            <li className={activeTab === 'rapports' ? 'active' : ''} onClick={() => handleNavigation('rapports', '/admin/rapports')}>
              <BarChart3 size={18} /> Rapports
            </li>
            <li className={activeTab === 'communication' ? 'active' : ''} onClick={() => handleNavigation('communication', '/admin/communication')}>
              <MessageSquare size={18} /> Communication
            </li>
          </ul>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-wrapper">
          <h2>Tableau de bord administrateur</h2>
          <p className="subtitle">Vue d'ensemble des statistiques et activités de la plateforme</p>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Utilisateurs</h3>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-change">
                <TrendingUp size={16} /> Utilisateurs inscrits
              </div>
            </div>

            <div className="stat-card">
              <h3>Utilisateurs Actifs</h3>
              <div className="stat-value">{stats.activeUsers}</div>
              <div className="stat-change">
                <TrendingUp size={16} /> Ont soumis des rapports
              </div>
            </div>

            <div className="stat-card">
              <h3>Total Signalements</h3>
              <div className="stat-value">{stats.totalReports}</div>
              <div className="stat-change">
                <TrendingUp size={16} /> Toutes catégories
              </div>
            </div>

            <div className="stat-card">
              <h3>En Attente</h3>
              <div className="stat-value">{stats.pendingReports}</div>
              <div className="stat-change" style={{ color: '#f59e0b' }}>
                Nécessite action
              </div>
            </div>

            <div className="stat-card">
              <h3>En Cours</h3>
              <div className="stat-value">{stats.inProgressReports}</div>
              <div className="stat-change" style={{ color: '#3b82f6' }}>
                En traitement
              </div>
            </div>

            <div className="stat-card">
              <h3>Résolus</h3>
              <div className="stat-value">{stats.resolvedReports}</div>
              <div className="stat-change">
                <TrendingUp size={16} /> Complétés
              </div>
            </div>

            <div className="stat-card">
              <h3>Rejetés</h3>
              <div className="stat-value">{stats.rejectedReports}</div>
              <div className="stat-change" style={{ color: '#ef4444' }}>
                Non traités
              </div>
            </div>
          </div>

          {stats.reportsByType.length > 0 && (
            <div className="reports-by-type">
              <h3 style={{ marginTop: 0, marginBottom: 20 }}>Signalements par type</h3>
              {stats.reportsByType.map((type: any, index: number) => (
                <div key={index} className="type-item">
                  <span>{type._id || 'Non spécifié'}</span>
                  <strong>{type.count}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}