import { Router } from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  addComment,
  getComments,
  getStatistics,
  getReportsByLocation,
  getGeographicStats
} from '../controllers/report.controller';
import { authMiddleware, authOptionalMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Routes publiques / semi-publiques
router.post('/', authOptionalMiddleware, createReport); // Créer un signalement (auth ou anonyme)
router.get('/', getReports); // Récupérer tous les signalements
router.get('/statistics', getStatistics); // Statistiques générales

// 🗺️ Routes de géolocalisation
router.get('/location', getReportsByLocation); // Signalements par zone géographique
router.get('/geographic-stats', getGeographicStats); // Statistiques géographiques (heatmap)

// Route utilisateur spécifique - DOIT être AVANT '/:id'
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const Report = (await import('../models/Report')).default;
    
    const reports = await Report.find({ createdBy: req.params.userId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des signalements de l\'utilisateur',
      error
    });
  }
});

router.get('/:id', getReportById); // Récupérer un signalement par ID

// Routes protégées (utilisateur connecté)
router.post('/:id/comments', authMiddleware, addComment); // Ajouter un commentaire
router.get('/:id/comments', getComments); // Récupérer les commentaires

// Routes admin uniquement
router.patch('/:id/status', authMiddleware, adminMiddleware, updateReportStatus); // Mettre à jour le statut
router.delete('/:id', authMiddleware, adminMiddleware, deleteReport); // Supprimer un signalement

export default router;