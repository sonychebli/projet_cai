import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: 'Accès refusé. Token manquant.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide', error: err });
  }
};
// Middleware optionnel : si token présent, on vérifie, sinon on continue
export const authOptionalMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(); // pas de token → continuer

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch (err) {
    // token invalide → on ignore et continue quand même
  }
  next();
};
