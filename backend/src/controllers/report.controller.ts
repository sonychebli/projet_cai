import { Request, Response } from 'express';
import Report from '../models/Report';

export const createReport = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // 👈 FIX SIMPLE

    const report = await Report.create({
      ...req.body,
      createdBy: user ? user._id : null
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création du signalement',
      error
    });
  }
};

export const getReports = async (_req: Request, res: Response) => {
  try {
    const reports = await Report.find().populate('createdBy', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des signalements',
      error
    });
  }
};
