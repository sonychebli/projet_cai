'use client';
import React from 'react';
import { useUserContext } from '@/context/UserContext';
import '@/styles/suivi.css';

interface Dossier {
  id: number;
  titre: string;
  statut: 'Soumis' | 'En cours' | 'Résolu';
  date: string;
}

export default function SuiviPage() {
  const { user } = useUserContext();

  // Exemple de dossiers, tu peux remplacer par un fetch API réel
  const dossiers: Dossier[] = [
    { id: 1, titre: 'Vol de vélo', statut: 'En cours', date: '2025-12-01' },
    { id: 2, titre: 'Agression', statut: 'Résolu', date: '2025-11-20' },
    { id: 3, titre: 'Trafic de drogue', statut: 'Soumis', date: '2025-12-15' },
  ];

  return (
    <div className="suivi-page">
      <h1> L'état d’avancement des dossiers</h1>
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
        <td>{d.id}</td>
        <td>{d.titre}</td>
        <td className={d.statut.toLowerCase().replace(' ', '-')}>{d.statut}</td>
        <td>{d.date}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
