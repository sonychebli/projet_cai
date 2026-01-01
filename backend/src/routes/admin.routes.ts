import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDashboardStats
} from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/role.middleware';

const router = Router();

// Toutes les routes admin nécessitent authentification + rôle admin
router.use(authMiddleware, adminMiddleware);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Gestion des utilisateurs
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;