'use client';
import React, { useState } from 'react';
import { 
  LogOut, FileText, Users, BarChart3, MessageSquare,
  Send, CheckCircle, Clock, Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/styles/admin-communication.css';

interface Message {
  id: string;
  complaintId: string;
  user: string;
  email: string;
  content: string;
  date: string;
  status: 'pending' | 'answered';
}

export default function AdminCommunication() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('communication');
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: '#M001', complaintId: '#1247', user: 'Jean Djemai', email: 'jean.dj@email.com', content: 'Avez-vous des nouvelles sur mon dossier de vol de véhicule ?', date: '2024-12-26', status: 'pending' },
    { id: '#M002', complaintId: '#1246', user: 'Marie Chebli', email: 'marie.cheb2004@email.com', content: 'Merci pour votre intervention rapide concernant le vandalisme.', date: '2024-12-25', status: 'answered' },
    { id: '#M003', complaintId: '#1245', user: 'Pierre kacha', email: 'pierre.kacha02@email.com', content: 'Quand puis-je récupérer mon attestation de dépôt de plainte ?', date: '2024-12-24', status: 'pending' },
    { id: '#M004', complaintId: '#1244', user: 'Sophie Khadir', email: 'sophie.khadir@email.com', content: 'Y a-t-il du nouveau concernant la tentative de cambriolage ?', date: '2024-12-23', status: 'pending' },
    { id: '#M005', complaintId: '#1243', user: 'Luca Maouche', email: 'maouche.luc@email.com', content: 'Je voudrais contester la décision prise sur ma plainte.', date: '2024-12-22', status: 'answered' },
  ]);

  const handleLogout = () => router.push('/admin-login');

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  const handleSendResponse = (messageId: string) => {
    if (responseMessage.trim()) {
      setMessages(messages.map(m => m.id === messageId ? { ...m, status: 'answered' as const } : m));
      setResponseMessage('');
      setSelectedMessageId(null);
      alert('Réponse envoyée avec succès !');
    }
  };

  const handleReplyClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    setResponseMessage('');
  };

  const handleViewComplaint = (complaintId: string) => router.push(`/admin/plaintes?id=${complaintId}`);

  return (
    <div className="admin-dashboard">
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
          <p className="subtitle">Envoyer des réponses ou des questions aux utilisateurs concernant les cas signalés.</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Messages en Attente</h3>
              <div className="stat-value">{messages.filter(m => m.status === 'pending').length}</div>
              <div className="stat-change">À traiter prioritairement</div>
            </div>
            <div className="stat-card">
              <h3>Réponses Envoyées</h3>
              <div className="stat-value">{messages.filter(m => m.status === 'answered').length}</div>
              <div className="stat-change">Ce mois</div>
            </div>
            <div className="stat-card">
              <h3>Temps de Réponse Moyen</h3>
              <div className="stat-value">2.3h</div>
              <div className="stat-change">
                <Clock size={16} /> Excellent
              </div>
            </div>
            <div className="stat-card">
              <h3>Taux de Satisfaction</h3>
              <div className="stat-value">92%</div>
              <div className="stat-change">
                <CheckCircle size={16} /> +3% vs mois dernier
              </div>
            </div>
          </div>

          <div className="message-list">
            {messages.map(message => (
              <div key={message.id} className="message-card">
                <div className="message-header">
                  <div className="message-user-info">
                    <div className="message-user">{message.user}</div>
                    <div className="message-email">{message.email}</div>
                    <div className="message-complaint">Concernant la plainte: <strong>{message.complaintId}</strong></div>
                  </div>
                  <div className="message-meta">
                    <div className="message-date">
                      {new Date(message.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
                    </div>
                    <span className={`status-badge ${message.status === 'pending' ? 'pending' : 'resolved'}`}>
                      {message.status === 'pending' ? 'En attente' : 'Répondu'}
                    </span>
                  </div>
                </div>
                <div className="message-content">
                  <strong>Message:</strong><br />{message.content}
                </div>

                {message.status === 'pending' && (
                  <>
                    <div className="message-actions">
                      <button className="btn btn-reply" onClick={() => handleReplyClick(message.id)}>
                        <MessageSquare size={16} /> Répondre
                      </button>
                      <button className="btn btn-view" onClick={() => handleViewComplaint(message.complaintId)}>
                        <Eye size={16} /> Voir la plainte
                      </button>
                    </div>
                    {selectedMessageId === message.id && (
                      <div className="response-form">
                        <label htmlFor={`response-${message.id}`}>Votre réponse</label>
                        <textarea
                          id={`response-${message.id}`}
                          className="response-textarea"
                          placeholder="Écrivez votre réponse ici..."
                          value={responseMessage}
                          onChange={(e) => setResponseMessage(e.target.value)}
                        />
                        <div className="response-actions">
                          <button className="btn btn-send" onClick={() => handleSendResponse(message.id)} disabled={!responseMessage.trim()}>
                            <Send size={16} /> Envoyer la réponse
                          </button>
                          <button className="btn btn-cancel" onClick={() => { setSelectedMessageId(null); setResponseMessage(''); }}>
                            Annuler
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {message.status === 'answered' && (
                  <div className="answered-badge">
                    <CheckCircle size={16} /> <span>Réponse envoyée avec succès</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
