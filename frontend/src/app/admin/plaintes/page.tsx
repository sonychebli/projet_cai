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

  const handleLogout = () => router.push('/admin-login');

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
        /* Ton CSS complet ici */
      `}</style>

      {/* Top menu */}
      <div className="admin-top-menu">
        <div 
          className="header-left" 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => router.push('/admin/dashboard')}
        >
          <div className="logo-container">
            <Image src="/logo.jfif" alt="SecuriCité Logo" width={50} height={50} />
          </div>
          <h1 className="site-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            SecuriCité Admin
          </h1>
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

      {/* Dashboard content */}
      <div className="dashboard-content">
        <div className="content-wrapper">
          <h2>Gestion des plaintes</h2>
          <p className="subtitle">
            Répertorier, filtrer et mettre à jour les dossiers de plaintes ; consulter les détails et modifier leur état.
          </p>

          {/* Stats */}
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

          {/* Filters */}
          <div className="filters-section">
            <h3 style={{marginTop: 0, marginBottom: 15, color: '#333'}}>
              <Filter size={18} style={{verticalAlign: 'middle', marginRight: 8}} />
              Recherche et filtrage avancé
            </h3>
            <div className="filters-row">
              {/* Search, Status, Type, Urgency, Dates */}
              {/* Ton code de filtres ici */}
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
                <Download size={16} /> Exporter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Type</th><th>Date</th><th>Lieu</th><th>Utilisateur</th><th>Urgence</th><th>Statut</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.id}</strong></td>
                    <td>{c.type}</td>
                    <td>{new Date(c.date).toLocaleDateString('fr-FR')}</td>
                    <td><MapPin size={14} style={{verticalAlign: 'middle', marginRight: 4}} />{c.location}</td>
                    <td>{c.user}</td>
                    <td>
                      <span className={`status-badge ${getUrgencyBadge(c.urgency).class}`}>
                        {getUrgencyBadge(c.urgency).text}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="status-select"
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value as Complaint['status'])}
                      >
                        <option value="pending">En attente</option>
                        <option value="in-progress">En cours</option>
                        <option value="resolved">Résolu</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" onClick={() => setSelectedComplaint(c)}><Eye size={14} /></button>
                        <button className="action-btn edit"><Edit size={14} /></button>
                        <button className="action-btn delete" onClick={() => handleDeleteComplaint(c.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {selectedComplaint && (
            <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Détails - {selectedComplaint.id}</h3>
                  <button className="close-btn" onClick={() => setSelectedComplaint(null)}>×</button>
                </div>
                <div className="detail-row"><label>Type</label><p>{selectedComplaint.type}</p></div>
                <div className="detail-row"><label>Date</label><p>{new Date(selectedComplaint.date).toLocaleDateString('fr-FR')}</p></div>
                <div className="detail-row"><label>Lieu</label><p><MapPin size={16} style={{verticalAlign: 'middle', marginRight: 5}} />{selectedComplaint.location}</p></div>
                <div className="detail-row"><label>Utilisateur</label><p>{selectedComplaint.user}</p></div>
                <div className="detail-row"><label>Urgence</label><p><span className={`status-badge ${getUrgencyBadge(selectedComplaint.urgency).class}`}>{getUrgencyBadge(selectedComplaint.urgency).text}</span></p></div>
                <div className="detail-row"><label>Description</label><p>{selectedComplaint.description}</p></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
