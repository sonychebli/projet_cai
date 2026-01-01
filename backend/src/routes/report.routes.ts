import { Router } from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  addComment,
  getComments,
  getStatistics
} from '../controllers/report.controller';
import { authMiddleware, authOptionalMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Routes publiques / semi-publiques
router.post('/', authOptionalMiddleware, createReport); // Créer un signalement (auth ou anonyme)
router.get('/', getReports); // Récupérer tous les signalements
router.get('/statistics', getStatistics); // Statistiques
router.get('/:id', getReportById); // Récupérer un signalement par ID

// Routes protégées (utilisateur connecté)
router.post('/:id/comments', authMiddleware, addComment); // Ajouter un commentaire
router.get('/:id/comments', getComments); // Récupérer les commentaires

// Routes admin uniquement
router.patch('/:id/status', authMiddleware, adminMiddleware, updateReportStatus); // Mettre à jour le statut
router.delete('/:id', authMiddleware, adminMiddleware, deleteReport); // Supprimer un signalement

export default router;