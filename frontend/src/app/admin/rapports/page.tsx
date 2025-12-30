'use client';

import React, { useState } from 'react';
import {
  LogOut, FileText, Users, BarChart3, MessageSquare,
  TrendingUp, Clock, MapPin, AlertTriangle, Download, Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/admin-rapport.module.css';

export default function AdminRapportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('rapports');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Recherche et filtrage
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleLogout = () => router.push('/admin-login');

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);
    router.push(route);
  };

  const handleToggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const handleApplyPeriod = () => {
    alert(`Période sélectionnée: ${startDate} → ${endDate}`);
    setShowDatePicker(false);
  };

  const handleApplyFilter = () => {
    alert(`Filtres appliqués : Type=${typeFilter}, Lieu=${locationFilter}, Statut=${statusFilter}`);
  };

  // Export CSV
  const exportCSV = (filename: string, rows: any[]) => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportMensuel = () => {
    const data = [
      ["Mois", "Incidents", "Résolutions"],
      ["Janvier", 45, 30],
      ["Février", 38, 28],
      ["Mars", 50, 35],
    ];
    exportCSV("rapport_mensuel.csv", data);
  };

  const handleExportAnnuel = () => {
    const data = [
      ["Année", "Incidents", "Résolutions"],
      ["2025", 500, 350],
      ["2024", 480, 340],
    ];
    exportCSV("rapport_annuel.csv", data);
  };

  return (
    <div className={styles.adminDashboard}>
      {/* Menu Top */}
      <div className={styles.adminTopMenu}>
        <div className={styles.logo}>SecuriCité Admin</div>

        <nav>
          <ul>
            <li className={activeTab === 'plaintes' ? styles.active : ''} onClick={() => handleNavigation('plaintes', '/admin/plaintes')}>
              <FileText size={18} /> Plaintes
            </li>
            <li className={activeTab === 'utilisateurs' ? styles.active : ''} onClick={() => handleNavigation('utilisateurs', '/admin/utilisateurs')}>
              <Users size={18} /> Utilisateurs
            </li>
            <li className={activeTab === 'rapports' ? styles.active : ''} onClick={() => handleNavigation('rapports', '/admin/AdminRapport')}>
              <BarChart3 size={18} /> Rapports
            </li>
            <li className={activeTab === 'communication' ? styles.active : ''} onClick={() => handleNavigation('communication', '/admin/communication')}>
              <MessageSquare size={18} /> Communication
            </li>
          </ul>
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {/* Contenu principal */}
      <div className={styles.dashboardContent}>
        <div className={styles.contentWrapper}>
          <h2>Rapports et analyses</h2>
          <p className={styles.subtitle}>
            Rapports et analyses : Obtenez des insights précis sur la criminalité en générant des statistiques détaillées, en suivant les tendances et en identifiant les zones à risque les plus critiques.
          </p>

          {/* Recherche et filtrage */}
          <div className={styles.searchFilter}>
            <h3>Recherche et filtrage : Rechercher des rapports par type, lieu, statut ou période</h3>
            <div className={styles.filterInputs}>
              <input
                type="text"
                placeholder="Type de rapport"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              />
              <input
                type="text"
                placeholder="Lieu"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
              />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">Statut</option>
                <option value="ouvert">Ouvert</option>
                <option value="en_cours">En cours</option>
                <option value="résolu">Résolu</option>
              </select>
              <button className={styles.btn} onClick={handleApplyFilter}>Rechercher</button>
            </div>
          </div>

          {/* Statistiques clés */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Taux de Résolution</h3>
              <div className={styles.statValue}>68%</div>
              <div className={styles.statChange}>
                <TrendingUp size={16} /> +5% vs mois dernier
              </div>
            </div>
            <div className={styles.statCard}>
              <h3>Temps Moyen</h3>
              <div className={styles.statValue}>4.2j</div>
              <div className={styles.statChange}>
                <Clock size={16} /> -0.8j
              </div>
            </div>
            <div className={styles.statCard}>
              <h3>Type fréquent</h3>
              <div className={styles.statValue}>Vol</div>
              <div className={styles.statChange}>
                <AlertTriangle size={16} /> 38%
              </div>
            </div>
          </div>

          {/* Zones à risque */}
          <div className={styles.highRiskZones}>
            <h3>Zones à forte criminalité</h3>
            <ul>
              <li><MapPin size={16} /> Centre-ville — 45 incidents</li>
              <li><MapPin size={16} /> Quartier Nord — 30 incidents</li>
              <li><MapPin size={16} /> Zone Industrielle — 25 incidents</li>
            </ul>
          </div>

          {/* Boutons export / filtrage */}
          <div className={styles.actionButtons}>
            <button className={`${styles.btn} ${styles.btnExport}`} onClick={handleExportMensuel}>
              <Download size={16} /> Export mensuel
            </button>
            <button className={`${styles.btn} ${styles.btnExport}`} onClick={handleExportAnnuel}>
              <Download size={16} /> Export annuel
            </button>

            <div className={styles.periodWrapper}>
              <button className={`${styles.btn} ${styles.btnFilter}`} onClick={handleToggleDatePicker}>
                <Calendar size={16} /> Période
              </button>
              {showDatePicker && (
                <div className={styles.datePicker}>
                  <label>
                    Début :
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </label>
                  <label>
                    Fin :
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  </label>
                  <button className={styles.btn} onClick={handleApplyPeriod}>Appliquer</button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
