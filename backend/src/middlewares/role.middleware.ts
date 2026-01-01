import { Request, Response, NextFunction } from 'express';

// Middleware pour vérifier le rôle admin
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Rôle admin requis.' });
  }

  next();
};