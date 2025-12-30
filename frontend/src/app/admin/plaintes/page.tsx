'use client';
import React, { useState } from 'react';
import { 
  LogOut, FileText, Users, BarChart3, MessageSquare,
  Search, Filter, Eye, Edit, Trash2, MapPin, Download
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Complaint {
  id: string;
  type: string;
  date: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  user: string;
  urgency: 'low' | 'medium' | 'high';
  description: string;
}

export default function AdminPlaintes() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('plaintes');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: '#1247', type: 'Vol de véhicule', date: '2024-12-25', location: 'Rue de la Paix', status: 'pending', user: 'Jean Dupont', urgency: 'high', description: 'Vol de voiture devant mon domicile' },
    { id: '#1246', type: 'Vandalisme', date: '2024-12-24', location: 'Avenue des Champs', status: 'in-progress', user: 'Marie Martin', urgency: 'medium', description: 'Tags sur le mur de mon immeuble' },
    { id: '#1245', type: 'Agression', date: '2024-12-23', location: 'Place de la République', status: 'resolved', user: 'Pierre Durand', urgency: 'high', description: 'Agression verbale dans la rue' },
    { id: '#1244', type: 'Cambriolage', date: '2024-12-22', location: 'Boulevard Victor Hugo', status: 'pending', user: 'Sophie Bernard', urgency: 'high', description: 'Tentative de cambriolage' },
    { id: '#1243', type: 'Trouble public', date: '2024-12-21', location: 'Rue du Commerce', status: 'rejected', user: 'Luc Petit', urgency: 'low', description: 'Nuisances sonores nocturnes' },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const handleLogout = () => {
    router.push('/admin-login');
  };

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  const handleStatusChange = (id: string, newStatus: Complaint['status']) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleDeleteComplaint = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette plainte ?')) {
      setComplaints(complaints.filter(c => c.id !== id));
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesType = filterType === 'all' || complaint.type === filterType;
    const matchesUrgency = filterUrgency === 'all' || complaint.urgency === filterUrgency;
    
    let matchesDate = true;
    if (dateFrom) matchesDate = matchesDate && complaint.date >= dateFrom;
    if (dateTo) matchesDate = matchesDate && complaint.date <= dateTo;
    
    return matchesSearch && matchesStatus && matchesType && matchesUrgency && matchesDate;
  });

  const getUrgencyBadge = (urgency: string) => {
    const badges = {
      low: { text: 'Faible', class: 'urgency-low' },
      medium: { text: 'Moyenne', class: 'urgency-medium' },
      high: { text: 'Élevée', class: 'urgency-high' }
    };
    return badges[urgency as keyof typeof badges] || badges.low;
  };

  return (
    <div className="admin-dashboard">
      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
          background: #f9f9f9;
          color: #333;
        }

        .admin-top-menu {
          background: #667eea;
          color: white;
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: white;
          flex-shrink: 0;
        }

        .admin-top-menu nav {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .admin-top-menu nav ul {
          display: flex;
          list-style: none;
          gap: 10px;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
          justify-content: center;
        }

        .admin-top-menu nav ul li {
          background: transparent;
          color: white;
          font-weight: 500;
          padding: 10px 24px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-top-menu nav ul li:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .admin-top-menu nav ul li.active {
          background: white;
          color: #5563d6;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .logout-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: #f56565;
          color: white;
          font-weight: 500;
          transition: background 0.2s ease-in-out;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .logout-btn:hover {
          background: #e53e3e;
        }

        .dashboard-content {
          padding: 40px 30px;
          flex: 1;
        }

        .content-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        h2 {
          color: #333;
          font-size: 2rem;
          margin-bottom: 15px;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }

        .subtitle {
          color: #555;
          line-height: 1.6;
          font-size: 1.1rem;
          margin-bottom: 25px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transition: transform 0.2s ease-in-out;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-card h3 {
          font-size: 1rem;
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .stat-card .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 10px 0;
        }

        .stat-card .stat-change {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .filters-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 25px;
        }

        .filters-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .filter-group label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #495057;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          padding: 10px 15px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.95rem;
        }

        .filter-input,
        .filter-select {
          padding: 10px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 0.95rem;
          background: white;
        }

        .filter-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .filter-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-filter {
          background: #667eea;
          color: white;
        }

        .btn-filter:hover {
          background: #5563d6;
        }

        .btn-reset {
          background: #6c757d;
          color: white;
        }

        .btn-reset:hover {
          background: #5a6268;
        }

        .btn-export {
          background: #28a745;
          color: white;
        }

        .btn-export:hover {
          background: #218838;
        }

        .data-table-container {
          width: 100%;
          overflow-x: auto;
          margin-top: 20px;
        }

        .data-table {
          width: 100%;
          min-width: 1000px;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .data-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .data-table tr:hover {
          background: #f8f9fa;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.resolved {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.in-progress {
          background: #cce5ff;
          color: #004085;
        }

        .status-badge.rejected {
          background: #f8d7da;
          color: #721c24;
        }

        .urgency-low {
          background: #d1ecf1;
          color: #0c5460;
        }

        .urgency-medium {
          background: #fff3cd;
          color: #856404;
        }

        .urgency-high {
          background: #f8d7da;
          color: #721c24;
        }

        .status-select {
          padding: 6px 10px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .action-btn.view {
          background: #667eea;
          color: white;
        }

        .action-btn.view:hover {
          background: #5563d6;
        }

        .action-btn.edit {
          background: #ffc107;
          color: white;
        }

        .action-btn.edit:hover {
          background: #e0a800;
        }

        .action-btn.delete {
          background: #dc3545;
          color: white;
        }

        .action-btn.delete:hover {
          background: #c82333;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #999;
        }

        .close-btn:hover {
          color: #333;
        }

        .detail-row {
          margin-bottom: 15px;
        }

        .detail-row label {
          font-weight: 600;
          color: #495057;
          display: block;
          margin-bottom: 5px;
        }

        .detail-row p {
          margin: 0;
          color: #333;
        }

        @media (max-width: 968px) {
          .admin-top-menu {
            flex-direction: column;
            padding: 15px 20px;
            gap: 15px;
          }
          
          .logo {
            width: 100%;
            text-align: center;
            font-size: 1.5rem;
          }
          
          .admin-top-menu nav {
            width: 100%;
          }
          
          .admin-top-menu nav ul {
            flex-direction: column;
            gap: 8px;
            width: 100%;
          }
          
          .admin-top-menu nav ul li {
            width: 100%;
            text-align: center;
            padding: 12px 20px;
            justify-content: center;
          }
          
          .logout-btn {
            width: 100%;
            justify-content: center;
          }
          
          .dashboard-content {
            padding: 20px 15px;
          }
          
          .content-wrapper {
            padding: 20px 15px;
          }
          
          h2 {
            font-size: 1.5rem;
          }

          .filters-row {
            grid-template-columns: 1fr;
          }

          .filter-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .data-table-container {
            font-size: 0.85rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="admin-top-menu">
        {/* Logo et titre */}
                <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="logo-container">
                    <Image src="/logo.jfif" alt="SecuriCité Logo" width={50} height={50} />
                  </div>
                  <h1 className="site-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>SecuriCité</h1>
                </div>


        
        <nav>
          <ul>
            <li
              className={activeTab === 'plaintes' ? 'active' : ''}
              onClick={() => handleNavigation('plaintes', '/admin/plaintes')}
            >
              <FileText size={18} />
              Plaintes
            </li>
            <li
              className={activeTab === 'utilisateurs' ? 'active' : ''}
              onClick={() => handleNavigation('utilisateurs', '/admin/utilisateurs')}
            >
              <Users size={18} />
              Utilisateurs
            </li>
            <li
              className={activeTab === 'rapports' ? 'active' : ''}
              onClick={() => handleNavigation('rapports', '/admin/rapports')}
            >
              <BarChart3 size={18} />
              Rapports
            </li>
            <li
              className={activeTab === 'communication' ? 'active' : ''}
              onClick={() => handleNavigation('communication', '/admin/communication')}
            >
              <MessageSquare size={18} />
              Communication
            </li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      <div className="dashboard-content">
        <div className="content-wrapper">
          <h2>Gestion des plaintes</h2>
          <p className="subtitle">
            Répertorier, filtrer et mettre à jour les dossiers de plaintes ; consulter les détails et modifier leur état.
          </p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Plaintes</h3>
              <div className="stat-value">{complaints.length}</div>
              <div className="stat-change">+12% ce mois</div>
            </div>
            <div className="stat-card">
              <h3>En Attente</h3>
              <div className="stat-value">{complaints.filter(c => c.status === 'pending').length}</div>
              <div className="stat-change">Nécessite action</div>
            </div>
            <div className="stat-card">
              <h3>En Cours</h3>
              <div className="stat-value">{complaints.filter(c => c.status === 'in-progress').length}</div>
              <div className="stat-change">En traitement</div>
            </div>
            <div className="stat-card">
              <h3>Résolues</h3>
              <div className="stat-value">{complaints.filter(c => c.status === 'resolved').length}</div>
              <div className="stat-change">Fermées</div>
            </div>
          </div>

          <div className="filters-section">
            <h3 style={{marginTop: 0, marginBottom: 15, color: '#333'}}>
              <Filter size={18} style={{verticalAlign: 'middle', marginRight: 8}} />
              Recherche et filtrage avancé
            </h3>
            
            <div className="filters-row">
              <div className="filter-group">
                <label>Recherche</label>
                <div className="search-box">
                  <Search size={18} color="#999" />
                  <input
                    type="text"
                    placeholder="Type, lieu, utilisateur..."
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
                  <option value="pending">En attente</option>
                  <option value="in-progress">En cours</option>
                  <option value="resolved">Résolu</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Type</label>
                <select 
                  className="filter-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tous types</option>
                  <option value="Vol de véhicule">Vol de véhicule</option>
                  <option value="Vandalisme">Vandalisme</option>
                  <option value="Agression">Agression</option>
                  <option value="Cambriolage">Cambriolage</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Urgence</label>
                <select 
                  className="filter-select"
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                >
                  <option value="all">Toutes</option>
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Date début</label>
                <input 
                  type="date" 
                  className="filter-input"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Date fin</label>
                <input 
                  type="date" 
                  className="filter-input"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="btn btn-filter">
                <Search size={16} />
                Rechercher ({filteredComplaints.length} résultats)
              </button>
              <button 
                className="btn btn-reset"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterType('all');
                  setFilterUrgency('all');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Réinitialiser
              </button>
              <button className="btn btn-export">
                <Download size={16} />
                Exporter
              </button>
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Utilisateur</th>
                  <th>Urgence</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td><strong>{complaint.id}</strong></td>
                    <td>{complaint.type}</td>
                    <td>{new Date(complaint.date).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <MapPin size={14} style={{verticalAlign: 'middle', marginRight: 4}} />
                      {complaint.location}
                    </td>
                    <td>{complaint.user}</td>
                    <td>
                      <span className={`status-badge ${getUrgencyBadge(complaint.urgency).class}`}>
                        {getUrgencyBadge(complaint.urgency).text}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="status-select"
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value as Complaint['status'])}
                      >
                        <option value="pending">En attente</option>
                        <option value="in-progress">En cours</option>
                        <option value="resolved">Résolu</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          <Eye size={14} />
                        </button>
                        <button className="action-btn edit">
                          <Edit size={14} />
                        </button>
                        <button 
                          className="action-btn delete"
                          onClick={() => handleDeleteComplaint(complaint.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails - {selectedComplaint.id}</h3>
              <button className="close-btn" onClick={() => setSelectedComplaint(null)}>×</button>
            </div>
            
            <div className="detail-row">
              <label>Type</label>
              <p>{selectedComplaint.type}</p>
            </div>
            
            <div className="detail-row">
              <label>Date</label>
              <p>{new Date(selectedComplaint.date).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div className="detail-row">
              <label>Lieu</label>
              <p>
                <MapPin size={16} style={{verticalAlign: 'middle', marginRight: 5}} />
                {selectedComplaint.location}
              </p>
            </div>
            
            <div className="detail-row">
              <label>Utilisateur</label>
              <p>{selectedComplaint.user}</p>
            </div>
            
            <div className="detail-row">
              <label>Urgence</label>
              <p>
                <span className={`status-badge ${getUrgencyBadge(selectedComplaint.urgency).class}`}>
                  {getUrgencyBadge(selectedComplaint.urgency).text}
                </span>
              </p>
            </div>
            
            <div className="detail-row">
              <label>Description</label>
              <p>{selectedComplaint.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}