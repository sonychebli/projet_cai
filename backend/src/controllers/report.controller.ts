import { Request, Response } from 'express';
import Report from '../models/Report';
import Comment from '../models/Comment';

// Créer un signalement
export const createReport = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

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

// Récupérer tous les signalements
export const getReports = async (_req: Request, res: Response) => {
  try {
    const reports = await Report.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des signalements',
      error
    });
  }
};

// Récupérer un signalement par ID
export const getReportById = async (req: Request, res: Response) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!report) {
      return res.status(404).json({ message: 'Signalement non trouvé' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération du signalement',
      error
    });
  }
};

// Mettre à jour le statut d'un signalement (Admin uniquement)
export const updateReportStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Signalement non trouvé' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du statut',
      error
    });
  }
};

// Supprimer un signalement (Admin uniquement)
export const deleteReport = async (req: Request, res: Response) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Signalement non trouvé' });
    }

    // Supprimer les commentaires associés
    await Comment.deleteMany({ reportId: req.params.id });

    res.json({ message: 'Signalement supprimé avec succès' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression du signalement',
      error
    });
  }
};

// Ajouter un commentaire
export const addComment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { content } = req.body;

    const comment = await Comment.create({
      reportId: req.params.id,
      userId: user._id,
      content
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de l\'ajout du commentaire',
      error
    });
  }
};

// Récupérer les commentaires d'un signalement
export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ reportId: req.params.id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des commentaires',
      error
    });
  }
};

// Statistiques pour le dashboard
export const getStatistics = async (_req: Request, res: Response) => {
  try {
    const totalReports = await Report.countDocuments();
    const submittedReports = await Report.countDocuments({ status: 'submitted' });
    const inReviewReports = await Report.countDocuments({ status: 'in_review' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    // Statistiques par type de crime
    const crimeTypes = await Report.aggregate([
      { $group: { _id: '$crimeType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Statistiques par urgence
    const urgencyStats = await Report.aggregate([
      { $group: { _id: '$urgency', count: { $sum: 1 } } }
    ]);

    // Signalements récents (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentReports = await Report.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      total: totalReports,
      submitted: submittedReports,
      inReview: inReviewReports,
      resolved: resolvedReports,
      crimeTypes,
      urgencyStats,
      recentReports
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      error
    });
  }
};