'use client';

import React, { useState, useEffect } from 'react';
import {
  LogOut, FileText, Users, BarChart3, MessageSquare,
  TrendingUp, Clock, MapPin, AlertTriangle, Download, Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService, authService, reportService } from '@/services/api';
import styles from '../../../styles/admin-rapport.module.css';

export default function AdminRapportsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('rapports');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/admin-login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer les stats du dashboard
      const dashboardResponse = await adminService.getDashboardStats();
      if (dashboardResponse.success) {
        setStats(dashboardResponse.data);
      }

      // Récupérer tous les rapports
      const reportsResponse = await adminService.getAllReports({ limit: 100 });
      if (reportsResponse.success) {
        setReports(reportsResponse.data.reports);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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

  const handleToggleDatePicker = () => setShowDatePicker(!showDatePicker);

  const handleApplyPeriod = () => {
    alert(`Période sélectionnée: ${startDate} → ${endDate}`);
    setShowDatePicker(false);
  };

  const handleApplyFilter = async () => {
    try {
      const params: any = { limit: 100 };
      if (statusFilter) {
        const statusMap: any = {
          'ouvert': 'submitted',
          'en_cours': 'in_review',
          'résolu': 'resolved'
        };
        params.status = statusMap[statusFilter];
      }
      if (typeFilter) params.type = typeFilter;

      const response = await adminService.getAllReports(params);
      if (response.success) {
        let filteredReports = response.data.reports;
        
        if (locationFilter) {
          filteredReports = filteredReports.filter((r: any) => 
            r.location.address.toLowerCase().includes(locationFilter.toLowerCase())
          );
        }
        
        setReports(filteredReports);
      }
    } catch (error) {
      console.error('Error filtering reports:', error);
    }
  };

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
    if (!reports.length) {
      alert('Aucune donnée à exporter');
      return;
    }

    const monthlyData = reports.reduce((acc: any, report: any) => {
      const month = new Date(report.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { total: 0, resolved: 0 };
      }
      acc[month].total++;
      if (report.status === 'resolved') {
        acc[month].resolved++;
      }
      return acc;
    }, {});

    const data = [
      ["Mois", "Incidents", "Résolutions"],
      ...Object.entries(monthlyData).map(([month, stats]: any) => [
        month, stats.total, stats.resolved
      ])
    ];
    
    exportCSV("rapport_mensuel.csv", data);
  };

  const handleExportAnnuel = () => {
    if (!reports.length) {
      alert('Aucune donnée à exporter');
      return;
    }

    const yearlyData = reports.reduce((acc: any, report: any) => {
      const year = new Date(report.createdAt).getFullYear();
      if (!acc[year]) {
        acc[year] = { total: 0, resolved: 0 };
      }
      acc[year].total++;
      if (report.status === 'resolved') {
        acc[year].resolved++;
      }
      return acc;
    }, {});

    const data = [
      ["Année", "Incidents", "Résolutions"],
      ...Object.entries(yearlyData).map(([year, stats]: any) => [
        year, stats.total, stats.resolved
      ])
    ];
    
    exportCSV("rapport_annuel.csv", data);
  };

  // Calculs statistiques
  const calculateResolutionRate = () => {
    if (!stats) return '0%';
    const total = stats.totalReports;
    const resolved = stats.resolvedReports;
    return total > 0 ? `${Math.round((resolved / total) * 100)}%` : '0%';
  };

  const calculateAverageTime = () => {
    const resolvedReports = reports.filter(r => r.status === 'resolved' && r.resolvedAt);
    if (resolvedReports.length === 0) return '0j';
    
    const totalDays = resolvedReports.reduce((sum, r) => {
      const created = new Date(r.createdAt).getTime();
      const resolved = new Date(r.resolvedAt).getTime();
      return sum + (resolved - created) / (1000 * 60 * 60 * 24);
    }, 0);
    
    return `${(totalDays / resolvedReports.length).toFixed(1)}j`;
  };

  const getMostFrequentType = () => {
    if (!stats?.reportsByType?.length) return 'N/A';
    const sorted = [...stats.reportsByType].sort((a, b) => b.count - a.count);
    return sorted[0]._id || 'N/A';
  };

  const getHighRiskZones = (): Array<{ location: string; count: number }> => {
    const locationCount: any = {};
    reports.forEach(report => {
      const location = report.location.address;
      locationCount[location] = (locationCount[location] || 0) + 1;
    });

    return Object.entries(locationCount)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count: count as number }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.adminTopMenu}>
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
            <li className={activeTab === 'plaintes' ? styles.active : ''} onClick={() => handleNavigation('plaintes', '/admin/plaintes')}>
              <FileText size={18} /> Plaintes
            </li>
            <li className={activeTab === 'utilisateurs' ? styles.active : ''} onClick={() => handleNavigation('utilisateurs', '/admin/utilisateurs')}>
              <Users size={18} /> Utilisateurs
            </li>
            <li className={activeTab === 'rapports' ? styles.active : ''} onClick={() => handleNavigation('rapports', '/admin/rapports')}>
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

      <div className={styles.dashboardContent}>
        <div className={styles.contentWrapper}>
          <h2>Rapports et analyses</h2>
          <p className={styles.subtitle}>
            Obtenez des insights précis sur la criminalité en générant des statistiques détaillées
          </p>

          <div className={styles.searchFilter}>
            <h3>Recherche et filtrage</h3>
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

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Taux de Résolution</h3>
              <div className={styles.statValue}>{calculateResolutionRate()}</div>
              <div className={styles.statChange}>
                <TrendingUp size={16} /> Basé sur {stats?.totalReports || 0} rapports
              </div>
            </div>
            <div className={styles.statCard}>
              <h3>Temps Moyen</h3>
              <div className={styles.statValue}>{calculateAverageTime()}</div>
              <div className={styles.statChange}>
                <Clock size={16} /> Temps de résolution
              </div>
            </div>
            <div className={styles.statCard}>
              <h3>Type fréquent</h3>
              <div className={styles.statValue}>{getMostFrequentType()}</div>
              <div className={styles.statChange}>
                <AlertTriangle size={16} /> Plus signalé
              </div>
            </div>
          </div>

          <div className={styles.highRiskZones}>
            <h3>Zones à forte criminalité</h3>
            <ul>
              {getHighRiskZones().map((zone, index) => (
                <li key={index}>
                  <MapPin size={16} /> {zone.location} — {zone.count} incidents
                </li>
              ))}
            </ul>
          </div>

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