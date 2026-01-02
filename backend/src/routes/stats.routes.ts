import express from 'express';
import {
  getGlobalStats,
  getByCategory,
  getByStatus,
  getMonthlyStats,
  getByZone,
  getWeeklyTrend
} from '../controllers/stats.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

// 📊 Toutes les routes stats nécessitent l'authentification
// Si tu veux que certaines stats soient publiques, enlève verifyToken sur ces routes

/**
 * GET /api/stats/global
 * Statistiques globales : total, résolus, en attente, utilisateurs actifs
 */
router.get('/global', authMiddleware, getGlobalStats);

/**
 * GET /api/stats/by-category
 * Répartition par type de crime
 */
router.get('/by-category', authMiddleware, getByCategory);

/**
 * GET /api/stats/by-status
 * Répartition par statut (traité, en cours, en attente)
 */
router.get('/by-status', authMiddleware, getByStatus);

/**
 * GET /api/stats/monthly?range=6mois
 * Évolution mensuelle
 * Query params: range (1mois, 3mois, 6mois, 1an)
 */
router.get('/monthly', authMiddleware, getMonthlyStats);

/**
 * GET /api/stats/by-zone
 * Statistiques par zone géographique (top 10)
 */
router.get('/by-zone', authMiddleware, getByZone);

/**
 * GET /api/stats/weekly
 * Tendance hebdomadaire (6 dernières semaines)
 */
router.get('/weekly', authMiddleware, getWeeklyTrend);

export default router;