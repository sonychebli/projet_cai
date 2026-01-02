'use client';
import React, { useEffect, useState } from 'react';
import '@/styles/suivi.css';

interface Report {
  _id: string;
  title: string;
  status: string;
  crimeType: string;
  description: string;
  location: string;
  date: string;
  createdAt: string;
  urgency: string;
}

interface Dossier {
  id: string;
  titre: string;
  statut: 'submitted' | 'in_review' | 'resolved';
  date: string;
  type?: string;
  description?: string;
  urgency?: string;
  location?: string;
}

export default function SuiviComponent() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Récupérer l'utilisateur depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchDossiers = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Vous devez être connecté pour voir vos signalements');
          setLoading(false);
          return;
        }

        const headers: HeadersInit = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        console.log('Récupération des signalements pour l\'utilisateur:', user.id);
        
        // Utiliser la route spécifique pour récupérer les signalements de l'utilisateur
        const response = await fetch(`${API_URL}/reports/user/${user.id}`, {
          method: 'GET',
          headers
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: Report[] = await response.json();
        console.log('Signalements reçus:', data);

        // Mapper les données du backend vers le format du composant
        const mappedDossiers: Dossier[] = data.map((report: any) => ({
          id: report._id,
          titre: report.title || 'Sans titre',
          statut: report.status || 'submitted',
          date: report.createdAt || report.date,
          type: report.crimeType,
          description: report.description,
          urgency: report.urgency,
          location: report.location
        }));
        
        setDossiers(mappedDossiers);
      } catch (err) {
        console.error('Erreur lors du chargement des signalements:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, [user]);

  // Fonction pour traduire le statut
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      'submitted': 'Soumis',
      'in_review': 'En cours',
      'resolved': 'Résolu'
    };
    return statusMap[status] || status;
  };

  // Fonction pour obtenir la classe CSS du statut
  const getStatusClass = (status: string): string => {
    const classMap: Record<string, string> = {
      'submitted': 'status-soumis',
      'in_review': 'status-en-cours',
      'resolved': 'status-resolu'
    };
    return classMap[status] || 'status-default';
  };

  if (loading) {
    return (
      <div className="suivi-section">
        <div className="loading-spinner" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{ fontSize: '18px', color: '#666' }}>Chargement de vos signalements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="suivi-section">
        <div className="error-message" style={{
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '20px',
          margin: '20px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#c33', fontSize: '18px', marginBottom: '15px' }}>❌ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#667eea',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="suivi-section">
        <div className="empty-state" style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f9fafb',
          borderRadius: '12px',
          margin: '20px'
        }}>
          <p style={{ fontSize: '48px', marginBottom: '15px' }}>🔒</p>
          <p style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>
            Connexion requise
          </p>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Veuillez vous connecter pour voir vos signalements.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="suivi-section">
      <h1>L'état d'avancement des dossiers</h1>
      
      {dossiers.length === 0 ? (
        <div className="empty-state" style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f9fafb',
          borderRadius: '12px',
          margin: '20px'
        }}>
          <p style={{ fontSize: '48px', marginBottom: '15px' }}>📋</p>
          <p style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>
            Aucun signalement pour le moment.
          </p>
          <p style={{ fontSize: '16px', color: '#666' }}>
            Vos signalements apparaîtront ici une fois soumis.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', margin: '20px' }}>
          <table className="suivi-table" style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ background: '#667eea', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Titre</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Statut</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Urgence</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {dossiers.map((d, index) => (
                <tr key={d.id} style={{
                  borderBottom: '1px solid #e5e7eb',
                  background: index % 2 === 0 ? 'white' : '#f9fafb'
                }}>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '12px',
                      background: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {d.id.slice(-8)}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontWeight: '500' }}>{d.titre}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      background: '#e0e7ff',
                      color: '#4338ca',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '14px'
                    }}>
                      {d.type}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span className={getStatusClass(d.statut)} style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'inline-block',
                      ...(d.statut === 'submitted' ? { background: '#fef3c7', color: '#92400e' } :
                         d.statut === 'in_review' ? { background: '#dbeafe', color: '#1e40af' } :
                         { background: '#d1fae5', color: '#065f46' })
                    }}>
                      {getStatusLabel(d.statut)}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      ...(d.urgency === 'high' ? { color: '#dc2626', fontWeight: '600' } :
                         d.urgency === 'medium' ? { color: '#f59e0b', fontWeight: '500' } :
                         { color: '#10b981' })
                    }}>
                      {d.urgency === 'high' ? '🔴 Urgent' : 
                       d.urgency === 'medium' ? '🟡 Moyen' : '🟢 Faible'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', color: '#6b7280' }}>
                    {new Date(d.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}