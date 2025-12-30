'use client';
import React, { useState } from 'react';
import { 
  LogOut, FileText, Users, BarChart3, MessageSquare,
  Search, Filter, Eye, Mail, Phone, CheckCircle, 
  XCircle, Ban, Download, Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import '@/styles/admin-users.css';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  complaintsCount: number;
  status: 'active' | 'suspended' | 'banned';
  role: 'user' | 'admin' | 'police';
}

export default function AdminUsers() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('utilisateurs');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  const [users, setUsers] = useState<User[]>([
    { 
      id: '#U001', 
      name: 'Jean Dupont', 
      email: 'jean.dupont@email.com', 
      phone: '0612345678', 
      registrationDate: '2024-11-15', 
      complaintsCount: 3, 
      status: 'active', 
      role: 'user' 
    },
    { 
      id: '#U002', 
      name: 'Marie Martin', 
      email: 'marie.martin@email.com', 
      phone: '0698765432', 
      registrationDate: '2024-11-20', 
      complaintsCount: 1, 
      status: 'active', 
      role: 'user' 
    },
    { 
      id: '#U003', 
      name: 'Pierre Durand', 
      email: 'pierre.durand@email.com', 
      phone: '0676543210', 
      registrationDate: '2024-10-10', 
      complaintsCount: 5, 
      status: 'active', 
      role: 'user' 
    },
    { 
      id: '#U004', 
      name: 'Sophie Bernard', 
      email: 'sophie.bernard@email.com', 
      phone: '0687654321', 
      registrationDate: '2024-12-01', 
      complaintsCount: 2, 
      status: 'suspended', 
      role: 'user' 
    },
    { 
      id: '#U005', 
      name: 'Luc Petit', 
      email: 'luc.petit@email.com', 
      phone: '0645678912', 
      registrationDate: '2024-09-15', 
      complaintsCount: 0, 
      status: 'active', 
      role: 'admin' 
    },
    { 
      id: '#U006', 
      name: 'Emma Dubois', 
      email: 'emma.dubois@email.com', 
      phone: '0632145698', 
      registrationDate: '2024-08-20', 
      complaintsCount: 8, 
      status: 'active', 
      role: 'police' 
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleLogout = () => {
    router.push('/admin-login');
  };

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  const handleUserStatusChange = (id: string, newStatus: User['status']) => {
    if (confirm(`Êtes-vous sûr de vouloir ${newStatus === 'active' ? 'activer' : newStatus === 'suspended' ? 'suspendre' : 'bannir'} cet utilisateur ?`)) {
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? Cette action est irréversible.')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="admin-dashboard">
      <div className="admin-top-menu">
        <div className="logo">SecuriCité Admin</div>
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
              onClick={() => handleNavigation('utilisateurs', '/admin/users')}
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

      <div className="dashboard-content">
        <div className="content-wrapper">
          <h2>Gestion des utilisateurs</h2>
          <p className="subtitle">
            Surveiller les comptes utilisateurs, modérer les signalements et gérer la confidentialité des données.
          </p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Utilisateurs Actifs</h3>
              <div className="stat-value">{users.filter(u => u.status === 'active').length}</div>
              <div className="stat-change">+8% ce mois</div>
            </div>
            <div className="stat-card">
              <h3>Nouveaux Inscrits</h3>
              <div className="stat-value">12</div>
              <div className="stat-change">Cette semaine</div>
            </div>
            <div className="stat-card">
              <h3>Comptes Suspendus</h3>
              <div className="stat-value">{users.filter(u => u.status === 'suspended').length}</div>
              <div className="stat-change">Nécessite révision</div>
            </div>
            <div className="stat-card">
              <h3>Total Plaintes</h3>
              <div className="stat-value">{users.reduce((sum, u) => sum + u.complaintsCount, 0)}</div>
              <div className="stat-change">Tous utilisateurs</div>
            </div>
          </div>

          <div className="filters-section">
            <h3 className="filters-title">
              <Filter size={18} />
              Recherche et filtrage
            </h3>
            
            <div className="filters-row">
              <div className="filter-group">
                <label>Recherche</label>
                <div className="search-box">
                  <Search size={18} color="#999" />
                  <input
                    type="text"
                    placeholder="Nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Statut</label>
                <select 
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="banned">Banni</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Rôle</label>
                <select 
                  className="filter-select"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="all">Tous les rôles</option>
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="police">Police</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button className="btn btn-filter">
                <Search size={16} />
                Rechercher ({filteredUsers.length} résultats)
              </button>
              <button 
                className="btn btn-reset"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterRole('all');
                }}
              >
                Réinitialiser
              </button>
              <button className="btn btn-export">
                <Download size={16} />
                Exporter (Excel)
              </button>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Rôle</th>
                  <th>Inscription</th>
                  <th>Plaintes</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.id}</strong></td>
                    <td>{user.name}</td>
                    <td>
                      <Mail size={14} />
                      {user.email}
                    </td>
                    <td>
                      <Phone size={14} />
                      {user.phone}
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'user' ? 'Utilisateur' : user.role === 'admin' ? 'Admin' : 'Police'}
                      </span>
                    </td>
                    <td>
                      <Calendar size={14} />
                      {new Date(user.registrationDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td><strong>{user.complaintsCount}</strong></td>
                    <td>
                      <span className={`status-badge user-status-${user.status}`}>
                        {user.status === 'active' ? 'Actif' : user.status === 'suspended' ? 'Suspendu' : 'Banni'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view"
                          onClick={() => setSelectedUser(user)}
                          title="Voir les détails"
                        >
                          <Eye size={14} />
                        </button>
                        {user.status === 'active' ? (
                          <button 
                            className="action-btn suspend"
                            onClick={() => handleUserStatusChange(user.id, 'suspended')}
                            title="Suspendre"
                          >
                            <XCircle size={14} />
                          </button>
                        ) : user.status === 'suspended' ? (
                          <>
                            <button 
                              className="action-btn approve"
                              onClick={() => handleUserStatusChange(user.id, 'active')}
                              title="Activer"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button 
                              className="action-btn ban"
                              onClick={() => handleUserStatusChange(user.id, 'banned')}
                              title="Bannir"
                            >
                              <Ban size={14} />
                            </button>
                          </>
                        ) : (
                          <button 
                            className="action-btn approve"
                            onClick={() => handleUserStatusChange(user.id, 'active')}
                            title="Réactiver"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de l'utilisateur {selectedUser.id}</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>×</button>
            </div>
            
            <div className="detail-row">
              <label>Nom complet</label>
              <p>{selectedUser.name}</p>
            </div>
            
            <div className="detail-row">
              <label>Email</label>
              <p>
                <Mail size={16} />
                {selectedUser.email}
              </p>
            </div>
            
            <div className="detail-row">
              <label>Téléphone</label>
              <p>
                <Phone size={16} />
                {selectedUser.phone}
              </p>
            </div>
            
            <div className="detail-row">
              <label>Rôle</label>
              <p>
                <span className={`role-badge role-${selectedUser.role}`}>
                  {selectedUser.role === 'user' ? 'Utilisateur' : selectedUser.role === 'admin' ? 'Administrateur' : 'Police'}
                </span>
              </p>
            </div>
            
            <div className="detail-row">
              <label>Date d'inscription</label>
              <p>{new Date(selectedUser.registrationDate).toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            
            <div className="detail-row">
              <label>Nombre de plaintes soumises</label>
              <p><strong>{selectedUser.complaintsCount}</strong> plaintes</p>
            </div>
            
            <div className="detail-row">
              <label>Statut du compte</label>
              <p>
                <span className={`status-badge user-status-${selectedUser.status}`}>
                  {selectedUser.status === 'active' ? 'Actif' : selectedUser.status === 'suspended' ? 'Suspendu' : 'Banni'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}