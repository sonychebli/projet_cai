import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const roleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(403).json({ message: 'Accès refusé' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Permission refusée' });
    next();
  };
};
