import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JWT_SECRET } from '../config/env';

// Middleware obligatoire (utilisateur doit être connecté)
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token manquant, authentification requise' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide', error });
  }
};

// Middleware optionnel (permet signalements anonymes)
export const authOptionalMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        (req as any).user = user;
      }
    }

    next();
  } catch (error) {
    // En cas d'erreur de token, on continue sans utilisateur (anonyme)
    next();
  }
};