'use client';
import React, { useState, useEffect } from 'react';
import { 
  LogOut, FileText, Users, BarChart3, MessageSquare,
  Send, CheckCircle, Clock, Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService, authService } from '@/services/api';
import '@/styles/admin-communication.css';

interface Message {
  _id: string;
  report: {
    _id: string;
    crimeType: string;
  };
  user: {
    name: string;
    email: string;
  };
  content: string;
  createdAt: string;
  isAdminResponse?: boolean;
}

export default function AdminCommunication() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('communication');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/admin-login');
      return;
    }
    fetchMessages();
  }, [page, router]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await adminService.getMessages({ page, limit: 10 });
      
      if (response.success) {
        setMessages(response.data.messages);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResponse = async (messageId: string) => {
    if (!responseMessage.trim()) {
      alert('Veuillez écrire une réponse');
      return;
    }

    try {
      const message = messages.find(m => m._id === messageId);
      if (!message) return;

      const response = await adminService.sendResponse(message.report._id, responseMessage);
      
      if (response.success) {
        alert('Réponse envoyée avec succès !');
        setResponseMessage('');
        setSelectedMessageId(null);
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Erreur lors de l\'envoi de la réponse');
    }
  };

  const handleReplyClick = (messageId: string) => {
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId);
    setResponseMessage('');
  };

  const handleViewComplaint = (reportId: string) => {
    router.push(`/admin/plaintes?id=${reportId}`);
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/admin-login');
  };

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  // Calculer les stats
  const pendingMessages = messages.filter(m => !m.isAdminResponse).length;
  const answeredMessages = messages.filter(m => m.isAdminResponse).length;

  return (
    <div className="admin-dashboard">
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
          <h2>Réponse & Communication</h2>
          <p className="subtitle">Gérez les messages et répondez aux utilisateurs</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Messages en Attente</h3>
              <div className="stat-value">{pendingMessages}</div>
              <div className="stat-change">À traiter prioritairement</div>
            </div>
            <div className="stat-card">
              <h3>Réponses Envoyées</h3>
              <div className="stat-value">{answeredMessages}</div>
              <div className="stat-change">Total</div>
            </div>
            <div className="stat-card">
              <h3>Messages Total</h3>
              <div className="stat-value">{pagination.total}</div>
              <div className="stat-change">
                <Clock size={16} /> Tous les messages
              </div>
            </div>
            <div className="stat-card">
              <h3>Taux de Réponse</h3>
              <div className="stat-value">
                {pagination.total > 0 ? Math.round((answeredMessages / pagination.total) * 100) : 0}%
              </div>
              <div className="stat-change">
                <CheckCircle size={16} /> Performance
              </div>
            </div>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <div className="message-list">
                {messages.map(message => (
                  <div key={message._id} className="message-card">
                    <div className="message-header">
                      <div className="message-user-info">
                        <div className="message-user">{message.user.name}</div>
                        <div className="message-email">{message.user.email}</div>
                        <div className="message-complaint">
                          Concernant: <strong>{message.report.crimeType}</strong>
                        </div>
                      </div>
                      <div className="message-meta">
                        <div className="message-date">
                          {new Date(message.createdAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </div>
                        <span className={`status-badge ${message.isAdminResponse ? 'resolved' : 'pending'}`}>
                          {message.isAdminResponse ? 'Réponse admin' : 'Message utilisateur'}
                        </span>
                      </div>
                    </div>
                    <div className="message-content">
                      <strong>Message:</strong><br />{message.content}
                    </div>

                    {!message.isAdminResponse && (
                      <>
                        <div className="message-actions">
                          <button className="btn btn-reply" onClick={() => handleReplyClick(message._id)}>
                            <MessageSquare size={16} /> Répondre
                          </button>
                          <button className="btn btn-view" onClick={() => handleViewComplaint(message.report._id)}>
                            <Eye size={16} /> Voir la plainte
                          </button>
                        </div>
                        {selectedMessageId === message._id && (
                          <div className="response-form">
                            <label htmlFor={`response-${message._id}`}>Votre réponse</label>
                            <textarea
                              id={`response-${message._id}`}
                              className="response-textarea"
                              placeholder="Écrivez votre réponse ici..."
                              value={responseMessage}
                              onChange={(e) => setResponseMessage(e.target.value)}
                            />
                            <div className="response-actions">
                              <button 
                                className="btn btn-send" 
                                onClick={() => handleSendResponse(message._id)} 
                                disabled={!responseMessage.trim()}
                              >
                                <Send size={16} /> Envoyer la réponse
                              </button>
                              <button 
                                className="btn btn-cancel" 
                                onClick={() => { setSelectedMessageId(null); setResponseMessage(''); }}
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {message.isAdminResponse && (
                      <div className="answered-badge">
                        <CheckCircle size={16} /> <span>Réponse de l'administration</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button
                  className="page-btn"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Précédent
                </button>
                <span style={{ padding: '8px 12px', background: '#667eea', color: 'white', borderRadius: '4px' }}>
                  Page {page} / {pagination.totalPages || 1}
                </span>
                <button
                  className="page-btn"
                  disabled={page >= (pagination.totalPages || 1)}
                  onClick={() => setPage(p => p + 1)}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
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