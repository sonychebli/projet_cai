'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, FileText, Users, BarChart3, MessageSquare, Search, Eye, UserCheck, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService, authService } from '@/services/api';

export default function AdminUsers() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('utilisateurs');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/admin-login');
      return;
    }
    fetchUsers();
  }, [page, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({ page, limit: 10, search: searchTerm });
      
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Erreur lors de la récupération des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!confirm(`Changer le rôle de cet utilisateur en "${newRole}" ?`)) return;
    
    try {
      const response = await adminService.updateUserRole(userId, newRole);
      if (response.success) {
        alert('Rôle mis à jour avec succès');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
      const response = await adminService.deleteUser(userId);
      if (response.success) {
        alert('Utilisateur supprimé avec succès');
        fetchUsers();
      }
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression');
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <style jsx>{`
        .admin-top-menu {
          background: #667eea;
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-left { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .site-title { font-size: 1.5rem; font-weight: bold; margin: 0; }
        nav ul { display: flex; list-style: none; gap: 15px; margin: 0; padding: 0; }
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
        .dashboard-content { padding: 40px 30px; }
        .content-wrapper { max-width: 1400px; margin: 0 auto; }
        h2 { color: #333; font-size: 2rem; margin-bottom: 10px; }
        .subtitle { color: #666; margin-bottom: 30px; }
        .search-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
        }
        .search-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
        }
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #5568d3; }
        .data-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .data-table table { width: 100%; border-collapse: collapse; }
        .data-table th {
          background: #f7fafc;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e2e8f0;
        }
        .data-table td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .data-table tr:hover { background: #f7fafc; }
        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .role-user { background: #e0e7ff; color: #4338ca; }
        .role-admin { background: #fef3c7; color: #92400e; }
        .role-police { background: #dbeafe; color: #1e40af; }
        .action-btn {
          padding: 6px 12px;
          margin: 0 5px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .btn-edit { background: #3b82f6; color: white; }
        .btn-delete { background: #ef4444; color: white; }
        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }
        .page-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
        }
        .page-btn.active { background: #667eea; color: white; border-color: #667eea; }
      `}</style>

      <div className="admin-top-menu">
        <div className="header-left" onClick={() => router.push('/admin/dashboard')}>
          <Image src="/logo.jfif" alt="Logo" width={50} height={50} />
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
          <h2>Gestion des utilisateurs</h2>
          <p className="subtitle">Surveiller les comptes utilisateurs et gérer les rôles</p>

          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-primary" onClick={handleSearch}>
              <Search size={16} /> Rechercher
            </button>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Date d'inscription</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role === 'admin' ? 'Administrateur' : user.role === 'police' ? 'Police' : 'Utilisateur'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>
                          <select
                            className="action-btn"
                            value={user.role}
                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                          >
                            <option value="user">Utilisateur</option>
                            <option value="admin">Admin</option>
                            <option value="police">Police</option>
                          </select>
                          <button className="action-btn btn-delete" onClick={() => handleDeleteUser(user._id)}>
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Précédent
                </button>
                <span className="page-btn active">Page {page} / {pagination.totalPages}</span>
                <button
                  className="page-btn"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Suivant
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}