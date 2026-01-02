'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Filter, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useUserContext } from '@/context/UserContext';
import { statsService } from '@/services/stats.service';
import '@/styles/statistics.css';

interface GlobalStats {
  total: number;
  resolved: number;
  pending: number;
  inReview: number;
  activeUsers: number;
  resolutionRate: number;
}

interface ChartData {
  name?: string;
  mois?: string;
  semaine?: string;
  value?: number;
  signalements?: number;
  résolus?: number;
  color?: string;
  [key: string]: any;
}

interface ZoneData {
  zone: string;
  signalements: number;
  résolus: number;
  taux: number;
  tendance: 'up' | 'down' | 'stable';
}

export default function StatisticsComponent() {
  const { user } = useUserContext();
  const [timeRange, setTimeRange] = useState('6mois');
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour les données backend
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    total: 0,
    resolved: 0,
    pending: 0,
    inReview: 0,
    activeUsers: 0,
    resolutionRate: 0
  });
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [byCategory, setByCategory] = useState<ChartData[]>([]);
  const [statusData, setStatusData] = useState<ChartData[]>([]);
  const [zoneData, setZoneData] = useState<ZoneData[]>([]);
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les données au montage et quand timeRange change
  useEffect(() => {
    loadAllStats();
  }, [timeRange]);

  const loadAllStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Charger toutes les stats en parallèle
      const [global, category, status, monthly, zone, weekly] = await Promise.all([
        statsService.getGlobalStats(),
        statsService.getByCategory(),
        statsService.getByStatus(),
        statsService.getMonthlyStats(timeRange),
        statsService.getByZone(),
        statsService.getWeeklyTrend()
      ]);

      setGlobalStats(global);
      setByCategory(category);
      setStatusData(status);
      setMonthlyData(monthly);
      setZoneData(zone);
      setWeeklyData(weekly);
      
    } catch (err: any) {
      console.error('Erreur lors du chargement des stats:', err);
      setError('Impossible de charger les statistiques. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    // Export CSV des données
    const csvContent = [
      ['Type', 'Valeur'],
      ['Total Signalements', globalStats.total],
      ['Résolus', globalStats.resolved],
      ['En attente', globalStats.pending],
      ['Utilisateurs actifs', globalStats.activeUsers],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statistiques-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleFilter = () => {
    alert('Filtres appliqués');
  };

  if (error) {
    return (
      <div className="statistics-section">
        <div className="error-message" style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#EF4444',
          backgroundColor: '#FEE2E2',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          <AlertTriangle size={48} />
          <h2>Erreur</h2>
          <p>{error}</p>
          <button 
            onClick={loadAllStats}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#4a6cf7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-section">
      {/* Header */}
      <header className="stats-header">
        <div className="header-content">
          <h1>
            <TrendingUp size={28} />
            Tableau de Bord Statistiques
          </h1>
          <p className="subtitle">Analyses et tendances des signalements</p>
        </div>
        
        <div className="header-actions">
          <div className="filter-group">
            <button className="filter-btn" onClick={handleFilter}>
              <Filter size={16} />
              Filtres
            </button>
            <select 
              className="time-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              disabled={isLoading}
            >
              <option value="1mois">1 mois</option>
              <option value="3mois">3 mois</option>
              <option value="6mois">6 mois</option>
              <option value="1an">1 an</option>
            </select>
            <button className="export-btn" onClick={exportData} disabled={isLoading}>
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner">Chargement des statistiques...</div>
        </div>
      ) : (
        <>
          {/* Cartes de synthèse */}
          <div className="summary-cards">
            <div className="summary-card total">
              <div className="card-icon">
                <AlertTriangle size={24} />
              </div>
              <div className="card-content">
                <h3>Total Signalements</h3>
                <div className="card-value">{globalStats.total}</div>
                <div className="card-change positive">
                  Taux de résolution : {globalStats.resolutionRate}%
                </div>
              </div>
            </div>

            <div className="summary-card resolved">
              <div className="card-icon">
                <CheckCircle size={24} />
              </div>
              <div className="card-content">
                <h3>Résolus</h3>
                <div className="card-value">{globalStats.resolved}</div>
                <div className="card-change positive">
                  {globalStats.resolutionRate}% de taux de résolution
                </div>
              </div>
            </div>

            <div className="summary-card pending">
              <div className="card-icon">
                <Clock size={24} />
              </div>
              <div className="card-content">
                <h3>En attente</h3>
                <div className="card-value">{globalStats.pending}</div>
                <div className="card-change neutral">
                  {globalStats.inReview} en cours de traitement
                </div>
              </div>
            </div>

            <div className="summary-card users">
              <div className="card-icon">
                <Users size={24} />
              </div>
              <div className="card-content">
                <h3>Utilisateurs actifs</h3>
                <div className="card-value">{globalStats.activeUsers}</div>
                <div className="card-change positive">Contributeurs actifs</div>
              </div>
            </div>
          </div>

          {/* Graphiques principaux */}
          <div className="charts-section">
            {/* Graphique 1: Évolution mensuelle */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Évolution des Signalements</h3>
                <span className="chart-subtitle">Sur les {timeRange === '1an' ? '12' : timeRange === '6mois' ? '6' : timeRange === '3mois' ? '3' : '1'} derniers mois</span>
              </div>
              <div className="chart-container">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="signalements" fill="#4a6cf7" name="Signalements" />
                      <Bar dataKey="résolus" fill="#10B981" name="Résolus" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    Aucune donnée disponible pour cette période
                  </p>
                )}
              </div>
            </div>

            {/* Graphique 2: Répartition par catégorie */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Répartition par Catégorie</h3>
                <span className="chart-subtitle">Pourcentage des types d'infractions</span>
              </div>
              <div className="chart-container">
                {byCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={byCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {byCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>

            {/* Graphique 3: Statut des signalements */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Statut des Signalements</h3>
                <span className="chart-subtitle">Distribution par état</span>
              </div>
              <div className="chart-container">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>

            {/* Graphique 4: Tendance temporelle */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>Tendance Temporelle</h3>
                <span className="chart-subtitle">Évolution hebdomadaire</span>
              </div>
              <div className="chart-container">
                {weeklyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semaine" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="signalements" stroke="#4a6cf7" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="résolus" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tableau des zones géographiques */}
          <div className="table-section">
            <div className="table-header">
              <h3>Performance par Zone Géographique</h3>
              <span className="table-subtitle">Détails et taux de résolution</span>
            </div>
            <div className="table-container">
              {zoneData.length > 0 ? (
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th>Zone</th>
                      <th>Signalements</th>
                      <th>Résolus</th>
                      <th>Taux de Résolution</th>
                      <th>Tendance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zoneData.map((item, index) => (
                      <tr key={index}>
                        <td className="zone-name">{item.zone}</td>
                        <td className="signalements-count">{item.signalements}</td>
                        <td className="resolved-count">{item.résolus}</td>
                        <td>
                          <div className="progress-bar-container">
                            <div 
                              className="progress-bar" 
                              style={{ width: `${item.taux}%` }}
                            >
                              <span>{item.taux}%</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`trend-indicator ${item.tendance}`}>
                            {item.tendance === 'up' ? '↗' : item.tendance === 'down' ? '↘' : '→'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="action-btn"
                            onClick={() => alert(`Détails pour ${item.zone}`)}
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                  Aucune donnée disponible
                </p>
              )}
            </div>
          </div>

          {/* Insights et recommandations */}
          <div className="insights-section">
            <h3>📈 Insights et Recommandations</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon positive">📊</div>
                <h4>Taux de résolution</h4>
                <p>
                  {globalStats.resolutionRate > 70 
                    ? `Excellent taux de résolution de ${globalStats.resolutionRate}%. Continuez !`
                    : `Taux de résolution à ${globalStats.resolutionRate}%. Objectif : 70%+`
                  }
                </p>
              </div>
              <div className="insight-card">
                <div className="insight-icon warning">⚠️</div>
                <h4>Signalements en attente</h4>
                <p>
                  {globalStats.pending > 0 
                    ? `${globalStats.pending} signalement(s) en attente de traitement.`
                    : 'Aucun signalement en attente. Excellent !'
                  }
                </p>
              </div>
              <div className="insight-card">
                <div className="insight-icon info">⏱️</div>
                <h4>En cours de traitement</h4>
                <p>{globalStats.inReview} signalement(s) actuellement en cours de traitement.</p>
              </div>
              <div className="insight-card">
                <div className="insight-icon success">👥</div>
                <h4>Engagement citoyen</h4>
                <p>{globalStats.activeUsers} utilisateur(s) actif(s). La plateforme est utilisée !</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Footer de la section */}
      <footer className="stats-footer">
        <p>
          <Calendar size={16} />
          Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
        </p>
        <p className="user-info">
          Connecté en tant que : <strong>{user?.name || 'Utilisateur'}</strong> 
          {user?.role === 'admin' && <span className="admin-badge"> (Administrateur)</span>}
        </p>
      </footer>
    </div>
  );
}