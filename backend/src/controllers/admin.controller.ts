import { Request, Response } from 'express';
import User from '../models/User';
import Report from '../models/Report';

// Récupérer tous les utilisateurs
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des utilisateurs',
      error
    });
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error
    });
  }
};

// Mettre à jour le rôle d'un utilisateur
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du rôle',
      error
    });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Supprimer les signalements de cet utilisateur
    await Report.deleteMany({ createdBy: req.params.id });

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error
    });
  }
};

// Dashboard admin - statistiques complètes
export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    // Statistiques utilisateurs
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Statistiques signalements
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'submitted' });
    const inReviewReports = await Report.countDocuments({ status: 'in_review' });
    const resolvedReports = await Report.countDocuments({ status: 'resolved' });

    // Signalements par urgence
    const highUrgency = await Report.countDocuments({ urgency: 'high' });
    const mediumUrgency = await Report.countDocuments({ urgency: 'medium' });
    const lowUrgency = await Report.countDocuments({ urgency: 'low' });

    // Signalements anonymes vs identifiés
    const anonymousReports = await Report.countDocuments({ isAnonymous: true });
    const identifiedReports = await Report.countDocuments({ isAnonymous: false });

    // Derniers signalements
    const latestReports = await Report.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      users: {
        total: totalUsers,
        admin: adminUsers,
        regular: regularUsers
      },
      reports: {
        total: totalReports,
        pending: pendingReports,
        inReview: inReviewReports,
        resolved: resolvedReports
      },
      urgency: {
        high: highUrgency,
        medium: mediumUrgency,
        low: lowUrgency
      },
      reportTypes: {
        anonymous: anonymousReports,
        identified: identifiedReports
      },
      latestReports
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      error
    });
  }
};