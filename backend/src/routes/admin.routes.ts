import { Router } from 'express';
import AdminController from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { verifyAdmin } from '../middlewares/admin.middleware';

const router = Router();

router.get('/dashboard', authMiddleware, verifyAdmin, AdminController.getDashboardStats);
router.get('/users', authMiddleware, verifyAdmin, AdminController.getAllUsers);
router.put('/users/:id/role', authMiddleware, verifyAdmin, AdminController.updateUserRole);
router.delete('/users/:id', authMiddleware, verifyAdmin, AdminController.deleteUser);

router.get('/reports', authMiddleware, verifyAdmin, AdminController.getAllReports);
router.put('/reports/:id/status', authMiddleware, verifyAdmin, AdminController.updateReportStatus);
router.delete('/reports/:id', authMiddleware, verifyAdmin, AdminController.deleteReport);

router.get('/messages', authMiddleware, verifyAdmin, AdminController.getMessages);
router.post('/messages/respond', authMiddleware, verifyAdmin, AdminController.sendResponse);

export default router;
