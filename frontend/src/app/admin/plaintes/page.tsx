'use client';
import React, { useState, useEffect } from 'react';
import { 
  LogOut, FileText, Users, BarChart3, MessageSquare,
  Search, Filter, Eye, Edit, Trash2, MapPin, Download
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { adminService, authService } from '@/services/api';

interface Complaint {
  _id: string;
  crimeType: string;
  createdAt: string;
  location: { address: string };
  status: string;
  createdBy: { name: string } | string; // ✅ Peut être un objet ou un string
  description: string;
  urgency?: string;
}

export default function AdminPlaintes() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('plaintes');
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/admin-login');
      return;
    }
    fetchComplaints();
  }, [page, filterStatus, router]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllReports({ 
        page, 
        limit: 10,
        status: filterStatus !== 'all' ? filterStatus : undefined
      });
      
      if (response.success) {
        setComplaints(response.data.reports);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      alert('Erreur lors du chargement des plaintes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await adminService.updateReportStatus(id, newStatus);
      if (response.success) {
        alert('Statut mis à jour avec succès');
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette plainte ?')) return;
    
    try {
      const response = await adminService.deleteReport(id);
      if (response.success) {
        alert('Plainte supprimée avec succès');
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Erreur lors de la suppression');
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

  const getStatusBadgeClass = (status: string) => {
    const statusMap: any = {
      'submitted': 'pending',
      'in_review': 'in-progress',
      'resolved': 'resolved',
      'rejected': 'rejected'
    };
    return statusMap[status] || 'pending';
  };

  const getStatusLabel = (status: string) => {
    const labels: any = {
      'submitted': 'En attente',
      'in_review': 'En cours',
      'resolved': 'Résolu',
      'rejected': 'Rejeté'
    };
    return labels[status] || status;
  };

  // ✅ Fonction helper pour obtenir le nom de l'utilisateur
  const getUserName = (createdBy: { name: string } | string | undefined) => {
    if (!createdBy) return 'Utilisateur inconnu';
    if (typeof createdBy === 'string') return 'Utilisateur';
    return createdBy.name || 'Utilisateur inconnu';
  };

  const filteredComplaints = complaints.filter(complaint => {
    const userName = getUserName(complaint.createdBy);
    return (
      complaint.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="admin-dashboard">
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
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stat-card h3 { color: #666; font-size: 0.9rem; margin: 0 0 10px 0; }
        .stat-value { font-size: 2rem; font-weight: bold; color: #667eea; }
        .filters-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .filters-row { display: flex; gap: 10px; margin-bottom: 15px; }
        .filter-input {
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
        }
        .btn-filter { background: #667eea; color: white; }
        .data-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow-x: auto;
        }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th {
          background: #f7fafc;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e2e8f0;
        }
        .data-table td { padding: 15px; border-bottom: 1px solid #e2e8f0; }
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .status-badge.pending { background: #fef3c7; color: #92400e; }
        .status-badge.in-progress { background: #dbeafe; color: #1e40af; }
        .status-badge.resolved { background: #d1fae5; color: #065f46; }
        .status-badge.rejected { background: #fee2e2; color: #991b1b; }
        .status-select {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        .action-buttons { display: flex; gap: 5px; }
        .action-btn {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .action-btn.view { background: #3b82f6; color: white; }
        .action-btn.delete { background: #ef4444; color: white; }
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
        .page-btn.active { background: #667eea; color: white; }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
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
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
        }
        .detail-row {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        .detail-row label {
          display: block;
          font-weight: 600;
          color: #666;
          margin-bottom: 5px;
        }
        .detail-row p { margin: 0; color: #333; }
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
          <h2>Gestion des plaintes</h2>
          <p className="subtitle">Gérer et suivre toutes les plaintes soumises</p>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total</h3>
              <div className="stat-value">{pagination.total}</div>
            </div>
            <div className="stat-card">
              <h3>En attente</h3>
              <div className="stat-value">{complaints.filter(c => c.status === 'submitted').length}</div>
            </div>
            <div className="stat-card">
              <h3>En cours</h3>
              <div className="stat-value">{complaints.filter(c => c.status === 'in_review').length}</div>
            </div>
            <div className="stat-card">
              <h3>Résolues</h3>
              <div className="stat-value">{complaints.filter(c => c.status === 'resolved').length}</div>
            </div>
          </div>

          <div className="filters-section">
            <div className="filters-row">
              <input
                type="text"
                className="filter-input"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className="filter-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="submitted">En attente</option>
                <option value="in_review">En cours</option>
                <option value="resolved">Résolu</option>
                <option value="rejected">Rejeté</option>
              </select>
              <button className="btn btn-filter" onClick={fetchComplaints}>
                <Search size={16} /> Rechercher
              </button>
            </div>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Lieu</th>
                      <th>Utilisateur</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((c) => (
                      <tr key={c._id}>
                        <td>{c.crimeType}</td>
                        <td>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td><MapPin size={14} style={{verticalAlign: 'middle', marginRight: 4}} />{c.location.address}</td>
                        <td>{getUserName(c.createdBy)}</td>
                        <td>
                          <select 
                            className="status-select"
                            value={c.status}
                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                          >
                            <option value="submitted">En attente</option>
                            <option value="in_review">En cours</option>
                            <option value="resolved">Résolu</option>
                            <option value="rejected">Rejeté</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-btn view" onClick={() => setSelectedComplaint(c)}>
                              <Eye size={14} />
                            </button>
                            <button className="action-btn delete" onClick={() => handleDeleteComplaint(c._id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Précédent
                </button>
                <span className="page-btn active">Page {page} / {pagination.totalPages}</span>
                <button className="page-btn" disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}>
                  Suivant
                </button>
              </div>
            </>
          )}

          {selectedComplaint && (
            <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Détails de la plainte</h3>
                  <button className="close-btn" onClick={() => setSelectedComplaint(null)}>×</button>
                </div>
                <div className="detail-row">
                  <label>Type</label>
                  <p>{selectedComplaint.crimeType}</p>
                </div>
                <div className="detail-row">
                  <label>Date</label>
                  <p>{new Date(selectedComplaint.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="detail-row">
                  <label>Lieu</label>
                  <p>{selectedComplaint.location.address}</p>
                </div>
                <div className="detail-row">
                  <label>Utilisateur</label>
                  <p>{getUserName(selectedComplaint.createdBy)}</p>
                </div>
                <div className="detail-row">
                  <label>Statut</label>
                  <p><span className={`status-badge ${getStatusBadgeClass(selectedComplaint.status)}`}>{getStatusLabel(selectedComplaint.status)}</span></p>
                </div>
                <div className="detail-row">
                  <label>Description</label>
                  <p>{selectedComplaint.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}