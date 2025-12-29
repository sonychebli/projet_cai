import { Router } from 'express';
import { getUsers, getReports, updateReportStatus } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Toutes les routes admin protégées
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/users', getUsers);
router.get('/reports', getReports);
router.patch('/reports/:id', updateReportStatus);

export default router;
