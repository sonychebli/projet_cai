'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Filter, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useUserContext } from '@/context/UserContext';
import '@/styles/statistics.css';

// Données de démonstration
const monthlyData = [
  { mois: 'Jan', signalements: 45, résolus: 32 },
  { mois: 'Fév', signalements: 52, résolus: 38 },
  { mois: 'Mar', signalements: 48, résolus: 35 },
  { mois: 'Avr', signalements: 60, résolus: 45 },
  { mois: 'Mai', signalements: 55, résolus: 40 },
  { mois: 'Juin', signalements: 65, résolus: 48 },
];

const byCategory = [
  { name: 'Agression', value: 35, color: '#FF6B6B' },
  { name: 'Vol', value: 25, color: '#4ECDC4' },
  { name: 'Trafic', value: 20, color: '#FFD166' },
  { name: 'Cyber', value: 15, color: '#06D6A0' },
  { name: 'Autres', value: 5, color: '#118AB2' },
];

const statusData = [
  { name: 'Traité', value: 60, color: '#10B981' },
  { name: 'En cours', value: 25, color: '#F59E0B' },
  { name: 'En attente', value: 15, color: '#EF4444' },
];

const zoneData = [
  { zone: 'Centre-ville', signalements: 68, résolus: 52, taux: 76, tendance: 'up' },
  { zone: 'Quartier Nord', signalements: 45, résolus: 32, taux: 71, tendance: 'stable' },
  { zone: 'Quartier Sud', signalements: 38, résolus: 25, taux: 66, tendance: 'down' },
  { zone: 'Périphérie', signalements: 34, résolus: 24, taux: 71, tendance: 'up' },
  { zone: 'Zone Industrielle', signalements: 28, résolus: 18, taux: 64, tendance: 'stable' },
];

export default function StatisticsComponent() {
  const { user } = useUserContext();
  const [timeRange, setTimeRange] = useState('6mois');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Simuler le chargement des données
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const exportData = () => {
    alert('Export des données en CSV...');
    // Ici vous implémenteriez l'export réel
  };

  const handleFilter = () => {
    alert('Filtres appliqués');
  };

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
            >
              <option value="1mois">1 mois</option>
              <option value="3mois">3 mois</option>
              <option value="6mois">6 mois</option>
              <option value="1an">1 an</option>
            </select>
            <button className="export-btn" onClick={exportData}>
              <Download size={16} />
              Exporter
            </button>
          </div>
        </div>
      </header>

      {/* Cartes de synthèse */}
      <div className="summary-cards">
        <div className="summary-card total">
          <div className="card-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="card-content">
            <h3>Total Signalements</h3>
            <div className="card-value">238</div>
            <div className="card-change positive">+12% vs période précédente</div>
          </div>
        </div>

        <div className="summary-card resolved">
          <div className="card-icon">
            <CheckCircle size={24} />
          </div>
          <div className="card-content">
            <h3>Résolus</h3>
            <div className="card-value">172</div>
            <div className="card-change positive">72% de taux de résolution</div>
          </div>
        </div>

        <div className="summary-card pending">
          <div className="card-icon">
            <Clock size={24} />
          </div>
          <div className="card-content">
            <h3>En attente</h3>
            <div className="card-value">45</div>
            <div className="card-change neutral">Moyenne : 4.2 jours</div>
          </div>
        </div>

        <div className="summary-card users">
          <div className="card-icon">
            <Users size={24} />
          </div>
          <div className="card-content">
            <h3>Utilisateurs actifs</h3>
            <div className="card-value">156</div>
            <div className="card-change positive">+8 nouveaux ce mois</div>
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="charts-section">
        {/* Graphique 1: Évolution mensuelle */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Évolution des Signalements</h3>
            <span className="chart-subtitle">Sur les 6 derniers mois</span>
          </div>
          <div className="chart-container">
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
          </div>
        </div>

        {/* Graphique 2: Répartition par catégorie */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Répartition par Catégorie</h3>
            <span className="chart-subtitle">Pourcentage des types d'infractions</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={byCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(((percent ?? 0) * 100)).toFixed(0)}%`}
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
          </div>
        </div>

        {/* Graphique 3: Statut des signalements */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Statut des Signalements</h3>
            <span className="chart-subtitle">Distribution par état</span>
          </div>
          <div className="chart-container">
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
          </div>
        </div>

        {/* Graphique 4: Tendance temporelle */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Tendance Temporelle</h3>
            <span className="chart-subtitle">Évolution hebdomadaire</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={[
                  { semaine: 'S1', signalements: 15, résolus: 10 },
                  { semaine: 'S2', signalements: 22, résolus: 16 },
                  { semaine: 'S3', signalements: 18, résolus: 12 },
                  { semaine: 'S4', signalements: 25, résolus: 18 },
                  { semaine: 'S5', signalements: 20, résolus: 15 },
                  { semaine: 'S6', signalements: 28, résolus: 20 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semaine" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="signalements" stroke="#4a6cf7" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="résolus" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
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
        </div>
      </div>

      {/* Insights et recommandations */}
      <div className="insights-section">
        <h3>📈 Insights et Recommandations</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon positive">📊</div>
            <h4>Tendance positive</h4>
            <p>Le taux de résolution a augmenté de 8% ce mois-ci. Continuez sur cette lancée !</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon warning">⚠️</div>
            <h4>Zone à surveiller</h4>
            <p>Le Quartier Sud montre une baisse de performance (-5%). Renforcez les patrouilles.</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon info">⏱️</div>
            <h4>Temps de traitement</h4>
            <p>Le temps moyen de traitement est de 4.2 jours. Objectif : atteindre 3.5 jours.</p>
          </div>
          <div className="insight-card">
            <div className="insight-icon success">👥</div>
            <h4>Engagement citoyen</h4>
            <p>+8 nouveaux utilisateurs actifs. La plateforme gagne en popularité.</p>
          </div>
        </div>
      </div>

      {/* Footer de la section */}
      <footer className="stats-footer">
        <p>
          <Calendar size={16} />
          Dernière mise à jour : Aujourd'hui à 14:30
        </p>
        <p className="user-info">
          Connecté en tant que : <strong>{user?.name || 'Utilisateur'}</strong> 
          {user?.role === 'admin' && <span className="admin-badge"> (Administrateur)</span>}
        </p>
      </footer>
    </div>
  );
}