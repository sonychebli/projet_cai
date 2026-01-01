'use client';
import React, { useEffect, useState } from 'react';
import '@/styles/suivi.css';
import { useUserContext } from '@/context/UserContext';
import { reportService } from '@/services/api';

interface Dossier {
  id: number;
  titre: string;
  statut: 'Soumis' | 'En cours' | 'Résolu';
  date: string;
  type?: string;
  description?: string;
}

export default function SuiviComponent() {
  const { user } = useUserContext();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossiers = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await reportService.getUserReports(Number(user.id));
        
        // Mapper les données du backend vers le format du composant
        const mappedDossiers = data.map((report: any) => ({
          id: report.id,
          titre: report.title || report.type || 'Sans titre',
          statut: report.status || 'Soumis',
          date: report.createdAt || report.date,
          type: report.type,
          description: report.description
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

  if (loading) {
    return (
      <div className="suivi-section">
        <div className="loading-spinner">
          <p>Chargement de vos signalements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="suivi-section">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="suivi-section">
      <h1>L'état d'avancement des dossiers</h1>
      
      {dossiers.length === 0 ? (
        <div className="empty-state">
          <p>📋 Aucun signalement pour le moment.</p>
          <p>Vos signalements apparaîtront ici une fois soumis.</p>
        </div>
      ) : (
        <table className="suivi-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {dossiers.map(d => (
              <tr key={d.id}>
                <td>#{d.id}</td>
                <td>{d.titre}</td>
                <td className={`status-badge ${d.statut.toLowerCase().replace(' ', '-')}`}>
                  {d.statut}
                </td>
                <td>{new Date(d.date).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}