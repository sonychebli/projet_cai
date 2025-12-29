'use client';
import React, { useState } from 'react';
import { 
  LogOut, Home, FileText, MessageSquare, User, Bell,
  Search, Eye, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Complaint {
  id: string;
  type: string;
  date: string;
  location: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
  description: string;
  response?: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const [userComplaints] = useState<Complaint[]>([
    { 
      id: '#1247', 
      type: 'Vol de véhicule', 
      date: '2024-12-25', 
      location: 'Rue de la Paix', 
      status: 'in-progress', 
      urgency: 'high', 
      description: 'Vol de voiture devant mon domicile',
      response: 'Votre dossier est en cours de traitement. Un agent vous contactera sous 48h.'
    },
    { 
      id: '#1235', 
      type: 'Vandalisme', 
      date: '2024-12-20', 
      location: 'Avenue des Champs', 
      status: 'resolved', 
      urgency: 'medium', 
      description: 'Tags sur le mur de mon immeuble',
      response: 'Le dossier a été résolu. Les auteurs ont été identifiés.'
    },
    { 
      id: '#1220', 
      type: 'Nuisance sonore', 
      date: '2024-12-15', 
      location: 'Place de la République', 
      status: 'pending', 
      urgency: 'low', 
      description: 'Bruit excessif la nuit'
    },
  ]);

  const [notifications] = useState([
    { id: 1, message: 'Votre plainte #1247 a été mise à jour', date: '2024-12-26', read: false },
    { id: 2, message: 'Votre plainte #1235 a été résolue', date: '2024-12-24', read: false },
    { id: 3, message: 'Nouveau message de l\'administration', date: '2024-12-23', read: true },
  ]);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { text: 'En attente', class: 'pending', icon: <Clock size={14} /> },
      'in-progress': { text: 'En cours', class: 'in-progress', icon: <AlertCircle size={14} /> },
      resolved: { text: 'Résolu', class: 'resolved', icon: <CheckCircle size={14} /> },
      rejected: { text: 'Rejeté', class: 'rejected', icon: <XCircle size={14} /> }
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getUrgencyBadge = (urgency: string) => {
    const badges = {
      low: { text: 'Faible', class: 'urgency-low' },
      medium: { text: 'Moyenne', class: 'urgency-medium' },
      high: { text: 'Élevée', class: 'urgency-high' }
    };
    return badges[urgency as keyof typeof badges] || badges.low;
  };

  return (
    <div className="user-dashboard">
      <style jsx>{`
        .user-dashboard {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
          background: #f9f9f9;
          color: #333;
        }

        .top-menu {
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

        .top-menu nav {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .top-menu nav ul {
          display: flex;
          list-style: none;
          gap: 10px;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
          justify-content: center;
        }

        .top-menu nav ul li {
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

        .top-menu nav ul li:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .top-menu nav ul li.active {
          background: white;
          color: #5563d6;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .notification-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .notification-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .notification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #f56565;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
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
        }

        .logout-btn:hover {
          background: #e53e3e;
        }

        .dashboard-content {
          padding: 40px 30px;
          flex: 1;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .welcome-section h1 {
          color: #333;
          margin-bottom: 10px;
        }

        .welcome-section p {
          color: #666;
          font-size: 1.1rem;
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

        .stat-card .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .section-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .complaints-section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .complaint-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .complaint-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          transition: all 0.2s;
        }

        .complaint-card:hover {
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          transform: translateX(5px);
        }

        .complaint-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .complaint-info h3 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 1.1rem;
        }

        .complaint-meta {
          font-size: 0.9rem;
          color: #6c757d;
        }

        .complaint-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
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

        .complaint-description {
          color: #495057;
          margin: 12px 0;
          line-height: 1.6;
        }

        .complaint-response {
          background: #e7f3ff;
          padding: 12px;
          border-radius: 6px;
          margin-top: 12px;
          border-left: 3px solid #004085;
        }

        .complaint-response-label {
          font-weight: 600;
          color: #004085;
          margin-bottom: 5px;
        }

        .complaint-response-text {
          color: #495057;
          font-size: 0.95rem;
        }

        .complaint-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
        }

        .btn-view {
          background: #667eea;
          color: white;
        }

        .btn-view:hover {
          background: #5563d6;
        }

        .btn-primary {
          background: #28a745;
          color: white;
          padding: 12px 30px;
          font-size: 1rem;
          margin-top: 20px;
        }

        .btn-primary:hover {
          background: #218838;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.3;
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
          .top-menu {
            flex-direction: column;
            padding: 15px 20px;
            gap: 15px;
          }
          
          .logo {
            width: 100%;
            text-align: center;
            font-size: 1.5rem;
          }
          
          .top-menu nav {
            width: 100%;
          }
          
          .top-menu nav ul {
            flex-direction: column;
            gap: 8px;
            width: 100%;
          }
          
          .top-menu nav ul li {
            width: 100%;
            text-align: center;
            padding: 12px 20px;
            justify-content: center;
          }
          
          .user-actions {
            width: 100%;
            justify-content: center;
          }
          
          .dashboard-content {
            padding: 20px 15px;
          }
          
          .welcome-section,
          .complaints-section {
            padding: 20px 15px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .complaint-header {
            flex-direction: column;
          }

          .complaint-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="top-menu">
        <div className="logo">SecuriCité</div>
        <nav>
          <ul>
            <li
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => handleNavigation('dashboard', '/user/dashboard')}
            >
              <Home size={18} />
              Accueil
            </li>
            <li
              className={activeTab === 'plaintes' ? 'active' : ''}
              onClick={() => handleNavigation('plaintes', '/user/mes-plaintes')}
            >
              <FileText size={18} />
              Mes Plaintes
            </li>
            <li
              className={activeTab === 'nouvelle' ? 'active' : ''}
              onClick={() => handleNavigation('nouvelle', '/user/nouvelle-plainte')}
            >
              <FileText size={18} />
              Signaler
            </li>
            <li
              className={activeTab === 'profil' ? 'active' : ''}
              onClick={() => handleNavigation('profil', '/user/profil')}
            >
              <User size={18} />
              Mon Profil
            </li>
          </ul>
        </nav>
        <div className="user-actions">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">
              {notifications.filter(n => !n.read).length}
            </span>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-wrapper">
          <div className="welcome-section">
            <h1>👋 Bienvenue, Jean Dupont</h1>
            <p>Voici un aperçu de vos plaintes et signalements</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total de mes plaintes</h3>
              <div className="stat-value">{userComplaints.length}</div>
              <div className="stat-label">Signalements effectués</div>
            </div>
            <div className="stat-card">
              <h3>En attente</h3>
              <div className="stat-value">
                {userComplaints.filter(c => c.status === 'pending').length}
              </div>
              <div className="stat-label">En cours de traitement</div>
            </div>
            <div className="stat-card">
              <h3>En cours</h3>
              <div className="stat-value">
                {userComplaints.filter(c => c.status === 'in-progress').length}
              </div>
              <div className="stat-label">Traitement en cours</div>
            </div>
            <div className="stat-card">
              <h3>Résolues</h3>
              <div className="stat-value">
                {userComplaints.filter(c => c.status === 'resolved').length}
              </div>
              <div className="stat-label">Dossiers fermés</div>
            </div>
          </div>

          <div className="complaints-section">
            <h2 className="section-title">
              <FileText size={24} />
              Mes dernières plaintes
            </h2>

            {userComplaints.length > 0 ? (
              <div className="complaint-list">
                {userComplaints.map((complaint) => (
                  <div key={complaint.id} className="complaint-card">
                    <div className="complaint-header">
                      <div className="complaint-info">
                        <h3>{complaint.type}</h3>
                        <div className="complaint-meta">
                          {complaint.id} • {new Date(complaint.date).toLocaleDateString('fr-FR')} • {complaint.location}
                        </div>
                      </div>
                      <div className="complaint-badges">
                        <span className={`status-badge ${getStatusBadge(complaint.status).class}`}>
                          {getStatusBadge(complaint.status).icon}
                          {getStatusBadge(complaint.status).text}
                        </span>
                        <span className={`status-badge ${getUrgencyBadge(complaint.urgency).class}`}>
                          {getUrgencyBadge(complaint.urgency).text}
                        </span>
                      </div>
                    </div>

                    <div className="complaint-description">
                      {complaint.description}
                    </div>

                    {complaint.response && (
                      <div className="complaint-response">
                        <div className="complaint-response-label">
                          <MessageSquare size={16} style={{display: 'inline', verticalAlign: 'middle', marginRight: 5}} />
                          Réponse de l'administration
                        </div>
                        <div className="complaint-response-text">
                          {complaint.response}
                        </div>
                      </div>
                    )}

                    <div className="complaint-actions">
                      <button 
                        className="btn btn-view"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <Eye size={16} />
                        Voir les détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <h3>Aucune plainte enregistrée</h3>
                <p>Vous n'avez pas encore déposé de plainte</p>
                <button className="btn btn-primary">
                  Déposer ma première plainte
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la plainte {selectedComplaint.id}</h3>
              <button className="close-btn" onClick={() => setSelectedComplaint(null)}>×</button>
            </div>
            
            <div className="detail-row">
              <label>Type d'infraction</label>
              <p>{selectedComplaint.type}</p>
            </div>
            
            <div className="detail-row">
              <label>Date</label>
              <p>{new Date(selectedComplaint.date).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div className="detail-row">
              <label>Lieu</label>
              <p>{selectedComplaint.location}</p>
            </div>
            
            <div className="detail-row">
              <label>Niveau d'urgence</label>
              <p>
                <span className={`status-badge ${getUrgencyBadge(selectedComplaint.urgency).class}`}>
                  {getUrgencyBadge(selectedComplaint.urgency).text}
                </span>
              </p>
            </div>
            
            <div className="detail-row">
              <label>Statut</label>
              <p>
                <span className={`status-badge ${getStatusBadge(selectedComplaint.status).class}`}>
                  {getStatusBadge(selectedComplaint.status).icon}
                  {getStatusBadge(selectedComplaint.status).text}
                </span>
              </p>
            </div>
            
            <div className="detail-row">
              <label>Description</label>
              <p>{selectedComplaint.description}</p>
            </div>

            {selectedComplaint.response && (
              <div className="detail-row">
                <label>Réponse de l'administration</label>
                <div className="complaint-response">
                  <div className="complaint-response-text">
                    {selectedComplaint.response}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}