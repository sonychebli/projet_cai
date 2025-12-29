import { Router } from 'express';
import { createReport, getReports } from '../controllers/report.controller';
import { authOptionalMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Créer un signalement (auth ou anonyme)
router.post('/', authOptionalMiddleware, createReport);

// Récupérer tous les signalements
router.get('/', getReports);

export default router;
