const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper pour les headers
const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// ==================== STATISTICS ====================
export const statsService = {
  /**
   * 📊 Statistiques globales
   * Total signalements, résolus, en attente, utilisateurs actifs
   */
  async getGlobalStats() {
    const res = await fetch(`${API_URL}/stats/global`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch global stats');
    return res.json();
  },

  /**
   * 📈 Statistiques par catégorie
   * Répartition par type de crime
   */
  async getByCategory() {
    const res = await fetch(`${API_URL}/stats/by-category`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch category stats');
    return res.json();
  },

  /**
   * 📊 Statistiques par statut
   * Traité, en cours, en attente
   */
  async getByStatus() {
    const res = await fetch(`${API_URL}/stats/by-status`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch status stats');
    return res.json();
  },

  /**
   * 📅 Statistiques mensuelles
   * @param range - '1mois' | '3mois' | '6mois' | '1an'
   */
  async getMonthlyStats(range: string = '6mois') {
    const res = await fetch(`${API_URL}/stats/monthly?range=${range}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch monthly stats');
    return res.json();
  },

  /**
   * 🗺️ Statistiques par zone géographique
   */
  async getByZone() {
    const res = await fetch(`${API_URL}/stats/by-zone`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch zone stats');
    return res.json();
  },

  /**
   * 📊 Tendance hebdomadaire
   */
  async getWeeklyTrend() {
    const res = await fetch(`${API_URL}/stats/weekly`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch weekly trend');
    return res.json();
  }
};