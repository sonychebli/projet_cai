import { Request, Response } from 'express';
import Report from '../models/Report';

export const createReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.create({
      ...req.body,
      createdBy: req.user?.id // si connecté
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du signalement', error });
  }
};

export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find().populate('createdBy', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des signalements', error });
  }
};
