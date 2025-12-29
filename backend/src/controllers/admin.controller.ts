import { Request, Response } from 'express';
import User from '../models/User';
import Report from '../models/Report';

// Lister tous les utilisateurs
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Lister tous les signalements
export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find().populate('user');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Mettre à jour l'état d'un signalement
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: 'Signalement non trouvé' });

    report.status = status;
    await report.save();

    res.json({ message: 'Statut mis à jour', report });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};
