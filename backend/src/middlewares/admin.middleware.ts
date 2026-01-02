// backend/src/middlewares/admin.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; // récupéré par authMiddleware

  if (!user) {
    return res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Accès refusé, rôle admin requis' });
  }

  next();
};
